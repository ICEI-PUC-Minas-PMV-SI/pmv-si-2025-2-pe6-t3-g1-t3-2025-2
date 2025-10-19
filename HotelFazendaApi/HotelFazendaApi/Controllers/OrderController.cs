using HotelFazendaApi.DTOs;
using HotelFazendaApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http; // StatusCodes
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
        // GET: /api/order
        // Lista todos os pedidos. Mensagem customizada se o papel não tiver acesso.
        // ==============================================
        [HttpGet]
        [Authorize] // mantém só a autenticação; a regra de papel é checada manualmente
        [ProducesResponseType(typeof(IEnumerable<OrderReadDto>), 200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAll()
        {
            // Checagem manual para permitir mensagem amigável de 403
            var autorizado =
                User.IsInRole("Admin") ||
                User.IsInRole("Gerente") ||
                User.IsInRole("Recepcao");

            if (!autorizado)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new
                {
                    status = 403,
                    message = "Acesso negado. O seu perfil não possui permissão para listar pedidos."
                });
            }

            var orders = await _service.GetAllAsync();
            return Ok(orders);
        }

        // ==============================================
        // GET: /api/order/{id}
        // Retorna um pedido específico — qualquer usuário autenticado pode consultar
        // ==============================================
        [HttpGet("{id:int}", Name = "GetOrderById")]
        [ProducesResponseType(typeof(OrderReadDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<OrderReadDto>> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
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
        public async Task<ActionResult<OrderReadDto>> Create([FromBody] OrderCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
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
        public async Task<IActionResult> Update(int id, [FromBody] OrderUpdateDto dto)
        {
            var ok = await _service.UpdateAsync(id, dto);
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
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
