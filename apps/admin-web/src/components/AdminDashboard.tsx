import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/auth-context';
import { closeTicket, fetchMessages, fetchTickets } from '../services/api';
import {
  connectSocket,
  disconnectSocket,
  joinTicket,
  onNewTicket,
  onTicketClosed,
  onTicketMessage,
  sendTicketMessage,
} from '../services/socket';
import type { ChatMessage, Ticket } from '../types/chat';

function isDuplicateMessage(previous: ChatMessage[], incoming: ChatMessage): boolean {
  const lastMessage = previous[previous.length - 1];

  if (!lastMessage) {
    return false;
  }

  return (
    lastMessage.ticketId === incoming.ticketId &&
    lastMessage.senderType === incoming.senderType &&
    lastMessage.messageText === incoming.messageText &&
    Math.abs(new Date(lastMessage.createdAt).getTime() - new Date(incoming.createdAt).getTime()) < 1000
  );
}

function getTicketActivityTime(ticket: Ticket): string {
  return ticket.latestMessageAt || ticket.openedAt;
}

function getTicketPreview(ticket: Ticket): string {
  return String(ticket.latestMessageText || '').trim() || 'ยังไม่มีข้อความล่าสุด';
}

function updateTicketWithLatestMessage(current: Ticket[], message: ChatMessage): Ticket[] {
  const next = current.map((ticket) =>
    ticket.id === message.ticketId
      ? {
          ...ticket,
          latestMessageText: message.messageText,
          latestMessageAt: message.createdAt,
        }
      : ticket,
  );

  next.sort((left, right) => {
    return new Date(getTicketActivityTime(right)).getTime() - new Date(getTicketActivityTime(left)).getTime();
  });

  return next;
}

