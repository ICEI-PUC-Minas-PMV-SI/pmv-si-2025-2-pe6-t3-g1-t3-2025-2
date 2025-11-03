using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        // =========================
        // LISTAGEM (usado pelo front)
        // GET /api/Reservations?q=...&status=...
        // status: "Todas" | "Abertas" | "Encerradas"
        // =========================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetLista([FromQuery] string? q, [FromQuery] string? status)
        {
            var query = _db.Reservations.AsNoTracking().AsQueryable();

            // Filtro por status
            if (!string.IsNullOrWhiteSpace(status) && !status.Equals("Todas", StringComparison.OrdinalIgnoreCase))
            {
                if (status.Equals("Abertas", StringComparison.OrdinalIgnoreCase))
                    query = query.Where(r => r.DataSaida == default); // aberta
                else if (status.Equals("Encerradas", StringComparison.OrdinalIgnoreCase))
                    query = query.Where(r => r.DataSaida != default);
            }

            // Filtro de busca
            if (!string.IsNullOrWhiteSpace(q))
            {
                var qNorm = q.Trim();
                query = query.Where(r =>
                    (r.HospedeNome != null && r.HospedeNome.Contains(qNorm)) ||
                    (r.HospedeDocumento != null && r.HospedeDocumento.Contains(qNorm)) ||
                    r.QuartoId.ToString() == qNorm
                );
            }

            var lista = await query
                .OrderByDescending(r => r.DataEntrada)
                .Select(r => new
                {
                    id = r.Id,
                    quartoId = r.QuartoId,
                    hospedeNome = r.HospedeNome,
                    dataEntrada = r.DataEntrada,
                    dataSaida = (r.DataSaida == default ? (DateTime?)null : r.DataSaida)
                })
                .ToListAsync();

            return Ok(lista);
        }

        // =========================
        // ATIVA POR QUARTO
        // GET /api/Reservations/ativa-por-quarto/3
        // =========================
        [HttpGet("ativa-por-quarto/{quartoId:int}")]
        public async Task<ActionResult<object>> GetAtivaPorQuarto(int quartoId)
        {
            var r = await _db.Reservations
                .AsNoTracking()
                .Where(x => x.QuartoId == quartoId && x.DataSaida == default) // aberta
                .OrderByDescending(x => x.DataEntrada)
                .FirstOrDefaultAsync();

            if (r == null)
            {
                var now = DateTime.UtcNow;
                r = await _db.Reservations
                    .AsNoTracking()
                    .Where(x => x.QuartoId == quartoId && x.DataSaida > now) // vigente (saída futura)
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

        // =========================
        // ATIVAS AGORA
        // GET /api/Reservations/ativas-agora
        // =========================
        [HttpGet("ativas-agora")]
        public async Task<ActionResult<IEnumerable<object>>> GetAtivasAgora()
        {
            var now = DateTime.UtcNow;

            var lista = await _db.Reservations
                .AsNoTracking()
                .Where(x =>
                    (x.DataSaida == default && x.DataEntrada <= now) ||           // aberta
                    (x.DataSaida != default && x.DataEntrada <= now && x.DataSaida > now) // vigente
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

        // =========================
        // CHECKOUT (dados para a tela)
        // GET /api/Reservations/{id}/checkout
        // Alias opcional: GET /api/Rooms/{id}/checkout
        // =========================
        [HttpGet("{id:int}/checkout")]
        [HttpGet("/api/Rooms/{id:int}/checkout")]
        public async Task<ActionResult<object>> GetCheckout(int id)
        {
            var r = await _db.Reservations.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (r == null) return NotFound(new { message = "Reserva não encontrada." });

            var entrada = (r.DataEntrada == default) ? DateTime.UtcNow : r.DataEntrada;
            var fim = (r.DataSaida == default) ? DateTime.UtcNow : r.DataSaida;

            var noites = Math.Max(1, (int)Math.Ceiling((fim - entrada).TotalDays));

            // Sem integração de quarto/produtos neste momento
            decimal tarifaDiaria = 0m;
            var totalDiarias = tarifaDiaria * noites;

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

        // =========================
        // CHECKOUT (encerrar)
        // POST /api/Reservations/{id}/checkout
        // Alias opcional: POST /api/Rooms/{id}/checkout
        // =========================
        [HttpPost("{id:int}/checkout")]
        [HttpPost("/api/Rooms/{id:int}/checkout")]
        public async Task<IActionResult> PostCheckout(int id, [FromBody] CheckoutRequest? _)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound(new { message = "Reserva não encontrada." });
            if (r.DataSaida != default) return Conflict(new { message = "Reserva já encerrada." });

            r.DataSaida = DateTime.UtcNow; // ou DateTime.Now
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // =========================
        // ENCERRAR (rota alternativa)
        // POST /api/Reservations/{id}/encerrar
        // =========================
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
