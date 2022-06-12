using System.Net.WebSockets;

namespace WebSocketServer
{
    public class Startup
    {
        public void ConfigureServies(IServiceCollection services)
        {

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseWebSockets();

            app.Use(async (context, next) =>
            {
                WriteRequestParameters(context);

                if (context.WebSockets.IsWebSocketRequest)
                {
                    WebSocket webScoket = await context.WebSockets.AcceptWebSocketAsync();
                    System.Console.WriteLine("WebSocket connected");
                }
                else
                {
                    await next();
                }
            });

            app.Run(async (context) =>
            {
                System.Console.WriteLine("Hello from 3rd request delegate");
                await context.Response.WriteAsync("Hello from 3rd request delegate");
            });
        }

        public void WriteRequestParameters(HttpContext context)
        {
            Console.WriteLine("Request Method: " + context.Request.Method);
            Console.WriteLine("Request Protocol: " + context.Request.Protocol);
            if (context.Request.Headers != null)
            {
                foreach (var header in context.Request.Headers)
                {
                    System.Console.WriteLine($"--> {header.Key} : {header.Value}");
                }
            }
        }
    }
}