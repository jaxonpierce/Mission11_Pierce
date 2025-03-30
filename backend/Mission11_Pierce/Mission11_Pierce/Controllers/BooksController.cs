using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Pierce.Data;
using Mission11_Pierce.Models;

namespace Mission11_Pierce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BooksController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? category = null)  // <-- Add category filter
        {
            var booksQuery = _context.Books.AsQueryable();

            // Apply category filter if selected
            if (!string.IsNullOrEmpty(category) && category != "All Categories")
            {
                booksQuery = booksQuery.Where(b => b.Category == category);
            }

            // Sorting logic
            if (!string.IsNullOrEmpty(sortBy))
            {
                booksQuery = sortBy.ToLower() switch
                {
                    "title" => booksQuery.OrderBy(b => b.Title),
                    "author" => booksQuery.OrderBy(b => b.Author),
                    _ => booksQuery
                };
            }

            var totalRecords = await booksQuery.CountAsync();
            var books = await booksQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new { TotalRecords = totalRecords, Books = books });
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .ToListAsync();

            return Ok(categories);
        }


    }
}
