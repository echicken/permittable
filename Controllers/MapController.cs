using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using permittable.Lib;

namespace permittable.Controllers;

[ApiController]
[Route("[controller]")]
public class MapController : ControllerBase
{

	private readonly ILogger<MapController> _logger;
    private Maps _googleMaps;
	public MapController(ILogger<MapController> logger, Maps maps)
	{
		_logger = logger;
		_googleMaps = maps;
	}

	 // Sends API key to be used client-side
	[HttpGet("key")]
	public IActionResult GetKey()
	{
		return new JsonResult(new { key = _googleMaps.ClientKey }, new JsonSerializerOptions{ PropertyNamingPolicy = null });
	}

	// Sends { Latitude, Longitude } map-centre coordinates
	[HttpGet("center")]
	public IActionResult GetCenter()
	{
		return new JsonResult(_googleMaps.DefaultLatLng, new JsonSerializerOptions{ PropertyNamingPolicy = null });
	}

}
