using React_AspNetCore.Server.Models.TodoHeaders;

namespace React_AspNetCore.Server.Models.TodoItems
{
    public class TodoItem : BaseModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public Guid TodoHeaderId { get; set; }
        public TodoHeader TodoHeader { get; set; } // Navigation property to TodoHeader
    }
}
