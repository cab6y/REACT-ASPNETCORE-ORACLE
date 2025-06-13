namespace React_AspNetCore.Server.Models
{
    public class BaseModel
    {
        public Guid Id { get; set; }
        public Guid? CreatorId { get; set; }
        public Guid? ModifierId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}
