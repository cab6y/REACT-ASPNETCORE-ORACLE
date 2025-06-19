using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using React_AspNetCore.Server.Models.Identity;
using React_AspNetCore.Server.Models;
using React_AspNetCore.Server.EFCore;
using React_AspNetCore.Server.Models.TodoHeaders;

namespace React_AspNetCore.Server.Controllers.Todos.TodoHeaders
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoHeaderController : ControllerBase
    {
        private readonly ApplicationDbContext _dbcontext;
        public TodoHeaderController(ApplicationDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        [HttpGet("List")]
        [Authorize]
        public async Task<IActionResult> GetList([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;

            var query = _dbcontext.TodoHeaders.OrderByDescending(u => u.CreatedAt); // sıralama opsiyonel

            var totalCount = await query.CountAsync();
            var todoheaders = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new PagedResult<TodoHeader>
            {
                TotalCount = totalCount,
                Items = todoheaders
            };

            return Ok(result);
        }
        [HttpPost("Create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTodoHeader input)
        {
           
            if (input == null || string.IsNullOrWhiteSpace(input.Header))
                return BadRequest("Geçerli bir başlık girilmelidir.");

            var model = new TodoHeader
            {
                Id = Guid.NewGuid(),
                Header = input.Header,
                CreatedAt = DateTime.UtcNow,
            };

            await _dbcontext.TodoHeaders.AddAsync(model);
            await _dbcontext.SaveChangesAsync();

            return Ok(model);
        }
        [HttpPut("Update/{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, string header)
        {
            if (header == null || string.IsNullOrWhiteSpace(header))
                return BadRequest("Geçerli bir başlık girilmelidir.");

            var existing = await _dbcontext.TodoHeaders.FindAsync(id);
            if (existing == null)
                return NotFound("TodoHeader bulunamadı.");

            existing.Header = header;
            existing.ModifiedAt = DateTime.UtcNow;

            _dbcontext.TodoHeaders.Update(existing);
            await _dbcontext.SaveChangesAsync();

            return Ok(existing);
        }

        [HttpDelete("Delete/{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var todo = await _dbcontext.TodoHeaders.FindAsync(id);
            _dbcontext.TodoHeaders.Remove(todo);
            Console.WriteLine($"State: {_dbcontext.Entry(todo).State}");

            await _dbcontext.SaveChangesAsync();

            return Ok("Başarıyla silindi.");
        }

    }
}
