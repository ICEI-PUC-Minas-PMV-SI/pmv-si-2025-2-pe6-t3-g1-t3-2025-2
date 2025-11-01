using HotelFazendaApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/Rooms
    [Authorize] // comente durante os testes se precisar
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public RoomsController(AppDbContext db) => _db = db;

        // --- EXISTENTE: lista simples com status calculado agora ---
        // GET: /api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> Listar()
        {
            var agoraUtc = DateTime.UtcNow;

            var quartosComReservaAtiva = await _db.Reservations
                .AsNoTracking()
                .Where(r => r.QuartoId != null
                            && r.Status != "Cancelada"
                            && r.Status != "Finalizada"
                            && r.DataEntrada <= agoraUtc
                            && agoraUtc < r.DataSaida)
                .Select(r => r.QuartoId!.Value)
                .Distinct()
                .ToListAsync();

            var ocupadosAgora = new HashSet<int>(quartosComReservaAtiva);

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

            var payload = quartos.Select(q => new
            {
                q.id,
                q.numero,
                q.capacidade,
                status =
                    (q.status == "Manutencao") ? "Manutencao" :
                    (ocupadosAgora.Contains(q.id)) ? "Ocupado" :
                    (string.IsNullOrWhiteSpace(q.status) ? "Livre" : q.status)
            });

            return Ok(payload);
        }

        // --- EXISTENTE: detalhe de um quarto com status calculado agora ---
        // GET: /api/Rooms/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<object>> Obter(int id)
        {
            var room = await _db.Rooms.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (room == null) return NotFound();

            var agoraUtc = DateTime.UtcNow;

            var reservaAtiva = await _db.Reservations
                .AsNoTracking()
                .AnyAsync(r => r.QuartoId == id
                               && r.Status != "Cancelada"
                               && r.Status != "Finalizada"
                               && r.DataEntrada <= agoraUtc
                               && agoraUtc < r.DataSaida);

            var status =
                (room.Status == "Manutencao") ? "Manutencao" :
                (reservaAtiva) ? "Ocupado" :
                (string.IsNullOrWhiteSpace(room.Status) ? "Livre" : room.Status);

            return Ok(new
            {
                id = room.Id,
                numero = room.Numero,
                capacidade = room.Capacidade,
                status
            });
        }

        // --- NOVO: lista com status + hóspede atual (se houver) ---
        // GET: /api/Rooms/with-guest
        [HttpGet("with-guest")]
        public async Task<ActionResult<IEnumerable<object>>> ListarComHospede()
        {
            var agoraUtc = DateTime.UtcNow;

            // Carrega reservas ativas agora, agrupadas por QuartoId (uma por quarto)
            var reservasAtivas = await _db.Reservations
                .AsNoTracking()
                .Where(r => r.QuartoId != null
                            && r.Status != "Cancelada"
                            && r.Status != "Finalizada"
                            && r.DataEntrada <= agoraUtc
                            && agoraUtc < r.DataSaida)
                .Select(r => new
                {
                    QuartoId = r.QuartoId!.Value,
                    r.HospedeNome,
                    r.DataEntrada
                })
                .ToListAsync();

            var porQuarto = reservasAtivas
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
                var hasActive = porQuarto.TryGetValue(q.id, out var r);
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
                    hospede = (hasActive
                        ? new
                        {
                            nome = r!.HospedeNome,
                            dataEntrada = r.DataEntrada
                        }
                        : null)
                };
            });

            return Ok(payload);
        }
    }
}
