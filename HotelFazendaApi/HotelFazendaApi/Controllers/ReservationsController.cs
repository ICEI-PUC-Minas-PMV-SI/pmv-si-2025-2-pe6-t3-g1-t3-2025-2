using HotelFazendaApi.Data;
using HotelFazendaApi.DTOs;
using HotelFazendaApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // se sua API exige token; remova se quiser testar sem auth
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ReservationsController(AppDbContext db) => _db = db;

        // GET: /api/reservas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> Listar()
        {
            var data = await _db.Reservations
                .Include(r => r.Quarto)
                .OrderByDescending(r => r.CriadoEm)
                .Select(r => new ReservationDto{
                    Id = r.Id,
                    HospedeNome = r.HospedeNome,
                    Quarto = r.Quarto != null ? (r.Quarto.Numero) : null,
                    Status = r.Status,
                    DataEntrada = r.DataEntrada,
                    DataSaida = r.DataSaida
                })
                .ToListAsync();

            return Ok(data);
        }

        // POST: /api/reservas
        [HttpPost]
        public async Task<ActionResult<ReservationDto>> Criar([FromBody] ReservationCreateDto dto)
        {
            if (dto.DataSaida <= dto.DataEntrada)
                return BadRequest(new { mensagem = "Data de saída deve ser após a entrada." });

            // valida quarto se informado
            Room? quarto = null;
            if (dto.QuartoId.HasValue)
            {
                quarto = await _db.Rooms.FindAsync(dto.QuartoId.Value);
                if (quarto == null) return NotFound(new { mensagem = "Quarto não encontrado." });

                // checa disponibilidade básica
                bool conflita = await _db.Reservations.AnyAsync(r =>
                    r.QuartoId == quarto.Id &&
                    r.Status != "Cancelada" &&
                    r.DataEntrada < dto.DataSaida &&
                    dto.DataEntrada < r.DataSaida
                );
                if (conflita) return Conflict(new { mensagem = "Quarto indisponível no período." });
            }

            var entity = new Reservation
            {
                HospedeNome = dto.HospedeNome,
                HospedeDocumento = dto.HospedeDocumento,
                Telefone = dto.Telefone,
                QtdeHospedes = dto.QtdeHospedes,
                DataEntrada = dto.DataEntrada,
                DataSaida = dto.DataSaida,
                QuartoId = dto.QuartoId,
                Status = "Aberta"
            };

            _db.Reservations.Add(entity);
            await _db.SaveChangesAsync();

            var result = new ReservationDto{
                Id = entity.Id,
                HospedeNome = entity.HospedeNome,
                Quarto = quarto?.Numero,
                Status = entity.Status,
                DataEntrada = entity.DataEntrada,
                DataSaida = entity.DataSaida
            };
            return CreatedAtAction(nameof(Obter), new { id = entity.Id }, result);
        }

        // GET: /api/reservas/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReservationDto>> Obter(int id)
        {
            var r = await _db.Reservations.Include(x => x.Quarto).FirstOrDefaultAsync(x => x.Id == id);
            if (r == null) return NotFound();

            return new ReservationDto{
                Id = r.Id,
                HospedeNome = r.HospedeNome,
                Quarto = r.Quarto?.Numero,
                Status = r.Status,
                DataEntrada = r.DataEntrada,
                DataSaida = r.DataSaida
            };
        }

        // GET: /api/reservas/disponibilidade?dataEntrada=...&dataSaida=...&capacidade=2
        [HttpGet("disponibilidade")]
        public async Task<ActionResult<IEnumerable<object>>> Disponibilidade(
            [FromQuery] DateTime dataEntrada,
            [FromQuery] DateTime dataSaida,
            [FromQuery] int capacidade = 1)
        {
            if (dataSaida <= dataEntrada)
                return BadRequest(new { mensagem = "Período inválido." });

            // quartos com capacidade OK
            var baseQuery = _db.Rooms.Where(q => q.Capacidade >= capacidade && q.Status != "Manutencao");

            // remove os que estão reservados no período
            var quartosIndisponiveis = await _db.Reservations
                .Where(r => r.Status != "Cancelada" &&
                            r.DataEntrada < dataSaida &&
                            dataEntrada < r.DataSaida &&
                            r.QuartoId != null)
                .Select(r => r.QuartoId!.Value)
                .Distinct()
                .ToListAsync();

            var livres = await baseQuery
                .Where(q => !quartosIndisponiveis.Contains(q.Id))
                .OrderBy(q => q.Numero)
                .Select(q => new { id = q.Id, numero = q.Numero, capacidade = q.Capacidade })
                .ToListAsync();

            return Ok(livres);
        }

        // PUT: /api/reservas/{id}/status?novo=Confirmada|Cancelada
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> AlterarStatus(int id, [FromQuery] string novo = "Confirmada")
        {
            var r = await _db.Reservations.FindAsync(id);
            if (r == null) return NotFound();

            r.Status = novo;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
