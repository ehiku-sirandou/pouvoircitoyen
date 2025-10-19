import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './pages/router';
import Home from './pages/Home';
import Login from './pages/Login';
import Backoffice from './pages/Backoffice';

function AppRoutes() {
  const { currentRoute } = useRouter();

  switch (currentRoute) {
    case '/login':
      return <Login />;
    case '/backoffice':
      return <Backoffice />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppRoutes />
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
