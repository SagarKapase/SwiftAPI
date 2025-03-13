namespace SwiftAPI.Models
{
    public class ApiRequestEntity
    {
        public string EndpointUrl { get; set; }
        public string Payload { get; set; }
        public string HttpMethod { get; set; }
    }
}