using BackendAPI.Data;
using BackendAPI.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SharedModels;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<SupportChatHub> _hubContext;

        public TicketsController(ApplicationDbContext context, IHubContext<SupportChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] TicketModel ticket)
        {
            ticket.OpenedAt = DateTime.UtcNow;
            ticket.Status = "Open";
            
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("NewTicket", ticket);

            return CreatedAtAction(nameof(GetTicketMessages), new { id = ticket.Id }, ticket);
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveTickets()
        {
            var tickets = await _context.Tickets
                .Where(t => t.Status == "Open")
                .OrderByDescending(t => t.OpenedAt)
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpPost("{id}/close")]
        public async Task<IActionResult> CloseTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return NotFound();

            ticket.Status = "Closed";
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/messages")]
        public async Task<IActionResult> GetTicketMessages(int id)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.TicketId == id)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }
    }
}