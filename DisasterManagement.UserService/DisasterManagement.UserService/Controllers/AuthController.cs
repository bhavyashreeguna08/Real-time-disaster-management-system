using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using DisasterManagement.UserService.Data;
using DisasterManagement.UserService.Models;
using DisasterManagement.UserService.Dtos;
using DisasterManagement.UserService.Helpers;
using System.Security.Claims;
using BCrypt.Net;
using DisasterManagement.UserService.Dto;

namespace DisasterManagement.UserService.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthController(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        // ✅ REGISTER USER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
                return BadRequest("Username already exists.");

            var user = new User
            {
                Name = registerDto.Name,
                Username = registerDto.Username,
                Email = registerDto.Email,
                PhoneNumber = registerDto.PhoneNumber,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password) // Hash password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Fetch the user by username
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            // Check if user exists and password is valid
            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, existingUser.Password))
                return Unauthorized(new { message = "Invalid credentials" });

            // Generate the JWT token
            var token = _jwtHelper.GenerateToken(existingUser.Username, existingUser.Id, existingUser.Role);

            // Return the token, user ID, and role in the response
            return Ok(new
            {
                token,
                userId = existingUser.Id,
                role = existingUser.Role // Include role in the response
            });
        }


        // ✅ Fetch user details by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Phone = u.PhoneNumber
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                                       .Include(u => u.Subscriptions) // If you want to include subscriptions data
                                       .Select(u => new
                                       {
                                           u.Id,
                                           u.Name,
                                           u.Email,
                                           u.PhoneNumber,
                                           Subscriptions = u.Subscriptions.Select(s => s.Region) // Include region list for each user
                                       })
                                       .ToListAsync();

            if (!users.Any())
                return NotFound("No users found.");

            return Ok(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admin/promote/{id}")]
        public async Task<IActionResult> PromoteToAdmin(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound("User not found.");

            user.Role = "Admin"; // Change role to Admin
            await _context.SaveChangesAsync();

            return Ok("User promoted to Admin.");
        }

        [Authorize(Roles = "Admin")] // Only admins can access this
        [HttpPut("reset-role/{id}")]
        public async Task<IActionResult> ResetUserRole(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            // Reset role to "User"
            user.Role = "User";
            await _context.SaveChangesAsync();

            return Ok(new { message = "User role has been reset to User." });
        }

    }
}
