using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotificationService.Data;
using NotificationService.Models;
using NotificationService.Services;
using NotificationService.Dtos;
using System.Net.Mail;
using System.Net;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Newtonsoft.Json;

namespace NotificationService.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationDbContext _context;
        private readonly EmailService _emailService;
        private readonly SmsService _smsService;
        private readonly KafkaProducerService _kafkaProducerService;

        public NotificationController(NotificationDbContext context, EmailService emailService, SmsService smsService, KafkaProducerService kafkaProducerService)
        {
            _context = context;
            _emailService = emailService;
            _smsService = smsService;
            _kafkaProducerService = kafkaProducerService;
        }

        //// ✅ Send Notifications When a Disaster is Reported
        //[HttpPost("send-alerts")]
        //public async Task<IActionResult> SendNotifications([FromBody] IncidentReportedDto incident)
        //{
        //    var subscribers = await _context.Subscribers
        //        .Where(s => s.Region == incident.Region)
        //        .ToListAsync();

        //    if (!subscribers.Any())
        //        return NotFound(new { message = "No subscribers for this region." });

        //    foreach (var subscriber in subscribers)
        //    {
        //        // Send Email Alert
        //        await _emailService.SendEmailAsync(subscriber.Email, incident.Title, incident.Description);

        //        // Send SMS Alert (limited usage)
        //        await _smsService.SendSmsAsync(subscriber.PhoneNumber, $"[ALERT] {incident.Title}: {incident.Description}");
        //    }

        //    return Ok(new { message = "Notifications sent successfully!" });
        //}

        //[HttpPost("send")]
        //public async Task<IActionResult> SendNotification([FromBody] IncidentReportedDto request)
        //{
        //    var subscribers = await _context.Subscribers
        //        .Where(s => s.Region == request.Region)
        //        .ToListAsync();

        //    if (subscribers.Count == 0)
        //    {
        //        return BadRequest("No subscribers found for this region.");
        //    }

        //    // ✅ Send Email & SMS notifications
        //    foreach (var subscriber in subscribers)
        //    {
        //        await SendEmail(subscriber.Email, request.Title, request.Description);
        //        await SendSms(subscriber.PhoneNumber, request.Title, request.Description);
        //    }

        //    return Ok("Notifications sent successfully.");
        //}

        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] IncidentReportedDto request)
        {
            var subscribers = await _context.Subscribers
                .Where(s => s.Region == request.Region)
                .ToListAsync();

            if (subscribers.Count == 0)
            {
                return BadRequest("No subscribers found for this region.");
            }

            // ✅ Send Email & SMS notifications
            foreach (var subscriber in subscribers)
            {
                await SendEmail(subscriber.Email, request.Title, request.Description);
                await SendSms(subscriber.PhoneNumber, request.Title, request.Description);
            }

            // Prepare the Kafka message (serialize it to a JSON string)
            var kafkaMessage = new
            {
                Region = request.Region,
                Title = request.Title,
                Description = request.Description,
                Timestamp = DateTime.UtcNow // Optional field for when the message was sent
            };

            // Serialize the message to JSON string
            var serializedMessage = JsonConvert.SerializeObject(kafkaMessage);

            // Send message to Kafka
            await _kafkaProducerService.SendMessageAsync(serializedMessage);

            return Ok("Notification Sent via Kafka");
        }



        private async Task SendSms(string phoneNumber, string title, string description)
        {
            var accountSid = "xxxxxxxxx";
            var authToken = "xxxxxxxxxxxxxxxxxxxxxxxx";
            var twilioPhoneNumber = "xxxxxxxxxxxxxxxx";

            TwilioClient.Init(accountSid, authToken);

            await MessageResource.CreateAsync(
                body: $"🚨 Alert: {title}\n{description}",
                from: new Twilio.Types.PhoneNumber(twilioPhoneNumber),
                to: new Twilio.Types.PhoneNumber(phoneNumber)
            );
        }


        private async Task SendEmail(string email, string title, string description)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("xxxxxxxxxx", "xxxxxxxxxxxxxxxxxxxx"),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("bhavyashreeguna08@gmail.com"),
                Subject = $"Disaster Alert: {title}",
                Body = $"🚨 Urgent Alert 🚨\n\n{description}\n\nStay Safe!",
                IsBodyHtml = false
            };

            mailMessage.To.Add(email);
            await smtpClient.SendMailAsync(mailMessage);
        }


        [HttpPost("add")]
        public async Task<IActionResult> AddSubscriber([FromBody] Subscriber subscriber)
        {
            var existingSubscriber = await _context.Subscribers
                .FirstOrDefaultAsync(s => s.UserId == subscriber.UserId && s.Region == subscriber.Region);

            if (existingSubscriber == null)
            {
                _context.Subscribers.Add(subscriber);
                await _context.SaveChangesAsync();
                return Ok("Subscriber added successfully.");
            }

            return BadRequest("User already subscribed to this region.");
        }
    }
}
