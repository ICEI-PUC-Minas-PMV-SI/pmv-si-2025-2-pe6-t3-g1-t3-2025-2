import ApiProvider from "./apiProvider";
import { RoomResponseDTO, RoomResponseWithGuestDTO } from "./dto";


class Rooms {
    private provider: ApiProvider;

    constructor(apiProvider: ApiProvider) {
        this.provider = apiProvider;
    }

    async getAllRooms(): Promise<RoomResponseDTO[]> {
        const result = await this.provider.httpRequest('Rooms', 'GET');
        return result;
    }

    async getById(id: number): Promise<RoomResponseDTO> {
        const result = await this.provider.httpRequest(`Rooms/${id}`, 'GET');
        return result;
    }

    async getAvailableRooms(): Promise<RoomResponseDTO[]> {
        const params = { 
            entrada: '2025-10-01',
            saida: '2025-10-10',
            hospedes: 2
        };

        const result = await this.provider.httpRequest('Rooms/available', 'GET', params);
        return result;
    }

    async getRoomsWithGuests(): Promise<RoomResponseWithGuestDTO[]> {
        const result = await this.provider.httpRequest('Rooms/with-guest', 'GET');
        return result;
    }
}

export default Rooms;