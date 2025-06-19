using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using React_AspNetCore.Server.EFCore;
using React_AspNetCore.Server.Models.TodoItems;
using System;

namespace React_AspNetCore.Server.Controllers.Todos.TodoItems
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TodoItemController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TodoItem
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TodoItemDto>>> GetTodoItems(Guid headerid)
        {
            var list = await _context.TodoItems
                                 .Where(t => t.TodoHeaderId == headerid && !t.IsDeleted)
                                 .ToListAsync();
            if (list == null || !list.Any())
                return NotFound();
            var result = list.Select(t => new TodoItemDto
            {
                Id = t.Id,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                TodoHeaderId = t.TodoHeaderId,
            }).ToList();

            return result;
        }

        // GET: api/TodoItem/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<TodoItem>> GetTodoItem(Guid id)
        {
            var item = await _context.TodoItems
                                     .FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);

            if (item == null)
                return NotFound();

            return item;
        }

        // POST: api/TodoItem
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TodoItem>> CreateTodoItem(CreateTodoItem item)
        {
            var todoitem = new TodoItem
            {
                Id = Guid.NewGuid(),
                Description = item.Description,
                IsCompleted = item.IsCompleted,
                TodoHeaderId = item.TodoHeaderId,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };
            _context.TodoItems.Add(todoitem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTodoItem), new { id = todoitem.Id }, item);
        }

        // PUT: api/TodoItem/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTodoItem(Guid id, TodoItem item)
        {
            if (id != item.Id)
                return BadRequest();

            var existingItem = await _context.TodoItems.FindAsync(id);
            if (existingItem == null || existingItem.IsDeleted)
                return NotFound();

            existingItem.Description = item.Description;
            existingItem.IsCompleted = item.IsCompleted;
            existingItem.TodoHeaderId = item.TodoHeaderId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/TodoItem/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            _context.TodoItems.Remove(todo);
            Console.WriteLine($"State: {_context.Entry(todo).State}");

            await _context.SaveChangesAsync();

            return Ok("Başarıyla silindi.");
        }

    }
}
