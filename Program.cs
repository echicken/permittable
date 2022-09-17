#pragma warning disable CS8604

using Microsoft.EntityFrameworkCore;
using permittable.PostgreSQL;
using permittable.Middleware;
using permittable.Lib;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<PermitContext>(options => options.UseNpgsql(Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")));
builder.Services.AddScoped<Maps>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

using (var scope = app.Services.CreateScope())
{
	var services = scope.ServiceProvider;
	var context = services.GetRequiredService<PermitContext>();
	context.Database.Migrate();
}

app.UseHttpsRedirection();
app.UseAuthorizationMiddleware();
app.UseStaticFiles();
app.UsePathBase("/api");
app.UseRouting();
app.MapControllers();
app.MapControllerRoute(
	name: "default",
	pattern: "{controller}/{action=Index}/{id?}"
);

app.MapFallbackToFile("index.html");;

app.Run();
