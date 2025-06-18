using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using React_AspNetCore.Server.EFCore;
using React_AspNetCore.Server.Models;
using React_AspNetCore.Server.Models.Identity;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

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
        public async Task<IActionResult> SignUp([FromBody] CreateUser userModel)
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
        [HttpGet("Login")]
        public async Task<IActionResult> Login(string emailorusername, string password)
        {
            if (string.IsNullOrEmpty(emailorusername) || string.IsNullOrEmpty(password))
            {
                return Unauthorized("Kullanıcı bulunamadı veya şifre hatalı.");
            }
            var user = _dbcontext.Users.FirstOrDefault(u => (u.Username == emailorusername || u.Email == emailorusername) && u.Password == password);
            if (user == null) return Unauthorized("Kullanıcı bulunamadı veya şifre hatalı.");
            // JWT üretelim
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("e6259d24-afbe-4718-8933-d386457eacf6");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(12), // ⏰ 4 saat geçerli token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            // SESSION'A kullanıcıyı kaydet
            HttpContext.Session.SetString("User", JsonSerializer.Serialize<User>(user));

            return Ok(new { token = jwt });
        }
        [HttpGet]
        [Authorize]
        [Route("SessionCount")]
        public bool SessionCount()
        {
            return true;
        }
        [HttpPost]
        [Authorize]
        [Route("Logout")]
        public IActionResult Logout()
        {
            try
            {
                // Session'daki kullanıcıyı temizle
                HttpContext.Session.Remove("User");

                // Session tamamen sonlandırılmak istenirse:
                // HttpContext.Session.Clear();

                return Ok(new { message = "Çıkış başarılı." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Çıkış hatası: {ex.Message}");
            }
        }
        [HttpGet("List")]
        [Authorize]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;

            var query = _dbcontext.Users.OrderByDescending(u => u.CreatedAt); // sıralama opsiyonel

            var totalCount = await query.CountAsync();
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new PagedResult<User>
            {
                TotalCount = totalCount,
                Items = users
            };

            return Ok(result);
        }
        [HttpDelete("Delete")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid Id)
        {
           await _dbcontext.Users.Where(u => u.Id == Id).ExecuteDeleteAsync();

            return Ok();
        }
    }
}
