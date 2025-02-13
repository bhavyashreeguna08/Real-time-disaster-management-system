using Confluent.Kafka;
using System;
using System.Threading.Tasks;

namespace NotificationService.Services
{
    public class KafkaProducerService
    {
        private readonly string _bootstrapServers = "localhost:9092"; // Kafka Broker
        private readonly string _topic = "disaster-alerts";
        private readonly IConfiguration _configuration;

        public KafkaProducerService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendMessageAsync(string message)
        {
            var config = new ProducerConfig { BootstrapServers = _bootstrapServers };

            using (var producer = new ProducerBuilder<Null, string>(config).Build())
            {
                try
                {
                    var result = await producer.ProduceAsync(_topic, new Message<Null, string> { Value = message });
                    Console.WriteLine($"Kafka Message Sent: {result.Value}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Kafka Error: {ex.Message}");
                }
            }
        }
    }

}
