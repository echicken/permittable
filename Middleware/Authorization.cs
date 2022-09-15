namespace permittable.Middleware;

public class AuthorizationMiddleware
{

    private readonly RequestDelegate _next;
	private string? _key = Environment.GetEnvironmentVariable("POST_PASSWORD");

    public AuthorizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Method.ToLower() != "post" || context.Request.Headers.Authorization == _key)
        {
            await _next.Invoke(context);
        }
        else
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsJsonAsync(new { err = "Forbidden" });
        }
    }

}

public static class AuthorizationMiddlewareExtensions
{
    public static IApplicationBuilder UseAuthorizationMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<AuthorizationMiddleware>();
    }
}
