using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Options;
using React_AspNetCore.Server.Models.Identity;
using React_AspNetCore.Server.Models.TodoHeaders;
using React_AspNetCore.Server.Models.TodoItems;
using System.Linq.Expressions;

namespace React_AspNetCore.Server.EFCore
{
    public class ApplicationDbContext : DbContext
    {

        private readonly ISaveChangesInterceptor _softDeleteInterceptor;

       public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ISaveChangesInterceptor softDeleteInterceptor)
    : base(options)
{
    _softDeleteInterceptor = softDeleteInterceptor;
}

        public DbSet<User> Users { get; set; }
        public DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<TodoHeader> TodoHeaders { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<TodoHeader>().ToTable("TodoHeaders");
            modelBuilder.Entity<TodoItem>().ToTable("TodoItems")
                .HasOne(t => t.TodoHeader)
                .WithMany(h => h.TodoItems)
                .HasForeignKey(t => t.TodoHeaderId)
            .OnDelete(DeleteBehavior.Restrict);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var propertyMethodInfo = typeof(EF).GetMethod("Property")?.MakeGenericMethod(typeof(bool));
                    var isDeletedProperty = Expression.Call(propertyMethodInfo, parameter, Expression.Constant("IsDeleted"));
                    var compareExpression = Expression.Equal(isDeletedProperty, Expression.Constant(false));
                    var lambda = Expression.Lambda(compareExpression, parameter);
                    entityType.SetQueryFilter(lambda);
                }
            }
        }
       
    }
}
