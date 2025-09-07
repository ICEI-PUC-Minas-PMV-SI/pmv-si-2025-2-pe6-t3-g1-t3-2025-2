using HotelFazendaApi.Entities;
using System.Threading.Tasks;

namespace HotelFazendaApi.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User?> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(int id);
    }
}
