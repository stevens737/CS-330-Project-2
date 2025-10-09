using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Fall2025_Project2_bdstevens2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;

        public SearchController(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string query)
        {
            // Retrieve the secrets using the IConfiguration service
            var apiKey = _configuration["GoogleApi:Key"];
            var searchEngineId = _configuration["GoogleApi:Cx"];
            var apiUrl = $"https://customsearch.googleapis.com/customsearch/v1?key={apiKey}&cx={searchEngineId}&q={query}";

            var client = _clientFactory.CreateClient();

            try
            {
                var response = await client.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Content(content, "application/json");
                }

                // Return an error if the Google API call fails
                return StatusCode((int)response.StatusCode, "Error fetching data from Google API.");
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
