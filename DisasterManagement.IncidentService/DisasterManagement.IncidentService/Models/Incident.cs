using System;
using System.ComponentModel.DataAnnotations;

namespace DisasterManagement.IncidentService.Models
{
    public class Incident
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Region { get; set; }

        public string ImageUrl { get; set; } // Stores image file path (optional)

        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; } // Reporter ID
    }
}
