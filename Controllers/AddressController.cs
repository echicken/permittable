#pragma warning disable CS8602 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
#pragma warning disable CS8604

using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using permittable.Lib;
using permittable.PostgreSQL;

namespace permittable.Controllers;

[ApiController]
[Route("[controller]")]
public class AddressController : ControllerBase
{

	private readonly ILogger<AddressController> _logger;
	private readonly PermitContext _context;
	private Maps _googleMaps;

	public AddressController(ILogger<AddressController> logger, PermitContext context, Maps maps)
	{
		_logger = logger;
		_context = context;
		_googleMaps = maps;
	}

	 // Find an address
	[HttpGet("{terms}")]
	public async Task<IActionResult> Index(string terms)
	{
		string _terms = terms.ToLower();
		List<Address> results;
		if (Regex.IsMatch(terms, "^\\d")) // Assume they're searching for an address starting with a number
		{
			results = _context.Addresses.Where(a => a.Text.ToLower().StartsWith(_terms)).Distinct().Take(10).ToList();
		}
		else // Given text is probably a street name
		{
			results = _context.Addresses.Where(a => a.Text.ToLower().Contains(_terms)).Distinct().Take(10).ToList();
		}
		foreach (Address address in results)
		{
			if (address.Latitude != null && address.Longitude != null) continue;
			LatLng ll = await _googleMaps.GetLatLng(address);
			address.Latitude = ll.Latitude;
			address.Longitude = ll.Longitude;
			_context.Addresses.Update(address);
		}
		_context.SaveChanges();
		return new JsonResult(
			results,
			new JsonSerializerOptions{
				PropertyNamingPolicy = null,
				ReferenceHandler = ReferenceHandler.IgnoreCycles,
			}
		);
	}

	[HttpGet("by-id/{geoid}")]
	public async Task<IActionResult> ByGeoId(string geoid)
	{
		Address address;
		address = _context.Addresses.Where(a => a.GeoID.Equals(geoid)).Single();
		if (address.Latitude == null || address.Longitude == null)
		{
			LatLng ll = await _googleMaps.GetLatLng(address);
			address.Latitude = ll.Latitude;
			address.Longitude = ll.Longitude;
			_context.Addresses.Update(address);
			_context.SaveChanges();
		}
		return new JsonResult(
			address, new JsonSerializerOptions{
				PropertyNamingPolicy = null,
				ReferenceHandler = ReferenceHandler.IgnoreCycles,
			}
		);
	}

	// Accept a POST batch of address records
	[HttpPost("batch")]
	public IActionResult PostMultiple([FromBody] List<Address> addresses)
	{
		foreach (Address address in addresses)
		{
			if (ModelState.IsValid && !_context.Addresses.Any(a => a.GeoID == address.GeoID))
			{
				_context.Addresses.Add(address);
			}
		}
		_context.SaveChanges();
		return Ok();
	}

	// Accept a single POST address record
	[HttpPost]
	public IActionResult Index([FromBody] Address address)
	{
		if (ModelState.IsValid && !_context.Addresses.Any(a => a.GeoID == address.GeoID))
		{
			_context.Addresses.Add(address);
			_context.SaveChanges();
			return Ok();
		}
		else
		{
			return BadRequest();
		}
	}

}
