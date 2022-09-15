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
	[HttpGet("address/{address}/permits")]
	public IActionResult PermitsByAddress(string address)
	{
		Address addr = _context.Addresses.Include(a => a.Permits).Where(a => a.GeoID == address).Single();
		return new JsonResult(
			addr.Permits.ToList(),
			new JsonSerializerOptions{
				PropertyNamingPolicy = null,
				ReferenceHandler = ReferenceHandler.IgnoreCycles
			}
		);
	}

	[HttpGet("{number}/{revision}")]
	public IActionResult GetPermit(string number, int revision)
	{
		Permit p = _context.Permits.Where(p => p.Number == number && p.Revision == revision).Single();
		Address a = _context.Addresses.Where(a => a.GeoID == p.AddressGeoID).Single();
		return new JsonResult(
			new { Address = a, Permit = p },
			new JsonSerializerOptions{ PropertyNamingPolicy = null }
		);
	}

	// Accept a POST batch of permit records
	[HttpPost("batch")]
	public IActionResult PostMultiple([FromBody] List<Permit> permits)
	{
		foreach (Permit permit in permits)
		{
			if (ModelState.IsValid && !_context.Permits.Any(p => p.Number == permit.Number && p.Revision == permit.Revision))
			{
				_context.Permits.Add(permit);
				_context.SaveChanges();
			}
		}
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
