#pragma warning disable CS8604

using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace permittable.PostgreSQL;

public class DateConverter : ValueConverter<DateTime, DateTime>
{
	public DateConverter() : base(
		v => DateTime.SpecifyKind(v, DateTimeKind.Utc),
		v => v
	){}
}

public class Trimmer : ValueConverter<string, string>
{
	public Trimmer() : base(
		v => v.Trim(),
		v => v.Trim()
	){}
}

public class PermitContext : DbContext
{
	public DbSet<Permit>? Permits { get; set; }
	public DbSet<Address>? Addresses { get; set; }

	protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
	{
		configurationBuilder.Properties<DateTime>().HaveConversion<DateConverter>();
		configurationBuilder.Properties<string>().HaveConversion<Trimmer>();
	}
	
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Permit>().HasKey(o => new { o.Number, o.Revision });
		modelBuilder.Entity<Permit>().HasOne<Address>(p => p.Address).WithMany(a => a.Permits).HasForeignKey(p => p.AddressGeoID);
		modelBuilder.Entity<Address>().HasKey(o => new { o.GeoID });
	}

	public PermitContext(DbContextOptions options) : base(options) {}

}
