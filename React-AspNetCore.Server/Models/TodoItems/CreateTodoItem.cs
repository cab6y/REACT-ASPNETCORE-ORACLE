namespace React_AspNetCore.Server.Models.TodoItems
{
    public class CreateTodoItem
    {
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public Guid TodoHeaderId { get; set; }
    }
}
