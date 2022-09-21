#pragma warning disable CS8604

using permittable.PostgreSQL;

namespace permittable.Lib;

public class Stats
{

	private readonly ILogger<Stats> _logger;
	private readonly PermitContext _context;
	private static object _statsData = new {};
	private static DateTime _updated;

	public Stats(ILogger<Stats> logger, PermitContext context)
	{
		_context = context;
		_logger = logger;
	}

	public object GetStats()
	{
		DateTime now = DateTime.Now;

		if (now.Subtract(_updated).Days < 1) return _statsData;

		Address MostPermits = _context.Addresses.OrderByDescending(a => a.Permits.Count()).First();
		int MostPermitsCount = _context.Addresses.Where(a => a.GeoID == MostPermits.GeoID).Select(a => a.Permits.Count()).Single();

		_statsData = new {
			PermitCount = _context.Permits.Count(),
			OldestApplied = _context.Permits.Where(p => p.Applied != null).OrderBy(p => p.Applied).First(),
			NewestApplied = _context.Permits.Where(p => p.Applied != null).OrderByDescending(p => p.Applied).First(),
			OldestIssued = _context.Permits.Where(p => p.Issued != null).OrderBy(p => p.Issued).First(),
			NewestIssued = _context.Permits.Where(p => p.Issued != null).OrderByDescending(p => p.Issued).First(),
			OldestCompleted = _context.Permits.Where(p => p.Completed != null).OrderBy(p => p.Completed).First(),
			NewestCompleted = _context.Permits.Where(p => p.Completed != null).OrderByDescending(p => p.Completed).First(),
			OldestOpen = _context.Permits.Where(p => p.Completed == null).OrderBy(p => p.Applied).First(),
			NewestOpen = _context.Permits.Where(p => p.Completed == null).OrderByDescending(p => p.Applied).First(),
			AddressCount = _context.Addresses.Count(),
			MostPermits = MostPermits,
			MostPermitsCount = MostPermitsCount,
		};

		_updated = DateTime.Now;

		return _statsData;

	}

}