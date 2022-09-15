using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace permittable.PostgreSQL;

public class Address
{
    public string? GeoID { get; set; }
    public string? Text { get; set; }
    public string? Postal {get; set; }
    public string? WardGrid { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public ICollection<Permit>? Permits { get; set; }
}
