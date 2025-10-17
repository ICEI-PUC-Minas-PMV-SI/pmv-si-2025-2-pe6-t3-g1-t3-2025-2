using HotelFazendaApi.DTOs;
using HotelFazendaApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/order")]
    [Produces("application/json")]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    [Authorize] // exige autenticação em todos os endpoints
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }

        // ==============================================
        // GET: /api/order?page=1&pageSize=20
        // Permite que Admin, Gerente e Recepção listem pedidos com paginação
        // ==============================================
        [HttpGet]
        [Authorize(Roles = "Admin,Gerente,Recepcao")]
        [ProducesResponseType(typeof(IEnumerable<OrderReadDto>), 200)]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var orders = await _service.GetAllAsync(page, pageSize, ct);
            return Ok(orders);
        }

        // ==============================================
        // GET: /api/order/{id}
        // Retorna um pedido específico — qualquer usuário autenticado pode consultar
        // ==============================================
        [HttpGet("{id:int}", Name = "GetOrderById")]
        [ProducesResponseType(typeof(OrderReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<OrderReadDto>> GetById(int id, CancellationToken ct = default)
        {
            var data = await _service.GetByIdAsync(id, ct);
            return data is null ? NotFound() : Ok(data);
        }

        // ==============================================
        // POST: /api/order
        // Cria um novo pedido — permitido para Admin, Gerente e Garçom
        // ==============================================
        [HttpPost]
        [Authorize(Roles = "Admin,Gerente,Garcom")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(OrderReadDto), 201)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<OrderReadDto>> Create(
            [FromBody] OrderCreateDto dto,
            CancellationToken ct = default)
        {
            var created = await _service.CreateAsync(dto, ct);
            if (created is null)
                return Conflict("Não foi possível criar o pedido.");

            return CreatedAtRoute("GetOrderById", new { id = created.Id }, created);
        }

        // ==============================================
        // PUT: /api/order/{id}
        // Atualiza um pedido existente — somente Admin e Gerente
        // ==============================================
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Gerente")]
        [Consumes("application/json")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(int id, [FromBody] OrderUpdateDto dto, CancellationToken ct = default)
        {
            var ok = await _service.UpdateAsync(id, dto, ct);
            return ok ? NoContent() : NotFound();
        }

        // ==============================================
        // DELETE: /api/order/{id}
        // Exclui um pedido — exclusivo para Administrador
        // ==============================================
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
        {
            var ok = await _service.DeleteAsync(id, ct);
            return ok ? NoContent() : NotFound();
        }
    }
}
