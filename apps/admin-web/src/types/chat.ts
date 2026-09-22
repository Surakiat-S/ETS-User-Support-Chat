export interface Ticket {
  id: number;
  locationId: number;
  shiftName: string;
  category: string;
  status: string;
  openedAt: string;
  closedAt?: string | null;
  latestMessageText?: string;
  latestMessageAt?: string | null;
}

export interface ChatMessage {
  id?: number;
  ticketId: number;
  senderType: string;
  messageText: string;
  createdAt: string;
}
