import { io, Socket } from 'socket.io-client';
import type { ChatMessage, Ticket } from '../types/chat';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5092';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
    });
  }

  return socket;
}

export function connectSocket(): Socket {
  const client = getSocket();

  if (!client.connected) {
    client.connect();
  }

  return client;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
  }
}

export function onNewTicket(handler: (ticket: Ticket) => void): () => void {
  const client = getSocket();
  client.off('ticket:new');
  client.on('ticket:new', handler);
  return () => client.off('ticket:new', handler);
}

export function onTicketClosed(handler: (ticket: Ticket) => void): () => void {
  const client = getSocket();
  client.off('ticket:closed');
  client.on('ticket:closed', handler);
  return () => client.off('ticket:closed', handler);
}

export function onTicketMessage(handler: (message: ChatMessage) => void): () => void {
  const client = getSocket();
  client.off('admin:ticket-message');
  client.on('admin:ticket-message', handler);
  return () => client.off('admin:ticket-message', handler);
}

export function joinTicket(ticketId: number): Promise<void> {
  const client = getSocket();

  return new Promise((resolve, reject) => {
    client.emit('ticket:join', ticketId, (response: { ok: boolean; message?: string }) => {
      if (response && response.ok) {
        resolve();
        return;
      }

      reject(new Error(response?.message || 'Unable to join ticket room'));
    });
  });
}

export function sendTicketMessage(payload: {
  ticketId: number;
  senderType: string;
  messageText: string;
}): Promise<ChatMessage> {
  const client = getSocket();

  return new Promise((resolve, reject) => {
    client.emit('ticket:message', payload, (response: { ok: boolean; message?: string | ChatMessage }) => {
      if (response && response.ok && response.message && typeof response.message !== 'string') {
        resolve(response.message);
        return;
      }

      reject(new Error(typeof response?.message === 'string' ? response.message : 'Unable to send message'));
    });
  });
}
