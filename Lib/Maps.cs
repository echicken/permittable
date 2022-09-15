using GoogleMapsApi;
using GoogleMapsApi.Entities.Common;
using GoogleMapsApi.Entities.Geocoding.Request;
using GoogleMapsApi.Entities.Geocoding.Response;
using permittable.PostgreSQL;

namespace permittable.Lib;

public class Maps
{

	private readonly ILogger<Maps> _logger;
	private string? _serverKey = Environment.GetEnvironmentVariable("GOOGLE_MAPS_SS_API_KEY");
	public string? ClientKey = Environment.GetEnvironmentVariable("GOOGLE_MAPS_CS_API_KEY");
	public readonly LatLng DefaultLatLng = new LatLng(43.725, -79.5);

	public Maps(ILogger<Maps> logger)
	{
		_logger = logger;
	}

	public async Task<LatLng> GetLatLng(Address address)
	{
		_logger.LogInformation($"Performing geocoding lookup for {address.Text}");
		GeocodingRequest greq = new GeocodingRequest(){
			ApiKey = _serverKey,
			Address = $"{address.Text}, Toronto, ON",
		};
		var geng = GoogleMaps.Geocode;
		GeocodingResponse gres = await geng.QueryAsync(greq);
		Result? res = gres.Results.FirstOrDefault();
		if (res == null)
		{
			return DefaultLatLng;
		}
		return new LatLng(res.Geometry.Location.Latitude, res.Geometry.Location.Longitude);
	}

}

public class LatLng
{
	public double Latitude { get; set; }
	public double Longitude { get; set; }
	public LatLng(double lat, double lng)
	{
		Latitude = lat;
		Longitude = lng;
	}
}