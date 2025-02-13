//using System;
//using System.Net.Http;
//using System.Text.Json;
//using System.Threading;
//using System.Threading.Tasks;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Hosting;
//using Microsoft.Extensions.Logging;
//using NotificationService.Dtos;

//namespace NotificationService.Services
//{
//    public class IncidentCheckerService : BackgroundService
//    {
//        private readonly ILogger<IncidentCheckerService> _logger;
//        private readonly IServiceScopeFactory _scopeFactory;
//        private readonly HttpClient _httpClient = new HttpClient();
//        private DateTime _lastCheckedTime = DateTime.UtcNow.AddMinutes(-10); // Initial check window

//        public IncidentCheckerService(ILogger<IncidentCheckerService> logger, IServiceScopeFactory scopeFactory)
//        {
//            _logger = logger;
//            _scopeFactory = scopeFactory;
//        }

//        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
//        {
//            while (!stoppingToken.IsCancellationRequested)
//            {
//                try
//                {
//                    _logger.LogInformation("Checking for new incidents...");

//                    // 1️⃣ Fetch New Incidents
//                    var incidentResponse = await _httpClient.GetAsync($"http://localhost:7259/api/incidents/new?since={_lastCheckedTime:o}");
//                    if (!incidentResponse.IsSuccessStatusCode) continue;

//                    var incidents = await incidentResponse.Content.ReadFromJsonAsync<List<IncidentReportedDto>>();
//                    if (incidents == null || incidents.Count == 0) continue;

//                    _logger.LogInformation($"Found {incidents.Count} new incidents!");

//                    // 2️⃣ For Each Incident: Fetch Subscribers & Send Notifications
//                    foreach (var incident in incidents)
//                    {
//                        var subscribersResponse = await _httpClient.GetAsync($"http://localhost:5001/api/subscription/subscribers/{incident.Region}");
//                        if (!subscribersResponse.IsSuccessStatusCode) continue;

//                        var subscribers = await subscribersResponse.Content.ReadFromJsonAsync<List<UserDto>>();
//                        if (subscribers == null || subscribers.Count == 0)
//                        {
//                            _logger.LogWarning($"No subscribers found for {incident.Region}");
//                            continue;
//                        }

//                        // 3️⃣ Send Notifications
//                        foreach (var subscriber in subscribers)
//                        {
//                            _logger.LogInformation($"Sending alert to {subscriber.Email}");
//                            await _httpClient.PostAsJsonAsync("https://localhost:7282/api/notifications/send-alerts", new
//                            {
//                                Email = subscriber.Email,
//                                Phone = subscriber.Phone,
//                                Message = $"{incident.Title} - {incident.Description}"
//                            });
//                        }
//                    }

//                    _lastCheckedTime = DateTime.UtcNow; // ✅ Update last checked time

//                }
//                catch (Exception ex)
//                {
//                    _logger.LogError($"Error checking incidents: {ex.Message}");
//                }

//                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // Check every 10 seconds
//            }
//        }
//    }
//}


using NotificationService.Dtos;

public class IncidentCheckerService : BackgroundService
{
    private readonly ILogger<IncidentCheckerService> _logger;
    private readonly HttpClient _httpClient;
    private DateTime _lastCheckedTime = DateTime.UtcNow.AddMinutes(-10); // Initial check window

    public IncidentCheckerService(ILogger<IncidentCheckerService> logger, HttpClient httpClient)
    {
        _logger = logger;
        _httpClient = httpClient;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _logger.LogInformation("Checking for new incidents...");

                // 1️⃣ Fetch New Incidents
                var incidentResponse = await _httpClient.GetAsync($"https://localhost:7259/api/incidents/new?since={_lastCheckedTime:o}");
                if (!incidentResponse.IsSuccessStatusCode) continue;

                var incidents = await incidentResponse.Content.ReadFromJsonAsync<List<IncidentReportedDto>>();
                if (incidents == null || incidents.Count == 0) continue;

                _logger.LogInformation($"Found {incidents.Count} new incidents!");

                // 2️⃣ For Each Incident: Fetch Subscribers from UserService and Send Notifications
                foreach (var incident in incidents)
                {
                    var subscribersResponse = await _httpClient.GetAsync($"http://localhost:5001/api/subscription/subscribers/{incident.Region}");
                    if (!subscribersResponse.IsSuccessStatusCode) continue;

                    var subscribers = await subscribersResponse.Content.ReadFromJsonAsync<List<UserDto>>();
                    if (subscribers == null || subscribers.Count == 0)
                    {
                        _logger.LogWarning($"No subscribers found for {incident.Region}");
                        continue;
                    }

                    // 3️⃣ Send Notifications
                    foreach (var subscriber in subscribers)
                    {
                        _logger.LogInformation($"Sending alert to {subscriber.Email}");
                        await _httpClient.PostAsJsonAsync("https://localhost:7282/api/notifications/send", new
                        {
                            Email = subscriber.Email,
                            Phone = subscriber.Phone,
                            Message = $"{incident.Title} - {incident.Description}"
                        });
                    }
                }

                _lastCheckedTime = DateTime.UtcNow; // ✅ Update last checked time

            }
            catch (Exception ex)
            {
                _logger.LogError($"Error checking incidents: {ex.Message}");
            }

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // Check every 10 seconds
        }
    }
}
