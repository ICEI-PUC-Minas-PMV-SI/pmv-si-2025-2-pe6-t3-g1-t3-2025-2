using HotelFazendaApi.Data;
using HotelFazendaApi.Entities;
using HotelFazendaApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/reservations")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ReservationsController(AppDbContext db)
        {
            _db = db;
        }

        // ============================================================
        // GET → Lista todas as reservas (com filtros)
        // ============================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetAll(
            [FromQuery] string? q,
            [FromQuery] string? status)
        {
            var now = DateTime.UtcNow;
            var qry = _db.Reservations
                .AsNoTracking()
                .Include(r => r.Quarto)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var t = q.Trim().ToLower();
                qry = qry.Where(x =>
                       (x.HospedeNome ?? "").ToLower().Contains(t)
                    || (x.HospedeDocumento ?? "").ToLower().Contains(t)
                    || (x.QuartoId != null && x.QuartoId.ToString() == t)
                );
            }

            switch ((status ?? "").Trim().ToLowerInvariant())
            {
                case "ativas":
                    qry = qry.Where(x =>
                        x.DataEntrada <= now &&
                        (x.DataSaida == default || x.DataSaida > now)
                    );
                    break;

                case "encerradas":
                    qry = qry.Where(x =>
                        x.DataSaida != default && x.DataSaida <= now
                    );
                    break;
            }

            var lista = await qry
                .OrderByDescending(x => x.DataEntrada)
                .Select(x => new ReservationDto
                {
                    Id = x.Id,
                    HospedeNome = x.HospedeNome,
                    Quarto = x.Quarto != null ? x.Quarto.Numero : "—",
                    Status = x.DataSaida == default ? "Ativa" : "Encerrada",
                    DataEntrada = x.DataEntrada,
                    DataSaida = x.DataSaida
                })
                .ToListAsync();

            return Ok(lista);
        }

        // ============================================================
        // GET → Detalhe por ID
        // ============================================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReservationDto>> GetById(int id)
        {
            var r = await _db.Reservations
                .AsNoTracking()
                .Include(x => x.Quarto)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (r == null) return NotFound();

            return Ok(new ReservationDto
            {
                Id = r.Id,
                HospedeNome = r.HospedeNome,
                Quarto = r.Quarto?.Numero ?? "—",
                Status = r.DataSaida == default ? "Ativa" : "Encerrada",
                DataEntrada = r.DataEntrada,
                DataSaida = r.DataSaida
            });
        }

        // ============================================================
        // POST → Criar reserva
        // ============================================================

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] ReservationCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.QuartoId == null || dto.QuartoId <= 0)
                return BadRequest(new { message = "QuartoId inválido." });

            var now = DateTime.UtcNow;

            var existeAtiva = await _db.Reservations.AsNoTracking()
                .AnyAsync(x =>
                    x.QuartoId == dto.QuartoId &&
                    x.DataEntrada <= now &&
                    (x.DataSaida == default || x.DataSaida > now)
                );

            if (existeAtiva)
                return Conflict(new { message = "Este quarto já possui reserva ativa." });

            var r = new Reservation
            {
                HospedeNome = dto.HospedeNome,
                HospedeDocumento = dto.HospedeDocumento,
                Telefone = dto.Telefone,
                QuartoId = dto.QuartoId,
                DataEntrada = dto.DataEntrada,
                DataSaida = dto.DataSaida,
                ValorTotal = dto.ValorTotal,
                QtdeHospedes = dto.QtdeHospedes
            };

            _db.Reservations.Add(r);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = r.Id }, new { r.Id });
        }

        // ============================================================
        // GET → HOSPEDAGEM ATIVA POR QUARTO
        // ============================================================

        [HttpGet("ativa-por-quarto/{quartoId:int}")]
        public async Task<ActionResult<object>> GetAtivaPorQuarto(int quartoId)
        {
            var now = DateTime.UtcNow;

            var r = await _db.Reservations
                .AsNoTracking()
                .Where(x => x.QuartoId == quartoId)
                .Where(x =>
                    x.DataEntrada <= now &&
                    (x.DataSaida == default || x.DataSaida > now)
                )
                .OrderByDescending(x => x.DataEntrada)
                .FirstOrDefaultAsync();

            if (r == null) return NotFound();

            return Ok(new
            {
                id = r.Id,
                quartoId = r.QuartoId,
                dataEntrada = r.DataEntrada,
                dataSaida = r.DataSaida == default ? (DateTime?)null : r.DataSaida,
                hospedeNome = r.HospedeNome
            });
        }

        // fallback com query string
        [HttpGet("ativa-por-quarto")]
        public Task<ActionResult<object>> GetAtivaPorQuartoQuery([FromQuery] int quartoId)
            => GetAtivaPorQuarto(quartoId);

        // ============================================================
        // GET → Todas as reservas ativas agora
        // ============================================================

        [HttpGet("ativas-agora")]
        public async Task<ActionResult<IEnumerable<object>>> GetAtivasAgora()
        {
            var now = DateTime.UtcNow;

            var lista = await _db.Reservations
                .AsNoTracking()
                .Where(x =>
                    x.DataEntrada <= now &&
                    (x.DataSaida == default || x.DataSaida > now)
                )
                .OrderByDescending(x => x.DataEntrada)
                .Select(x => new
                {
                    Id = x.Id,
                    QuartoId = x.QuartoId,
                    HospedeNome = x.HospedeNome,
                    DataEntrada = x.DataEntrada,
                    DataSaida = x.DataSaida == default ? (DateTime?)null : x.DataSaida
                })
                .ToListAsync();

            return Ok(lista);
        }

        // ============================================================
        // GET → CHECKOUT (DETALHES DA CONTA)
        // Usado pela tela /conta/:id
        // Mantendo o formato antigo do CheckoutDto
        // ============================================================

        [HttpGet("{id:int}/checkout")]
        [HttpGet("/api/Rooms/{id:int}/checkout")]
        [ProducesResponseType(typeof(CheckoutDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<CheckoutDto>> GetCheckout(int id)
        {
            var reserva = await _db.Reservations
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reserva == null) return NotFound();

            var pedidos = await _db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Produto)
                .Where(o => o.ReservationId == id && o.Status.ToString() != "Canceled")
                .ToListAsync();

            decimal totalConsumo = pedidos.Sum(o => o.Total);
            decimal valorHospedagem = reserva.ValorTotal;

            var detalhesPedidos = pedidos.Select(o => new OrderReadDto
            {
                Id = o.Id,
                CustomerName = o.CustomerName,
                ReservationId = o.ReservationId,
                Status = o.Status.ToString(),
                Total = o.Total,
                Items = o.OrderItems.Select(oi => new OrderItemReadDto
                {
                    ProdutoId = oi.ProdutoId,
                    NomeProduto = oi.Produto?.Nome ?? "Produto Não Encontrado",
                    Quantidade = oi.Quantidade,
                    PrecoUnitario = oi.PrecoUnitario,
                    Subtotal = oi.PrecoUnitario * oi.Quantidade
                }).ToList()
            }).ToList();

            return Ok(new CheckoutDto
            {
                ReservationId = reserva.Id,
                CustomerName = reserva.HospedeNome,
                TotalHospedagem = valorHospedagem,
                TotalConsumoRestaurante = totalConsumo,
                ValorFinalDaConta = valorHospedagem + totalConsumo,
                DetalhesDosPedidos = detalhesPedidos
            });
        }

        public class CheckoutRequest
        {
            public string? FormaPagamento { get; set; }
            public string? Observacao { get; set; }
        }

        // ============================================================
        // POST → Finalizar checkout (encerrar + faturar pedidos)
        // ============================================================

        [HttpPost("{id:int}/checkout")]
        [Authorize(Roles = "Admin,Gerente,Recepcao")]
        public async Task<IActionResult> PostCheckout(int id, [FromBody] CheckoutRequest? _)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound(new { message = "Reserva não encontrada." });

            if (r.Status == "Encerrada" || r.DataSaida != default)
                return Conflict(new { message = "Reserva já encerrada." });

            r.DataSaida = DateTime.UtcNow;
            r.Status = "Encerrada";

            var pedidos = await _db.Orders
                .Where(o => o.ReservationId == id && o.Status.ToString() != "Canceled")
                .ToListAsync();

            foreach (var pedido in pedidos)
            {
                pedido.Status = OrderStatus.Billed;
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // ============================================================
        // POST → Encerrar simples (sem conta detalhada)
        // ============================================================

        [HttpPost("{id:int}/encerrar")]
        public async Task<IActionResult> Encerrar(int id)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound();

            if (r.DataSaida != default)
                return Conflict(new { message = "Reserva já encerrada." });

            r.DataSaida = DateTime.UtcNow;
            r.Status = "Encerrada";

            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
