using Microsoft.EntityFrameworkCore;
using React_AspNetCore.Server.Models.Identity;
using React_AspNetCore.Server.Models.TodoHeaders;
using React_AspNetCore.Server.Models.TodoItems;

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
        public DbSet<TodoItem> TodoItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<TodoHeader>().ToTable("TodoHeaders");
            modelBuilder.Entity<TodoItem>().ToTable("TodoItems")
                .HasOne(t => t.TodoHeader)
                .WithMany(h => h.TodoItems)
                .HasForeignKey(t => t.TodoHeaderId)
                .OnDelete(DeleteBehavior.Cascade);


        }
        // Buraya tablolar eklenecek, örnek:
        // public DbSet<Product> Products { get; set; }
    }
}
