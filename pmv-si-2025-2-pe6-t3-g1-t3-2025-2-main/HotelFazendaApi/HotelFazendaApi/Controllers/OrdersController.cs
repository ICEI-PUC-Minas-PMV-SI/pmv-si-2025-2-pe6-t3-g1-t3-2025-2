using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelFazendaApi.DTOs.Orders;
using HotelFazendaApi.Services.Interfaces;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _svc;
        public OrdersController(IOrderService svc) => _svc = svc;

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            var userId = int.Parse(User.Claims.First(c => c.Type == "id").Value);
            try
            {
                var result = await _svc.CreateAsync(userId, dto, ct);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == "id").Value);
            var asAdmin = User.IsInRole("Admin");
            var result = await _svc.GetByIdForUserAsync(userId, id, asAdmin, ct);
            return result is null ? NotFound() : Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == "id").Value);
            var asAdmin = User.IsInRole("Admin");
            var result = await _svc.ListAsync(userId, page, pageSize, me: true, asAdmin, ct);
            return Ok(result);
        }
    }
}
