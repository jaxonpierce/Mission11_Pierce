using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Pierce.Data;
using Mission11_Pierce.Models;

namespace Mission11_Pierce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly BookDbContext _context;

        public AdminController(BookDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] AdminUser login)
        {
            var user = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username == login.Username && u.Password == login.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            return Ok(new { Message = "Login successful" });
        }
    }
}

