import AppRoutes from "./routes";
import AuthProvider from "./context/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
