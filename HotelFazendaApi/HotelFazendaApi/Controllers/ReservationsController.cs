using HotelFazendaApi.Data;
using HotelFazendaApi.Entities; // ajuste se a entidade estiver em outro namespace
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

        // ----------------- DTOs -----------------
        public record ReservationListItemDto(
            int Id,
            int QuartoId,
            DateTime DataEntrada,
            DateTime? DataSaida,
            string? HospedeNome
        );

        public class CreateReservationDto
        {
            public int QuartoId { get; set; }
            public string? HospedeNome { get; set; }
            public string? HospedeDocumento { get; set; }
            public string? Telefone { get; set; }
            public DateTime? DataEntrada { get; set; }
            public DateTime? SaidaPrevista { get; set; }    // ignorado se o modelo não tiver
            public decimal? TarifaDiaria { get; set; }      // idem
            public int? Adultos { get; set; }               // só pra não quebrar o front
            public int? Criancas { get; set; }
            public string? Observacoes { get; set; }
        }

        // -------- LISTAR (GET /api/Reservations) --------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationListItemDto>>> GetAll(
            [FromQuery] string? q,
            [FromQuery] string? status)
        {
            var now = DateTime.UtcNow;
            var qry = _db.Reservations.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var t = q.Trim();
                qry = qry.Where(x =>
                    (x.HospedeNome ?? "").ToLower().Contains(t.ToLower()) ||
                    (x.HospedeDocumento ?? "").ToLower().Contains(t.ToLower()) ||
                    (x.QuartoId.HasValue && x.QuartoId.Value.ToString() == t)
                );
            }

            switch ((status ?? "").Trim().ToLowerInvariant())
            {
                case "ativas":
                    qry = qry.Where(x => x.DataSaida == default || x.DataSaida > now);
                    break;
                case "encerradas":
                    qry = qry.Where(x => x.DataSaida != default && x.DataSaida <= now);
                    break;
            }

            var lista = await qry
                .OrderByDescending(x => x.DataEntrada)
                .Select(x => new ReservationListItemDto(
                    x.Id,
                    x.QuartoId.GetValueOrDefault(),
                    x.DataEntrada,
                    x.DataSaida == default ? (DateTime?)null : x.DataSaida,
                    x.HospedeNome
                ))
                .ToListAsync();

            return Ok(lista);
        }

        // -------- CRIAR (POST /api/Reservations) --------
        [HttpPost]
        public async Task<ActionResult<object>> Create([FromBody] CreateReservationDto body)
        {
            if (body is null) return BadRequest(new { message = "Corpo da requisição é obrigatório." });
            if (body.QuartoId <= 0) return BadRequest(new { message = "QuartoId inválido." });

            var now = DateTime.UtcNow;
            var jaAtiva = await _db.Reservations.AsNoTracking().AnyAsync(x =>
                (x.QuartoId ?? 0) == body.QuartoId &&
                (x.DataSaida == default || x.DataSaida > now)
            );
            if (jaAtiva)
                return Conflict(new { message = "Já existe uma reserva ativa/vigente para este quarto." });

            var r = new Reservation
            {
                QuartoId = body.QuartoId,
                HospedeNome = body.HospedeNome,
                HospedeDocumento = body.HospedeDocumento,
                Telefone = body.Telefone,
                DataEntrada = body.DataEntrada == null || body.DataEntrada == default
                    ? DateTime.UtcNow
                    : body.DataEntrada.Value
                // DataSaida permanece default
            };

            _db.Reservations.Add(r);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = r.Id }, new
            {
                id = r.Id,
                quartoId = r.QuartoId.GetValueOrDefault(),
                dataEntrada = r.DataEntrada,
                dataSaida = (DateTime?)null,
                hospedeNome = r.HospedeNome
            });
        }

        // -------- GET por id (GET /api/Reservations/{id}) --------
        [HttpGet("{id:int}")]
        public async Task<ActionResult<object>> GetById(int id)
        {
            var r = await _db.Reservations.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (r is null) return NotFound();

            return Ok(new
            {
                id = r.Id,
                quartoId = r.QuartoId.GetValueOrDefault(),
                dataEntrada = r.DataEntrada,
                dataSaida = r.DataSaida == default ? (DateTime?)null : r.DataSaida,
                hospedeNome = r.HospedeNome,
                hospedeDocumento = r.HospedeDocumento,
                telefone = r.Telefone
            });
        }

        // -------- ATIVA POR QUARTO --------
        [HttpGet("ativa-por-quarto/{quartoId:int}")]
        public async Task<ActionResult<object>> GetAtivaPorQuarto(int quartoId)
        {
            var r = await _db.Reservations
                .AsNoTracking()
                .Where(x => (x.QuartoId ?? 0) == quartoId && x.DataSaida == default)
                .OrderByDescending(x => x.DataEntrada)
                .FirstOrDefaultAsync();

            if (r == null)
            {
                var now = DateTime.UtcNow;
                r = await _db.Reservations
                    .AsNoTracking()
                    .Where(x => (x.QuartoId ?? 0) == quartoId && x.DataSaida > now)
                    .OrderByDescending(x => x.DataEntrada)
                    .FirstOrDefaultAsync();
            }

            if (r == null) return NotFound();

            return Ok(new
            {
                id = r.Id,
                quartoId = r.QuartoId.GetValueOrDefault(),
                dataEntrada = r.DataEntrada,
                dataSaida = r.DataSaida == default ? (DateTime?)null : r.DataSaida,
                hospedeNome = r.HospedeNome
            });
        }

        // -------- ATIVAS AGORA --------
        [HttpGet("ativas-agora")]
        public async Task<ActionResult<IEnumerable<object>>> GetAtivasAgora()
        {
            var now = DateTime.UtcNow;

            var lista = await _db.Reservations
                .AsNoTracking()
                .Where(x =>
                    (x.DataSaida == default && x.DataEntrada <= now) ||
                    (x.DataSaida != default && x.DataEntrada <= now && x.DataSaida > now)
                )
                .OrderByDescending(x => x.DataEntrada)
                .Select(x => new
                {
                    id = x.Id,
                    quartoId = x.QuartoId.GetValueOrDefault(),
                    dataEntrada = x.DataEntrada,
                    dataSaida = x.DataSaida == default ? (DateTime?)null : x.DataSaida,
                    hospedeNome = x.HospedeNome
                })
                .ToListAsync();

            return Ok(lista);
        }

        // -------- CHECKOUT (GET/POST) e ENCERRAR --------
        [HttpGet("{id:int}/checkout")]
        [HttpGet("/api/Rooms/{id:int}/checkout")]
        public async Task<ActionResult<object>> GetCheckout(int id)
        {
            var r = await _db.Reservations.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (r == null) return NotFound(new { message = "Reserva não encontrada." });

            var entrada = r.DataEntrada == default ? DateTime.UtcNow : r.DataEntrada;
            var fim = r.DataSaida == default ? DateTime.UtcNow : r.DataSaida;
            var noites = Math.Max(1, (int)Math.Ceiling((fim - entrada).TotalDays));

            decimal tarifaDiaria = 0m;
            var totalDiarias = tarifaDiaria * noites;
            var itensDto = new List<object>();
            decimal totalPedidos = 0m;
            decimal totalGeral = totalDiarias + totalPedidos;

            return Ok(new
            {
                reservaId = r.Id,
                quarto = new { id = r.QuartoId.GetValueOrDefault(), numero = r.QuartoId.GetValueOrDefault().ToString(), tipo = "Padrão", capacidade = 2 },
                hospede = new { nome = r.HospedeNome ?? "—", documento = r.HospedeDocumento, telefone = r.Telefone },
                datas = new
                {
                    dataEntrada = entrada,
                    dataSaidaPrevista = (DateTime?)null,
                    dataSaidaReal = r.DataSaida == default ? (DateTime?)null : r.DataSaida
                },
                valores = new { tarifaDiaria, noites, totalDiarias, totalPedidos, totalGeral },
                itens = itensDto
            });
        }

        public class CheckoutRequest
        {
            public string? FormaPagamento { get; set; }
            public string? Observacao { get; set; }
        }

        [HttpPost("{id:int}/checkout")]
        [HttpPost("/api/Rooms/{id:int}/checkout")]
        public async Task<IActionResult> PostCheckout(int id, [FromBody] CheckoutRequest? _)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound(new { message = "Reserva não encontrada." });
            if (r.DataSaida != default) return Conflict(new { message = "Reserva já encerrada." });

            r.DataSaida = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id:int}/encerrar")]
        public async Task<IActionResult> Encerrar(int id)
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound();
            if (r.DataSaida != default) return Conflict("Reserva já encerrada.");

            r.DataSaida = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
