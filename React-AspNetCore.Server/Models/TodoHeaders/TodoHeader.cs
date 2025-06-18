using React_AspNetCore.Server.EFCore;
using React_AspNetCore.Server.Models.TodoItems;

namespace React_AspNetCore.Server.Models.TodoHeaders
{
    public class TodoHeader : BaseModel , ISoftDeletable
    {
        public string Header { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<TodoItem> TodoItems { get; set; }

    }
}
