using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DisasterManagement.UserService.Models
{
    public class UserSubscription
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string Region { get; set; } // User's subscribed region


        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
