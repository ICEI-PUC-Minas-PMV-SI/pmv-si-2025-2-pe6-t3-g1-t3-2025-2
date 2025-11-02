using HotelFazendaApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/Rooms
    [Authorize] // comente durante testes se precisar
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public RoomsController(AppDbContext db) => _db = db;

        // -----------------------
        // GET: /api/Rooms
        // Lista com status calculado AGORA (Livre/Ocupado/Manutencao)
        // -----------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> Listar()
        {
            var agoraUtc = DateTime.UtcNow;

            // Quais quartos (por Id) têm reserva ativa AGORA
            var ocupadosIds = await _db.Reservations
                .AsNoTracking()
                .Where(r =>
                    r.QuartoId != null &&
                    r.Status != "Cancelada" &&
                    r.Status != "Finalizada" &&
                    r.DataEntrada <= agoraUtc &&
                    agoraUtc < r.DataSaida)
                .Select(r => r.QuartoId!.Value)
                .Distinct()
                .ToListAsync();

            var ocupadosSet = new HashSet<int>(ocupadosIds);

            var quartos = await _db.Rooms
                .AsNoTracking()
                .OrderBy(q => q.Numero) // Numero é string
                .Select(q => new
                {
                    id = q.Id,                 // int
                    numero = q.Numero,         // string
                    capacidade = q.Capacidade, // int
                    status = q.Status          // string? (Manutencao/Livre/etc)
                })
                .ToListAsync();

            var payload = quartos.Select(q => new
            {
                q.id,
                q.numero,
                q.capacidade,
                status = (q.status == "Manutencao")
                    ? "Manutencao"
                    : (ocupadosSet.Contains(q.id) ? "Ocupado"
                        : (string.IsNullOrWhiteSpace(q.status) ? "Livre" : q.status))
            });

            return Ok(payload);
        }

        // -----------------------
        // GET: /api/Rooms/{id}
        // Detalhe com status calculado AGORA
        // -----------------------
        [HttpGet("{id:int}")]
        public async Task<ActionResult<object>> ObterPorId(int id)
        {
            var room = await _db.Rooms.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (room == null) return NotFound();

            var agoraUtc = DateTime.UtcNow;

            var temReservaAtiva = await _db.Reservations
                .AsNoTracking()
                .AnyAsync(r =>
                    r.QuartoId == id &&
                    r.Status != "Cancelada" &&
                    r.Status != "Finalizada" &&
                    r.DataEntrada <= agoraUtc &&
                    agoraUtc < r.DataSaida);

            var status =
                (room.Status == "Manutencao") ? "Manutencao" :
                (temReservaAtiva) ? "Ocupado" :
                (string.IsNullOrWhiteSpace(room.Status) ? "Livre" : room.Status);

            return Ok(new
            {
                id = room.Id,
                numero = room.Numero,
                capacidade = room.Capacidade,
                status
            });
        }

        // -----------------------
        // GET: /api/Rooms/available?entrada=yyyy-MM-dd&saida=yyyy-MM-dd&hospedes=2
        // Disponibilidade por período (não considera hóspede atual)
        // -----------------------
        [HttpGet("available")]
        [AllowAnonymous] // opcional
        public async Task<ActionResult<IEnumerable<object>>> ListarDisponiveis(
            [FromQuery] string? entrada,
            [FromQuery] string? saida,
            [FromQuery] int? hospedes)
        {
            if (string.IsNullOrWhiteSpace(entrada) || string.IsNullOrWhiteSpace(saida))
                return BadRequest("Parâmetros 'entrada' e 'saida' são obrigatórios (ISO).");

            static bool TryParseToUtc(string s, out DateTime utc)
            {
                if (!DateTime.TryParse(s, out var dt))
                {
                    utc = default;
                    return false;
                }
                utc = dt.Kind == DateTimeKind.Utc ? dt : DateTime.SpecifyKind(dt, DateTimeKind.Utc);
                return true;
            }

            if (!TryParseToUtc(entrada, out var iniUtc) || !TryParseToUtc(saida, out var fimUtc))
                return BadRequest("Datas inválidas. Use ISO (ex.: 2025-11-05 ou 2025-11-05T14:00:00Z).");

            if (fimUtc <= iniUtc)
                return BadRequest("A data de saída deve ser após a data de entrada.");

            var quartosElegiveis = _db.Rooms
                .AsNoTracking()
                .Where(q => q.Status != "Manutencao");

            if (hospedes.HasValue && hospedes.Value > 0)
                quartosElegiveis = quartosElegiveis.Where(q => q.Capacidade >= hospedes.Value);

            // Indisponíveis: qualquer reserva que sobreponha o período
            var idsIndisponiveis = await _db.Reservations
                .AsNoTracking()
                .Where(r =>
                    r.QuartoId != null &&
                    r.Status != "Cancelada" &&
                    r.Status != "Finalizada" &&
                    !(r.DataSaida <= iniUtc || r.DataEntrada >= fimUtc))
                .Select(r => r.QuartoId!.Value)
                .Distinct()
                .ToListAsync();

            var indisSet = new HashSet<int>(idsIndisponiveis);

            var disponiveis = await quartosElegiveis
                .Where(q => !indisSet.Contains(q.Id))
                .OrderBy(q => q.Numero)
                .Select(q => new
                {
                    id = q.Id,
                    numero = q.Numero,
                    capacidade = q.Capacidade,
                    status = "Livre"
                })
                .ToListAsync();

            return Ok(disponiveis);
        }

        // -----------------------
        // GET: /api/Rooms/with-guest
        // Lista com status AGORA + hóspede atual (se houver)
        // -----------------------
        [HttpGet("with-guest")]
        public async Task<ActionResult<IEnumerable<object>>> ListarComHospede()
        {
            var agoraUtc = DateTime.UtcNow;

            var reservasAtivas = await _db.Reservations
                .AsNoTracking()
                .Where(r =>
                    r.QuartoId != null &&
                    r.Status != "Cancelada" &&
                    r.Status != "Finalizada" &&
                    r.DataEntrada <= agoraUtc &&
                    agoraUtc < r.DataSaida)
                .Select(r => new
                {
                    QuartoId = r.QuartoId!.Value, // int
                    r.HospedeNome,
                    r.DataEntrada
                })
                .ToListAsync();

            var ultimoPorQuarto = reservasAtivas
                .GroupBy(x => x.QuartoId)
                .ToDictionary(g => g.Key, g => g.OrderByDescending(x => x.DataEntrada).First());

            var quartos = await _db.Rooms
                .AsNoTracking()
                .OrderBy(q => q.Numero)
                .Select(q => new
                {
                    id = q.Id,
                    numero = q.Numero,
                    capacidade = q.Capacidade,
                    status = q.Status
                })
                .ToListAsync();

            var payload = quartos.Select(q =>
            {
                var hasActive = ultimoPorQuarto.TryGetValue(q.id, out var r);
                var status =
                    (q.status == "Manutencao") ? "Manutencao" :
                    (hasActive) ? "Ocupado" :
                    (string.IsNullOrWhiteSpace(q.status) ? "Livre" : q.status);

                return new
                {
                    q.id,
                    q.numero,
                    q.capacidade,
                    status,
                    hospede = hasActive
                        ? new { nome = r!.HospedeNome, dataEntrada = r.DataEntrada }
                        : null
                };
            });

            return Ok(payload);
        }
    }
}
