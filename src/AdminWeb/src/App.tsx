import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';

interface Ticket {
  id: number;
  locationId: number;
  shiftName: string;
  category: string;
  status: string;
  openedAt: string;
}

interface ChatMessage {
  id?: number;
  ticketId: number;
  senderType: string;
  messageText: string;
  createdAt: string;
}

const API_URL = 'http://localhost:5091';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch active tickets on mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets`);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Initialize SignalR
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/chatHub`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      const startConnection = async () => {
        try {
          if (connection.state === signalR.HubConnectionState.Disconnected) {
            await connection.start();
            console.log('Connected to SignalR');
          }

          // Clean up existing handlers before adding new ones
          connection.off('NewTicket');
          connection.off('ReceiveMessage');

          connection.on('NewTicket', (ticket: Ticket) => {
            setTickets((prev) => {
              if (prev.find(t => t.id === ticket.id)) return prev;
              return [ticket, ...prev];
            });
          });

          connection.on('ReceiveMessage', (ticketId: number, sender: string, message: string) => {
            const chatMsg: ChatMessage = {
              ticketId,
              senderType: sender,
              messageText: message,
              createdAt: new Date().toISOString()
            };
            
            setActiveTicket((currentActive) => {
              if (currentActive && currentActive.id === ticketId) {
                setMessages((prev) => {
                  // Final safety check: Don't add if the last message is identical (simple de-dupe)
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg && 
                      lastMsg.messageText === message && 
                      lastMsg.senderType === sender &&
                      (new Date().getTime() - new Date(lastMsg.createdAt).getTime() < 1000)) {
                    return prev;
                  }
                  return [...prev, chatMsg];
                });
              }
              return currentActive;
            });
          });
        } catch (e) {
          console.error('SignalR Connection Error: ', e);
        }
      };

      startConnection();

      return () => {
        connection.off('NewTicket');
        connection.off('ReceiveMessage');
      };
    }
  }, [connection]);

  // Handle active ticket change
  useEffect(() => {
    if (activeTicket) {
      fetchMessages(activeTicket.id);
      
      // Join ticket group
      if (connection && connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke('JoinTicketGroup', activeTicket.id.toString())
          .catch(err => console.error('Error joining group:', err));
      }
    } else {
      setMessages([]);
    }
  }, [activeTicket, connection]);

  const fetchMessages = async (ticketId: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/tickets/${ticketId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket || !connection || isSending) return;

    setIsSending(true);
    try {
      await connection.invoke('SendMessage', activeTicket.id, 'Admin', newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeTicket) return;

    try {
      await axios.post(`${API_URL}/api/tickets/${activeTicket.id}/close`);
      setTickets((prev) => prev.filter(t => t.id !== activeTicket.id));
      setActiveTicket(null);
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden text-gray-800">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            ET
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            ETS Dispatch Console
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Logged in as: <span className="text-blue-600">ชูเกียรติ (Admin L1)</span>
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Queue List */}
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-lg">
            Active Tickets ({tickets.length})
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => setActiveTicket(ticket)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Ticket #{ticket.id}</span>
                  <span className="text-xs text-gray-500">{new Date(ticket.openedAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm text-gray-600 truncate">{ticket.category} - {ticket.shiftName}</div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="p-8 text-center text-gray-500">No active tickets</div>
            )}
          </div>
        </div>

        {/* Center Column: Chat */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeTicket ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm z-10">
                <div className="font-semibold text-lg">Ticket #{activeTicket.id} - {activeTicket.category}</div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isAdmin = msg.senderType === 'Admin';
                  return (
                    <div key={idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${isAdmin ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'}`}>
                        <div className="text-sm">{msg.messageText}</div>
                        <div className={`text-[10px] mt-1 text-right ${isAdmin ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a ticket from the queue to start chatting
            </div>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="w-1/4 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-lg">
            Ticket Details
          </div>
          {activeTicket ? (
            <div className="p-6 flex flex-col h-full">
              <div className="space-y-4 flex-1">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {activeTicket.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Category</div>
                  <div className="font-medium">{activeTicket.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location ID</div>
                  <div className="font-medium">{activeTicket.locationId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Shift Name</div>
                  <div className="font-medium">{activeTicket.shiftName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Opened At</div>
                  <div className="font-medium">{new Date(activeTicket.openedAt).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-100">
                <button 
                  onClick={handleCloseTicket}
                  className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Close Ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;