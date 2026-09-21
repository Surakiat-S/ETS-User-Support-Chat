using Microsoft.AspNetCore.SignalR;
using BackendAPI.Data;
using SharedModels;
using System;
using System.Threading.Tasks;

namespace BackendAPI.Hubs
{
    public class SupportChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public SupportChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task JoinTicketGroup(string ticketId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, ticketId);
        }

        public async Task SendMessage(int ticketId, string sender, string message)
        {
            var chatMessage = new ChatMessageModel
            {
                TicketId = ticketId,
                SenderType = sender,
                MessageText = message,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            await Clients.Group(ticketId.ToString()).SendAsync("ReceiveMessage", ticketId, sender, message);
        }
    }
}