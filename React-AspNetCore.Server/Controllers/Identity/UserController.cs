using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using React_AspNetCore.Server.EFCore;
using React_AspNetCore.Server.Models.Identity;

namespace React_AspNetCore.Server.Controllers.Identity
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _dbcontext;
        public UserController(ApplicationDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpPost]
        [Route("SignUp")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUser userModel)
        {
            if (userModel == null || string.IsNullOrEmpty(userModel.Username) || string.IsNullOrEmpty(userModel.Password))
            {
                return BadRequest("Invalid user data.");
            }
            var user = new User{ Id = Guid.NewGuid(), Email = userModel.Email, Name = userModel.Name, Surname = userModel.Surname, Username = userModel.Username, Password = userModel.Password, Telephone = userModel.Telephone, CreatedAt = DateTime.Now };
            _dbcontext.Users.Add(user);
            await _dbcontext.SaveChangesAsync();
            // Here you would typically add logic to create a user in your database
            // For example, using _dbcontext to add the user to the database
            return Ok("User created successfully.");
        }
    }
}
