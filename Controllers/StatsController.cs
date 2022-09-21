#pragma warning disable CS8604

using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using permittable.PostgreSQL;
using permittable.Lib;

namespace permittable.Controllers;

[ApiController]
[Route("[controller]")]
public class StatsController : ControllerBase
{

	private readonly ILogger<StatsController> _logger;
	private readonly PermitContext _context;
	private readonly Stats _stats;


	public StatsController(ILogger<StatsController> logger, PermitContext context, Stats stats)
	{
		_logger = logger;
		_context = context;
		_stats = stats;
	}

	 // Sends API key to be used client-side
	[HttpGet]
	public IActionResult Index()
	{
		var s = _stats.GetStats();
		return new JsonResult(s, new JsonSerializerOptions{
			PropertyNamingPolicy = null,
			ReferenceHandler = ReferenceHandler.IgnoreCycles,
		});
	}

}
