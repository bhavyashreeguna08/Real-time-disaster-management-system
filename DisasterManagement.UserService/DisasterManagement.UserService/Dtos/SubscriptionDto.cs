using System.ComponentModel.DataAnnotations;

namespace DisasterManagement.UserService.Dtos
{
    public class SubscriptionDto
    {
        public int UserId { get; set; }
        public string Region { get; set; }
    }
}
