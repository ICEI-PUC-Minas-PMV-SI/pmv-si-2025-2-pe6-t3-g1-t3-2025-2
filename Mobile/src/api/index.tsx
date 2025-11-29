import Auth from './auth';
import Rooms from './rooms';
import Reservations from './reservations';
import Products from './products';
import Orders from './orders'; // 1. Importa a classe Orders
import ApiProvider from './apiProvider';

const provider = new ApiProvider("http://localhost:5210/api");

class Api {
    static auth = new Auth(provider);
    static rooms = new Rooms(provider);
    static reservations = new Reservations(provider);
    static products = new Products(provider);
    
    // 2. Adiciona o serviço de Pedidos (Orders)
    static orders = new Orders(provider); 

    // 3. Método para atualizar o token globalmente após o login
    // ESTE É O NOVO CÓDIGO CRÍTICO PARA CORRIGIR O 401
    static setAuthToken(token: string) {
        provider.setToken(token);
    }

    static getUserInfo() {
        return Auth.userInfo;
    }
}

export default Api;