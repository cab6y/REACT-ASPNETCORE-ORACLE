using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace React_AspNetCore.Server.EFCore
{
    public class SoftDeleteInterceptor : ISaveChangesInterceptor
    {
        public void ConvertDeletesToSoftDeletes(DbContext context)
        {
            var entries = context.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Deleted && e.Entity is ISoftDeletable);

            foreach (var entry in entries)
            {
                entry.State = EntityState.Modified;
                ((ISoftDeletable)entry.Entity).IsDeleted = true;
            }
        }

        public InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            ConvertDeletesToSoftDeletes(eventData.Context);
            return result;
        }

        public ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            ConvertDeletesToSoftDeletes(eventData.Context);
            return new ValueTask<InterceptionResult<int>>(result);
        }

        // Diğer metotlar boş geçilebilir
        public void SavedChanges(SaveChangesCompletedEventData eventData, int result) { }
        public Task SavedChangesAsync(SaveChangesCompletedEventData eventData, int result, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void SaveChangesFailed(DbContextErrorEventData eventData) { }
        public Task SaveChangesFailedAsync(DbContextErrorEventData eventData, CancellationToken cancellationToken = default) => Task.CompletedTask;
    }

    // Ortak arayüz (opsiyonel ama iyi bir pratik)
    public interface ISoftDeletable
    {
        public bool IsDeleted { get; set; }
    }
}
