using System.ComponentModel.DataAnnotations;

namespace Mission11_Pierce.Models
{
    public class AdminUser
    {
        [Key]
        public int AdminUserId { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}

