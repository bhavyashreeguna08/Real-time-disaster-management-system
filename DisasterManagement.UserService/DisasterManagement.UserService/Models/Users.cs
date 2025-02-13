using System.ComponentModel.DataAnnotations;

namespace DisasterManagement.UserService.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; } = "User"; // Default Role is "User"

        [Required]
        public string PhoneNumber { get; set; }
        public List<UserSubscription> Subscriptions { get; set; } = new();

    }
}
