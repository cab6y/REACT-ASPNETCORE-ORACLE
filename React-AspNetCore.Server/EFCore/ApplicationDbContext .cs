using Microsoft.EntityFrameworkCore;
using React_AspNetCore.Server.Models.Identity;

namespace React_AspNetCore.Server.EFCore
{
    public class ApplicationDbContext : DbContext
    {
        private readonly SoftDeleteInterceptor _softDeleteInterceptor;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, SoftDeleteInterceptor softDeleteInterceptor)
            : base(options)
        {
            _softDeleteInterceptor = softDeleteInterceptor;
        }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");

        }
        // Buraya tablolar eklenecek, örnek:
        // public DbSet<Product> Products { get; set; }
    }
}
