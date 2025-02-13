using Confluent.Kafka;

namespace NotificationService.Services
{
    public class KafkaConsumerService
    {
        private readonly string _bootstrapServers = "localhost:9092";
        private readonly string _topic = "disaster-alerts";
        private readonly string _groupId = "notification-service";

        public void StartConsuming()
        {
            var config = new ConsumerConfig
            {
                BootstrapServers = _bootstrapServers,
                GroupId = _groupId,
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using (var consumer = new ConsumerBuilder<Ignore, string>(config).Build())
            {
                consumer.Subscribe(_topic);

                try
                {
                    while (true)
                    {
                        var consumeResult = consumer.Consume(CancellationToken.None);
                        Console.WriteLine($"Received Kafka Message: {consumeResult.Value}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Kafka Consumer Error: {ex.Message}");
                }
                finally
                {
                    consumer.Close();
                }
            }
        }
    }
}
