using System;

namespace SharedModels
{
    public class TicketModel
    {
        public int Id { get; set; }
        public int LocationId { get; set; }
        public string ShiftName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = "Open";
        public DateTime OpenedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
    }
}