export function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [unreadTickets, setUnreadTickets] = useState<Set<number>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeTicketRef = useRef<Ticket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const windowFocusedRef = useRef(true);
  const defaultTitleRef = useRef('ศูนย์ควบคุม ETS');

  useEffect(() => {
    defaultTitleRef.current = document.title || 'ศูนย์ควบคุม ETS';
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => undefined);
    }
  }, []);

  function playNotificationSound() {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Audio play failed:', error);
      });
    }
  }

  function showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, { body, icon: '/favicon.svg' });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  function shouldSendBrowserNotification(): boolean {
    return document.hidden || !windowFocusedRef.current;
  }

  function notifyAttention(title: string, body: string) {
    playNotificationSound();

    if (shouldSendBrowserNotification()) {
      showNotification(title, body);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    activeTicketRef.current = activeTicket;
  }, [activeTicket]);

  useEffect(() => {
    function handleFocus() {
      windowFocusedRef.current = true;
    }

    function handleBlur() {
      windowFocusedRef.current = false;
    }

    windowFocusedRef.current = document.hasFocus();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    const unreadCount = unreadTickets.size;
    document.title =
      unreadCount > 0 ? `(${unreadCount}) ${defaultTitleRef.current}` : defaultTitleRef.current;

    return () => {
      document.title = defaultTitleRef.current;
    };
  }, [unreadTickets]);

  useEffect(() => {
    let isMounted = true;

    fetchTickets()
      .then((ticketItems) => {
        if (isMounted) {
          setTickets(ticketItems);
        }
      })
      .catch((error) => {
        console.error('Initial dashboard load failed:', error);
      });

    connectSocket();

    const disposeNewTicket = onNewTicket((ticket) => {
      setTickets((current) => {
        if (current.some((item) => item.id === ticket.id)) {
          return current;
        }

        notifyAttention('เคสใหม่', `มีเคสใหม่จากสถานี ${ticket.locationId} (${ticket.category})`);

        return [ticket, ...current];
      });

      if (!activeTicketRef.current || activeTicketRef.current.id !== ticket.id) {
        setUnreadTickets((current) => new Set(current).add(ticket.id));
      }
    });

    const disposeClosedTicket = onTicketClosed((ticket) => {
      setTickets((current) => current.filter((item) => item.id !== ticket.id));
      setActiveTicket((current) => (current && current.id === ticket.id ? null : current));
      setUnreadTickets((current) => {
        const next = new Set(current);
        next.delete(ticket.id);
        return next;
      });
    });

    const disposeTicketMessage = onTicketMessage((message) => {
      setTickets((current) => updateTicketWithLatestMessage(current, message));

      if (!activeTicketRef.current || activeTicketRef.current.id !== message.ticketId) {
        if (message.senderType !== 'Admin') {
          setUnreadTickets((current) => new Set(current).add(message.ticketId));
          notifyAttention('ข้อความใหม่', `มีข้อความใหม่ในเคส #${message.ticketId}`);
        }
      }

      setMessages((current) => {
        if (
          !activeTicketRef.current ||
          activeTicketRef.current.id !== message.ticketId ||
          isDuplicateMessage(current, message)
        ) {
          return current;
        }

        return [...current, message];
      });

      setActiveTicket((current) => {
        if (!current || current.id !== message.ticketId) {
          return current;
        }

        return {
          ...current,
          latestMessageText: message.messageText,
          latestMessageAt: message.createdAt,
        };
      });
    });

    return () => {
      isMounted = false;
      disposeNewTicket();
      disposeClosedTicket();
      disposeTicketMessage();
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (!activeTicket) {
      setMessages([]);
      return;
    }

    setUnreadTickets((current) => {
      if (!current.has(activeTicket.id)) {
        return current;
      }

      const next = new Set(current);
      next.delete(activeTicket.id);
      return next;
    });

    let isMounted = true;

    fetchMessages(activeTicket.id)
      .then((items) => {
        if (isMounted) {
          setMessages(items);
          if (items.length > 0) {
            const latestMessage = items[items.length - 1];

            setTickets((current) => updateTicketWithLatestMessage(current, latestMessage));
            setActiveTicket((current) => {
              if (!current || current.id !== activeTicket.id) {
                return current;
              }

              return {
                ...current,
                latestMessageText: latestMessage.messageText,
                latestMessageAt: latestMessage.createdAt,
              };
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

    joinTicket(activeTicket.id).catch((error) => {
      console.error('Error joining ticket room:', error);
    });

    return () => {
      isMounted = false;
    };
  }, [activeTicket]);

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeTicket || !newMessage.trim() || isSending) {
      return;
    }

    setIsSending(true);

    try {
      await sendTicketMessage({
        ticketId: activeTicket.id,
        senderType: 'Admin',
        messageText: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }

  async function handleCloseTicket() {
    if (!activeTicket) {
      return;
    }

    try {
      await closeTicket(activeTicket.id);
      setTickets((current) => current.filter((item) => item.id !== activeTicket.id));
      setActiveTicket(null);
      setMessages([]);
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-100 text-gray-800">
      <header className="z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-bold text-white">
            ET
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">ศูนย์ควบคุม ETS</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">
              กำลังใช้งาน: <span className="text-blue-600">{admin?.displayName || '-'}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            ออกจากระบบ
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-1/4 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 p-4 text-lg font-semibold">
            เคสที่เปิดอยู่ ({tickets.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((ticket) => {
              const isUnread = unreadTickets.has(ticket.id);

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setActiveTicket(ticket)}
                  className={`block w-full border-b border-gray-100 p-4 text-left transition-colors ${
                    activeTicket?.id === ticket.id
                      ? 'border-l-4 border-blue-500 bg-blue-50'
                      : 'border-l-4 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-800'}`}>เคส #{ticket.id}</span>
                      <span className={`max-w-[140px] truncate text-sm ${isUnread ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                        - {ticket.category}
                      </span>
                      {isUnread ? <span className="flex h-2 w-2 rounded-full bg-red-500 shadow-sm animate-pulse"></span> : null}
                    </div>
                    <span className="text-xs text-gray-500">{new Date(getTicketActivityTime(ticket)).toLocaleTimeString()}</span>
                  </div>
                  <div className={`truncate text-sm ${isUnread ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
                    {getTicketPreview(ticket)}
                  </div>
                </button>
              );
            })}

            {tickets.length === 0 ? <div className="p-8 text-center text-gray-500">ไม่มีเคสที่เปิดอยู่</div> : null}
          </div>
        </aside>

        <main className="flex flex-1 flex-col bg-gray-50">
          {activeTicket ? (
            <>
              <div className="z-10 flex items-center border-b border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-lg font-semibold">
                  เคส #{activeTicket.id} - {activeTicket.category}
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((message) => {
                  const isAdminMessage = message.senderType === 'Admin';

                  return (
                    <div
                      key={`${message.id || message.createdAt}-${message.senderType}`}
                      className={`flex ${isAdminMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isAdminMessage
                            ? 'rounded-br-none bg-blue-600 text-white'
                            : 'rounded-bl-none border border-gray-200 bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        <div className="text-sm">{message.messageText}</div>
                        <div
                          className={`mt-1 text-right text-[10px] ${
                            isAdminMessage ? 'text-blue-200' : 'text-gray-400'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-200 bg-white p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    placeholder="พิมพ์ข้อความ..."
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSending ? 'กำลังส่ง...' : 'ส่ง'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-400">เลือกเคสจากคิวเพื่อเริ่มแชท</div>
          )}
        </main>

        <aside className="flex w-1/4 flex-col border-l border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 p-4 text-lg font-semibold">รายละเอียดเคส</div>
          {activeTicket ? (
            <div className="flex h-full flex-col p-6">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="mb-1 text-sm text-gray-500">สถานะ</div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {activeTicket.status}
                  </span>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">หมวดปัญหา</div>
                  <div className="font-medium">{activeTicket.category}</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">รหัสสถานี</div>
                  <div className="font-medium">{activeTicket.locationId}</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">กะ</div>
                  <div className="font-medium">{activeTicket.shiftName}</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">เวลาเปิดเคส</div>
                  <div className="font-medium">{new Date(activeTicket.openedAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">บทบาทผู้ใช้</div>
                  <div className="font-medium">{admin?.role || '-'}</div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={handleCloseTicket}
                  className="w-full rounded-md border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  ปิดเคส
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-400">เลือกเคสเพื่อดูรายละเอียด</div>
          )}
        </aside>
      </div>
    </div>
  );
}
