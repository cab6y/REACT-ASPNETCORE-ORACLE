using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace React_AspNetCore.Server.EFCore
{
    public class SoftDeleteInterceptor : SaveChangesInterceptor
    {
        public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            ConvertDeletesToSoftDeletes(eventData.Context);
            return base.SavingChanges(eventData, result);
        }

        private void ConvertDeletesToSoftDeletes(DbContext context)
        {
            var entries = context.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Deleted && e.Entity is ISoftDeletable);

            foreach (var entry in entries)
            {
                entry.State = EntityState.Modified;
                ((ISoftDeletable)entry.Entity).IsDeleted = true;
            }
        }
    }

    // Ortak arayüz (opsiyonel ama iyi bir pratik)
    public interface ISoftDeletable
    {
        public bool IsDeleted { get; set; }
    }
}
