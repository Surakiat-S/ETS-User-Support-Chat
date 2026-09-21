using Microsoft.EntityFrameworkCore;
using SharedModels;

namespace BackendAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<LocationModel> Locations { get; set; } = null!;
        public DbSet<TicketModel> Tickets { get; set; } = null!;
        public DbSet<ChatMessageModel> ChatMessages { get; set; } = null!;
    }
}