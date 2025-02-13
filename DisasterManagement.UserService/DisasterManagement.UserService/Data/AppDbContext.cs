using Microsoft.EntityFrameworkCore;
using DisasterManagement.UserService.Models;

namespace DisasterManagement.UserService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserSubscription> UserSubscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserSubscription>()
                .HasOne(us => us.User)
                .WithMany(u => u.Subscriptions) // Ensure `User` model has `List<UserSubscription> Subscriptions`
                .HasForeignKey(us => us.UserId);
        }
    }
}
