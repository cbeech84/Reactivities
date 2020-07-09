using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
  public class IsHostRequirement : IAuthorizationRequirement
  {

  }

  public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
  {
    private readonly IHttpContextAccessor _httpContextAcccessor;
    private readonly DataContext _context;
    public IsHostRequirementHandler(IHttpContextAccessor httpContextAcccessor, DataContext context)
    {
      _context = context;
      _httpContextAcccessor = httpContextAcccessor;
    }
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
      var currentUserName = _httpContextAcccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

      var activityId = Guid.Parse(_httpContextAcccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

      var activity = _context.Activities.FindAsync(activityId).Result;

      var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

      if (host?.AppUser?.UserName == currentUserName)
        context.Succeed(requirement);

      return Task.CompletedTask;
    }
  }
}