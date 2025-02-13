namespace NotificationService.Models
{
    public class Subscriber
    {
        public int Id { get; set; }
        public int UserId { get; set; }  // Link to User Service
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Region { get; set; }  // Subscribed Disaster Region
    }
}
