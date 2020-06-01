using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //host stores the createhostbuilder method
            var host = CreateHostBuilder(args).Build();
            //use using because we want automatic disposal of the dbcontext after it has been used
            using (var scope = host.Services.CreateScope()) //get the scope here
            {
                var services = scope.ServiceProvider; //get reference to services
                try{
                    var context = services.GetRequiredService<DataContext>(); //get the db context
                    context.Database.Migrate(); //migrate the db on startup
                    Seed.SeedData(context);
                }
                catch (Exception ex) //catch exceptions here
                {
                    var logger = services.GetRequiredService<ILogger<Program>>(); //log the issue
                    logger.LogError(ex, "An error occured during migration.");
                }
            }
            
            host.Run(); //run the app
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
