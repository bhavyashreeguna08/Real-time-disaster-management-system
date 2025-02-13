using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using DisasterManagement.IncidentService.Data;
using DisasterManagement.IncidentService.Models;
using DisasterManagement.IncidentService.Dtos;
using System.Security.Claims;
using System.IO;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace DisasterManagement.IncidentService.Controllers
{
    [Route("api/incidents")]
    [ApiController]
    [Authorize] // 🔒 Requires JWT Token
    public class IncidentController : ControllerBase
    {
        private readonly IncidentDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public IncidentController(IncidentDbContext context, IWebHostEnvironment environment, HttpClient httpClient, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _environment = environment;
            _httpClient = httpClient;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        // ✅ REPORT NEW INCIDENT (With Image Upload)
        //[HttpPost("report")]
        //public async Task<IActionResult> ReportIncident([FromForm] IncidentDto incidentDto)
        //{
        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        //    // ✅ Fetch User Service Base URL from Config
        //    string userServiceUrl = _configuration["Services:UserServiceUrl"];

        //    var userResponse = await _httpClient.GetAsync($"{userServiceUrl}/api/auth/{userId}");

        //    if (!userResponse.IsSuccessStatusCode)
        //    {
        //        return BadRequest(new { message = "User details not found" });
        //    }

        //    var user = await userResponse.Content.ReadFromJsonAsync<UserDto>();

        //    string imagePath = null;
        //    if (incidentDto.Image != null)
        //    {
        //        var uploadsFolder = Path.Combine(_environment.WebRootPath, "incident-images");
        //        if (!Directory.Exists(uploadsFolder))
        //            Directory.CreateDirectory(uploadsFolder);

        //        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(incidentDto.Image.FileName)}";
        //        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        //        using (var fileStream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await incidentDto.Image.CopyToAsync(fileStream);
        //        }

        //        imagePath = Path.Combine("incident-images", uniqueFileName);
        //    }

        //    var newIncident = new Incident
        //    {
        //        Title = incidentDto.Title,
        //        Description = incidentDto.Description,
        //        Region = incidentDto.Region,
        //        ImageUrl = imagePath,
        //        UserId = userId
        //    };

        //    _context.Incidents.Add(newIncident);
        //    await _context.SaveChangesAsync();

        //    // Notify subscribers
        //    await _httpClient.PostAsJsonAsync("https://localhost:7282/api/notifications/send-alerts", new
        //    {
        //        Title = incidentDto.Title,
        //        Description = incidentDto.Description,
        //        Region = incidentDto.Region
        //    });


        //    return Ok(new
        //    {
        //        message = "Incident reported successfully",
        //        incident = newIncident,
        //        reporter = new { user.Username, user.Email, user.Phone }
        //    });
        //}

        [HttpPost("report")]
        public async Task<IActionResult> ReportIncident([FromForm] IncidentDto incidentDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Fetch User Details
            //var userResponse = await _httpClient.GetAsync($"http://localhost:5001/api/auth/{userId}");
            //if (!userResponse.IsSuccessStatusCode) return BadRequest(new { message = "User details not found" });

            // Fetch User Details
            var httpClient1 = _httpClientFactory.CreateClient("UserService");
            var userResponse = await httpClient1.GetAsync($"http://localhost:5001/api/auth/{userId}");

            var user = await userResponse.Content.ReadFromJsonAsync<UserDto>();

            // ✅ Save the incident
            string imagePath = null;
            if (incidentDto.Image != null)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "incident-images");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(incidentDto.Image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await incidentDto.Image.CopyToAsync(fileStream);
                }
                imagePath = Path.Combine("incident-images", uniqueFileName);
            }

            var newIncident = new Incident
            {
                Title = incidentDto.Title,
                Description = incidentDto.Description,
                Region = incidentDto.Region,
                ImageUrl = imagePath,
                UserId = userId
            };

            _context.Incidents.Add(newIncident);
            await _context.SaveChangesAsync();

            // ✅ Notify Subscribers in the Region
            using (var httpClient = new HttpClient())
            {
                var notificationServiceUrl = "https://localhost:7282/api/notifications/send";
                var notificationData = new
                {
                    IncidentId = newIncident.Id,
                    Title = newIncident.Title,
                    Description = newIncident.Description,
                    Region = newIncident.Region
                };

                var response = await httpClient.PostAsJsonAsync(notificationServiceUrl, notificationData);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode(500, "Incident Reported. Notification Service failed to send alerts.");
                }
            }

            return Ok(new
            {
                message = "Incident reported successfully, notifications sent.",
                incident = newIncident
            });
        }


        // ✅ GET ALL INCIDENTS
        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllIncidents()
        {
            var incidents = await _context.Incidents.AsNoTracking().ToListAsync();
            return Ok(incidents);
        }

        // ✅ GET INCIDENTS BY REGION
        [HttpGet("region/{region}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetIncidentsByRegion(string region)
        {
            var incidents = await _context.Incidents
                                          .Where(i => i.Region == region)
                                          .AsNoTracking()
                                          .ToListAsync();

            return Ok(incidents);
        }

        [HttpGet("new")]
        public async Task<IActionResult> GetNewIncidents([FromQuery] DateTime since)
        {
            var incidents = await _context.Incidents
                .Where(i => i.ReportedAt > since)
                .ToListAsync();

            return Ok(incidents);
        }

        // ✅ API: Get Total Incidents Count
        [HttpGet("stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetIncidentStats()
        {
            var totalIncidents = await _context.Incidents.CountAsync();
            var mostAffectedRegions = await _context.Incidents
                .GroupBy(i => i.Region)
                .OrderByDescending(g => g.Count())
                .Select(g => new { Region = g.Key, Count = g.Count() })
                .Take(5)
                .ToListAsync();

            return Ok(new
            {
                totalIncidents,
                mostAffectedRegions
            });
        }

        // ✅ API: Get Incident Trends Over Time
        [HttpGet("trends")]
        [AllowAnonymous]
        public async Task<IActionResult> GetIncidentTrends()
        {
            var trends = await _context.Incidents
                .GroupBy(i => i.ReportedAt)
                .OrderBy(g => g.Key)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(trends);
        }

        // ✅ API: Get Incidents Grouped by Type
        [HttpGet("by-type")]
        [AllowAnonymous]
        public async Task<IActionResult> GetIncidentsByType()
        {
            var incidentsByType = await _context.Incidents
                .GroupBy(i => i.Title)
                .OrderByDescending(g => g.Count())
                .Select(g => new { DisasterType = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(incidentsByType);
        }

    }
}
