// Controllers/ReservationsController.cs
using HotelFazendaApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")] // /api/Reservations
public class ReservationsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReservationsController(AppDbContext db) => _db = db;

    // ✅ GET /api/Reservations
    // Lista todas as reservas (pode filtrar por hóspede ou status)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll([FromQuery] string? q, [FromQuery] string? status)
    {
        var query = _db.Reservations.AsNoTracking();

        if (!string.IsNullOrEmpty(q))
        {
            query = query.Where(r =>
                r.HospedeNome.Contains(q) ||
                r.QuartoId.ToString().Contains(q));
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Status == status);
        }

        var list = await query
            .OrderByDescending(r => r.DataEntrada)
            .Select(r => new
            {
                id = r.Id,
                quartoId = r.QuartoId,
                hospedeNome = r.HospedeNome,
                dataEntrada = r.DataEntrada,
                dataSaida = r.DataSaida,
                status = r.Status
            })
            .ToListAsync();

        return Ok(list);
    }

    // GET /api/Reservations/ativa-por-quarto/3
    [HttpGet("ativa-por-quarto/{quartoId:int}")]
    public async Task<ActionResult<object>> GetAtivaPorQuarto(int quartoId)
    {
        var r = await _db.Reservations
            .AsNoTracking()
            .Where(x => x.QuartoId == quartoId && x.DataSaida == null)
            .OrderByDescending(x => x.DataEntrada)
            .FirstOrDefaultAsync();

        if (r == null) return NotFound();

        return Ok(new
        {
            id = r.Id,
            quartoId = r.QuartoId,
            dataEntrada = r.DataEntrada,
            dataSaida = r.DataSaida,
            hospedeNome = r.HospedeNome
        });
    }

    // POST /api/Reservations/{id}/encerrar
    [HttpPost("{id:int}/encerrar")]
    public async Task<IActionResult> Encerrar(int id)
    {
        var r = await _db.Reservations.FindAsync(id);
        if (r == null) return NotFound();

        if (r.DataSaida != null)
            return Conflict("Reserva já encerrada.");

        r.DataSaida = DateTime.UtcNow;
        // r.Status = "Encerrada"; // caso tenha coluna de status

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
