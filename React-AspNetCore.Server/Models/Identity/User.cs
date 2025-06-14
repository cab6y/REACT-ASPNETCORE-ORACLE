using React_AspNetCore.Server.EFCore;

namespace React_AspNetCore.Server.Models.Identity
{
    public class User : BaseModel, ISoftDeletable
    {
        public User()
        {
            Id = Guid.NewGuid();
        }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
    }
}
