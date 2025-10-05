using HotelFazendaApi.DTOs;
using HotelFazendaApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔒 exige autenticação para todos os endpoints deste controller
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;
        2
        public OrderController(IOrderService service)
        {
            _service = service;
        }

        // GET: api/order
        // Somente Admin, Gerente e Recepção podem visualizar todos os pedidos
        [HttpGet]
        [Authorize(Roles = "Admin,Gerente,Recepcao")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllAsync();
            return Ok(orders);
        }

        // GET: api/order/{id}
        // Qualquer usuário autenticado pode consultar um pedido específico
        // 🔖 Nomeamos a rota para usar no CreatedAtRoute
        [HttpGet("{id:int}", Name = "GetOrderById")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var data = await _service.GetByIdAsync(id);
            return data is null ? NotFound() : Ok(data);
        }

        // POST: api/order
        // Admin, Gerente e Garçom podem criar pedidos
        [HttpPost]
        [Authorize(Roles = "Admin,Gerente,Garcom")]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var created = await _service.CreateAsync(dto);
            if (created is null) return BadRequest("Não foi possível criar o pedido.");

            // ✅ Retorna 201 e o Location apontando para GET api/order/{id}
            return CreatedAtRoute("GetOrderById", new { id = created.Id }, created);
        }

        // PUT: api/order/{id}
        // Somente Admin e Gerente podem atualizar pedidos
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Gerente")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] OrderUpdateDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var ok = await _service.UpdateAsync(id, dto);
            return ok ? NoContent() : NotFound();
        }

        // DELETE: api/order/{id}
        // Exclusivo para Administradores
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
