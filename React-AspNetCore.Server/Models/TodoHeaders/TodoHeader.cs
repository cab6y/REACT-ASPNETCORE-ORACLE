using React_AspNetCore.Server.Models.TodoItems;

namespace React_AspNetCore.Server.Models.TodoHeaders
{
    public class TodoHeader : BaseModel
    {
        public string Header { get; set; }
        public ICollection<TodoItem> TodoItems { get; set; }

    }
}
