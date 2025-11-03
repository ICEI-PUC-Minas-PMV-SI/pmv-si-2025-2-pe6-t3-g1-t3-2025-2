using HotelFazendaApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // base: /api/Reservations
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ReservationsController(AppDbContext db) => _db = db;

        // GET /api/Reservations/ativa-por-quarto/3
        [HttpGet("ativa-por-quarto/{quartoId:int}")]
        public async Task<ActionResult<object>> GetAtivaPorQuarto(int quartoId)
        {
            // Se DataSaida for não anulável, "aberta" = DataSaida == default(DateTime)
            var r = await _db.Reservations
                .AsNoTracking()
                .Where(x => x.QuartoId == quartoId && x.DataSaida == default)
                .OrderByDescending(x => x.DataEntrada)
                .FirstOrDefaultAsync();

            if (r == null)
            {
                var now = DateTime.UtcNow;
                r = await _db.Reservations
                    .AsNoTracking()
                    .Where(x => x.QuartoId == quartoId && x.DataSaida > now)
                    .OrderByDescending(x => x.DataEntrada)
                    .FirstOrDefaultAsync();
            }

            if (r == null) return NotFound();

            return Ok(new
            {
                id = r.Id,
                quartoId = r.QuartoId,
                dataEntrada = r.DataEntrada,
                dataSaida = (r.DataSaida == default ? (DateTime?)null : r.DataSaida),
                hospedeNome = r.HospedeNome
            });
        }

        // GET /api/Reservations/ativas-agora
        [HttpGet("ativas-agora")]
        public async Task<ActionResult<IEnumerable<object>>> GetAtivasAgora()
        {
            var now = DateTime.UtcNow;

            var lista = await _db.Reservations
                .AsNoTracking()
                .Where(x =>
                    // aberta
                    (x.DataSaida == default && x.DataEntrada <= now)
                    ||
                    // vigente (saída no futuro)
                    (x.DataSaida != default && x.DataEntrada <= now && x.DataSaida > now)
                )
                .OrderByDescending(x => x.DataEntrada)
                .Select(x => new
                {
                    id = x.Id,
                    quartoId = x.QuartoId,
                    dataEntrada = x.DataEntrada,
                    dataSaida = (x.DataSaida == default ? (DateTime?)null : x.DataSaida),
                    hospedeNome = x.HospedeNome
                })
                .ToListAsync();

            return Ok(lista);
        }

        // GET /api/Reservations/{id}/checkout
        // GET /api/Rooms/{id}/checkout
        [HttpGet("{id:int}/checkout")]
        [HttpGet("/api/Rooms/{id:int}/checkout")]
        public async Task<ActionResult<object>> GetCheckout(int id)
        {
            var r = await _db.Reservations.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (r == null) return NotFound(new { message = "Reserva não encontrada." });

            // entrada
            var entrada = r.DataEntrada;
            if (entrada == default) entrada = DateTime.UtcNow;

            // fim = DataSaida (se setado) senão agora
            var fim = r.DataSaida;
            if (fim == default) fim = DateTime.UtcNow;

            // noites mínimas 1
            var noites = Math.Max(1, (int)Math.Ceiling((fim - entrada).TotalDays));

            // tarifa placeholder (sem depender de Room.*)
            decimal tarifaDiaria = 0m;
            var totalDiarias = tarifaDiaria * noites;

            // itens ainda sem integração
            var itensDto = new List<object>();
            decimal totalPedidos = 0m;
            decimal totalGeral = totalDiarias + totalPedidos;

            var resp = new
            {
                reservaId = r.Id,
                quarto = new
                {
                    id = r.QuartoId,
                    numero = r.QuartoId.ToString(),
                    tipo = "Padrão",
                    capacidade = 2
                },
                hospede = new
                {
                    nome = r.HospedeNome ?? "—",
                    documento = r.HospedeDocumento,
                    telefone = r.Telefone
                },
                datas = new
                {
                    dataEntrada = entrada,
                    dataSaidaPrevista = (DateTime?)null,
                    dataSaidaReal = (r.DataSaida == default ? (DateTime?)null : r.DataSaida)
                },
                valores = new
                {
                    tarifaDiaria,
                    noites,
                    totalDiarias,
                    totalPedidos,
                    totalGeral
                },
                itens = itensDto
            };

            return Ok(resp);
        }

        public class CheckoutRequest
        {
            public string? FormaPagamento { get; set; }
            public string? Observacao { get; set; }
        }

        // POST /api/Reservations/{id}/checkout
        // POST /api/Rooms/{id}/checkout
        [HttpPost("{id:int}/checkout")]
        [HttpPost("/api/Rooms/{id:int}/checkout")]
        public async Task<IActionResult> PostCheckout(int id, [FromBody] CheckoutRequest? req)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound(new { message = "Reserva não encontrada." });
            if (r.DataSaida != default) return Conflict(new { message = "Reserva já encerrada." });

            r.DataSaida = DateTime.UtcNow; // ou DateTime.Now
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // POST /api/Reservations/{id}/encerrar
        [HttpPost("{id:int}/encerrar")]
        public async Task<IActionResult> Encerrar(int id)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound();
            if (r.DataSaida != default) return Conflict("Reserva já encerrada.");

            r.DataSaida = DateTime.UtcNow; // ou DateTime.Now
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
