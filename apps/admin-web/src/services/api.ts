import axios from 'axios';
import type { AdminDisplayResponse, ChatMessage, Ticket } from '../types/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5092';

const api = axios.create({
  baseURL: API_URL,
});

export async function fetchTickets(): Promise<Ticket[]> {
  const response = await api.get<Ticket[]>('/api/tickets');
  return response.data;
}

export async function fetchMessages(ticketId: number): Promise<ChatMessage[]> {
  const response = await api.get<ChatMessage[]>(`/api/tickets/${ticketId}/messages`);
  return response.data;
}

export async function closeTicket(ticketId: number): Promise<void> {
  await api.post(`/api/tickets/${ticketId}/close`);
}

export async function fetchAdminDisplayName(): Promise<string> {
  const response = await api.get<AdminDisplayResponse>('/api/meta/admin-display');
  return response.data.displayName;
}
