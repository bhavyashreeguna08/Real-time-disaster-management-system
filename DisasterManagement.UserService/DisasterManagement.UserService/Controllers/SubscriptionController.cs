using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DisasterManagement.UserService.Data;
using DisasterManagement.UserService.Models;
using DisasterManagement.UserService.Dtos;

namespace DisasterManagement.UserService.Controllers
{
    [Route("api/subscription")]
    [ApiController]
    //[Authorize] // 🔒 Requires JWT Token
    public class SubscriptionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;

        public SubscriptionController(AppDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
        }

        //[Authorize] // 🔒 Requires JWT Token
        //// ✅ SUBSCRIBE TO REGION
        //[HttpPost("subscribe")]
        //public async Task<IActionResult> Subscribe([FromBody] SubscriptionDto subscriptionDto)
        //{
        //    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        //    var user = await _context.Users.Include(u => u.Subscriptions)
        //                                   .FirstOrDefaultAsync(u => u.Id == userId);
        //    if (user == null)
        //        return NotFound("User not found.");

        //    // Check if already subscribed
        //    if (user.Subscriptions.Any(s => s.Region == subscriptionDto.Region))
        //        return BadRequest("Already subscribed to this region.");

        //    var newSubscription = new UserSubscription { UserId = userId, Region = subscriptionDto.Region };
        //    _context.UserSubscriptions.Add(newSubscription);
        //    await _context.SaveChangesAsync();

        //    return Ok("Subscribed to region successfully.");
        //}

        [Authorize]
        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubscriptionDto request)
        {
            //// Find the user by ID
            //var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value); // Get UserId from the token
            //var user = await _context.Users.FindAsync(userId);


            //if (user == null)
            //{
            //    return NotFound("User not found.");
            //}

            //Console.WriteLine($"UserId from request: {userId}");

            // Extract UserId from the JWT token claims
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value); // Get UserId from the token

            // Find the user by the UserId from the token (no need to query based on UserId again)
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            Console.WriteLine($"UserId from token: {userId}");

            // Check if the user is already subscribed to the region
            if (user.Subscriptions.Any(s => s.Region == request.Region))
            {
                return BadRequest("User is already subscribed to this region.");
            }

            // Create a new subscription
            var newSubscription = new UserSubscription
            {
                UserId = user.Id,
                Region = request.Region
            };

            // Add the new subscription to the database
            _context.UserSubscriptions.Add(newSubscription);
            await _context.SaveChangesAsync();

            // 🔥 Send Subscription Data to Notification Service
            using (var httpClient = new HttpClient())
            {
                var notificationServiceUrl = "https://localhost:7282/api/notifications/add";
                var subscriberData = new
                {
                    UserId = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Region = request.Region
                };

                var response = await httpClient.PostAsJsonAsync(notificationServiceUrl, subscriberData);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode(500, "Failed to add subscriber to Notification Service.");
                }
            }

            return Ok("Subscription added successfully.");
        }


        [Authorize] // 🔒 Requires JWT Token
        // ✅ UNSUBSCRIBE FROM REGION
        [HttpPost("unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromBody] SubscriptionDto subscriptionDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var user = await _context.Users.Include(u => u.Subscriptions)
                                           .FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found.");

            var subscription = user.Subscriptions.FirstOrDefault(s => s.Region == subscriptionDto.Region);
            if (subscription == null)
                return BadRequest("Not subscribed to this region.");

            _context.UserSubscriptions.Remove(subscription);
            await _context.SaveChangesAsync();

            return Ok("Unsubscribed from region successfully.");
        }

        [Authorize]
        // ✅ VIEW SUBSCRIPTIONS
        [HttpGet("list")]
        public async Task<IActionResult> GetSubscriptions()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var subscriptions = await _context.UserSubscriptions.Where(s => s.UserId == userId)
                                                                .Select(s => s.Region)
                                                                .ToListAsync();
            return Ok(subscriptions);
        }

        //// ✅ GET /api/subscription/subscribers/{region} (Fetch users subscribed to a region)
        //[HttpGet("subscribers/{region}")]
        //public async Task<IActionResult> GetSubscribersByRegion(string region)
        //{
        //    var subscribers = await _context.UserSubscriptions
        //        //.Where(s => s.Region == region)
        //        .Where(u => u.Region.Contains(region)) // 🔥 Ensure users have subscribed to that region
        //        .Include(s => s.User) // Include user details
        //        .Select(s => new
        //        {
        //            s.User.Email,
        //            s.User.PhoneNumber // Assuming your User model has this
        //        })
        //        .ToListAsync();

        //    if (!subscribers.Any())
        //        return NotFound("No subscribers for this region.");

        //    return Ok(subscribers);
        //}

        // ✅ GET /api/subscription/subscribers/{region} (No JWT Token Required)
        // Fetch users subscribed to a region
        [HttpGet("subscribers/{region}")]
        public async Task<IActionResult> GetSubscribersByRegion(string region)
        {
            var subscribers = await _context.UserSubscriptions
                                             .Where(s => s.Region.ToLower().Contains(region)) 
                                             .Include(s => s.User) // Include user details
                                             .Select(s => new
                                             {
                                                 s.User.Email,
                                                 s.User.PhoneNumber, // Assuming your User model has PhoneNumber
                                                 s.User.Name, // Optionally, include user name
                                                 s.Region // Return the region of subscription
                                             })
                                             .ToListAsync();

            if (!subscribers.Any())
                return NotFound("No subscribers for this region.");

            return Ok(subscribers);
        }

        //[HttpGet("subscribers/{region}")]
        //public async Task<IActionResult> GetSubscribersByRegion(string region)
        //{
        //    var subscribers = await _context.Users
        //        .Where(u => u.SubscribedRegions.Contains(region)) // 🔥 Ensure users have subscribed to that region
        //        .ToListAsync();

        //    return Ok(subscribers);
        //}

    }
}