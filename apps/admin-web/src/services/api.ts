import axios from 'axios';
import type { AdminListItem, MockLoginPayload, MockLoginResponse } from '../types/auth';
import type { ChatMessage, Ticket } from '../types/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5092';

export const api = axios.create({
  baseURL: API_URL,
});

export async function fetchAdmins(): Promise<AdminListItem[]> {
  const response = await api.get<AdminListItem[]>('/api/admins');
  return response.data;
}

export async function loginMock(payload: MockLoginPayload): Promise<MockLoginResponse> {
  const response = await api.post<MockLoginResponse>('/api/admin/login-mock', payload);
  return response.data;
}

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
