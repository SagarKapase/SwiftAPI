using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Unicode;
using Microsoft.AspNetCore.Mvc;
using SwiftAPI.Models;

namespace SwiftAPI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly HttpClient _httpClient;

        public HomeController(ILogger<HomeController> logger, HttpClient httpClient)
        {
            _logger = logger;
            _httpClient = httpClient;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public async Task<IActionResult> CallExternalAPI([FromBody] ApiRequestEntity request)
        {
            if (string.IsNullOrEmpty(request.EndpointUrl))
            {
                return BadRequest("API Endpoint URL is Reqired");
            }
            try
            {
                HttpMethod httpMethod = new HttpMethod(request.HttpMethod.ToUpper());
                var reqeustMessage = new HttpRequestMessage(httpMethod, request.EndpointUrl);
                if (httpMethod == HttpMethod.Post || httpMethod == HttpMethod.Put || httpMethod == HttpMethod.Patch || httpMethod == HttpMethod.Delete)
                {
                    reqeustMessage.Content = new StringContent(request.Payload ?? "{}", Encoding.UTF8, "application/json");
                }
                var response = await _httpClient.SendAsync(reqeustMessage);
                string responseBody = await response.Content.ReadAsStringAsync();
                string respAndHeaders = "###HEADERS###\n";

                foreach (var header in response.Headers)
                {
                    respAndHeaders += header.Key + ": " + string.Join(", ", header.Value) + "\n";
                }

                respAndHeaders += "###BODY###\n" + responseBody;

                return Ok(respAndHeaders);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error Calling API: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> CallExternalAPIGet([FromQuery] string endpointUrl)
        {
            return await CallExternalAPI(new ApiRequestEntity { EndpointUrl = endpointUrl, HttpMethod = "GET" });
        }

        [HttpPost]
        public async Task<IActionResult> CallExternalAPIPost([FromBody] ApiRequestEntity request)
        {
            return await CallExternalAPI(request);
        }

        [HttpPut]
        public async Task<IActionResult> CallExternalAPIPut([FromBody] ApiRequestEntity request)
        {
            return await CallExternalAPI(request);
        }

        [HttpPatch]
        public async Task<IActionResult> CallExternalAPIPatch([FromBody] ApiRequestEntity request)
        {
            return await CallExternalAPI(request);
        }

        [HttpDelete]
        public async Task<IActionResult> CallExternalAPIDelete([FromQuery] string endpointUrl)
        {
            return await CallExternalAPI(new ApiRequestEntity { EndpointUrl = endpointUrl, HttpMethod = "DELETE" });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
