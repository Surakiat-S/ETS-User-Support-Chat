using System;

namespace SharedModels
{
    public class ChatMessageModel
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public string SenderType { get; set; } = string.Empty; // "User" or "Admin"
        public string MessageText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}