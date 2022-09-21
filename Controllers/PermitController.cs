#pragma warning disable CS8602 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
#pragma warning disable CS8604

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

using permittable.PostgreSQL;

namespace permittable.Controllers;

[ApiController]
[Route("[controller]")]
public class PermitController : ControllerBase
{

	private readonly ILogger<PermitController> _logger;
	private readonly PermitContext _context;

	public PermitController(ILogger<PermitController> logger, PermitContext context)
	{
		_logger = logger;
		_context = context;
	}

	// Find permits for an address
	[HttpGet("address/{address}/permits/{page?}")]
	public IActionResult PermitsByAddress(string address, int page)
	{
		List<Permit> permits = _context.Permits.Where(p => p.AddressGeoID == address).OrderBy(p => p.Number).ThenBy(p => p.Revision).ThenBy(p => p.Applied).Skip(page * 100).Take(100).ToList();
		return new JsonResult(permits, new JsonSerializerOptions{
			PropertyNamingPolicy = null,
			ReferenceHandler = ReferenceHandler.IgnoreCycles
		});
	}

	[HttpGet("{number}/{revision}")]
	public IActionResult GetPermit(string number, int revision)
	{
		Permit p = _context.Permits.Where(p => p.Number == number && p.Revision == revision).Single();
		Address a = _context.Addresses.Where(a => a.GeoID == p.AddressGeoID).Single();
		return new JsonResult(p, new JsonSerializerOptions{
			PropertyNamingPolicy = null,
			ReferenceHandler = ReferenceHandler.IgnoreCycles
		});
	}

	// Accept a POST batch of permit records
	[HttpPost("batch")]
	public IActionResult PostMultiple([FromBody] List<Permit> permits)
	{
		foreach (Permit permit in permits)
		{
			if (!ModelState.IsValid) continue;
			if (!_context.Permits.Any(p => p.Number == permit.Number && p.Revision == permit.Revision))
			{
				_context.Permits.Add(permit);
			}
			else
			{
				_context.Permits.Update(permit);
			}
		}
		_context.SaveChanges();
		return Ok();
	}

	// Accept a single POST permit record
	[HttpPost]
	public IActionResult Index([FromBody] Permit permit)
	{
		if (ModelState.IsValid && !_context.Permits.Any(p => p.Number == permit.Number && p.Revision == permit.Revision))
		{
			_context.Permits.Add(permit);
			_context.SaveChanges();
			return Ok();
		}
		else
		{
			return BadRequest();
		}
	}

}
