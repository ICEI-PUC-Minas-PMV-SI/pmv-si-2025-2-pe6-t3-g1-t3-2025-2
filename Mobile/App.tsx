import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from "react-native-toast-message";
import HomeScreen from "./src/screens/home";
import LoginScreen from "./src/screens/login";
import NewUserScreen from './src/screens/newUser';
import ProductsScreen from './src/screens/products';
import ReservationsScreen from './src/screens/reservations';
import RoomsScreen from "./src/screens/rooms";

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Rooms" component={RoomsScreen} />
        <Stack.Screen name="Reservations" component={ReservationsScreen} />
        <Stack.Screen name="NewUser" component={NewUserScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </>
  );
}
