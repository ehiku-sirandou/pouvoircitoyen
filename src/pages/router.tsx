import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Route = '/' | '/login' | '/backoffice';

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    const path = window.location.pathname as Route;
    if (path === '/login' || path === '/backoffice') return path;
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as Route;
      if (path === '/login' || path === '/backoffice' || path === '/') {
        setCurrentRoute(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: Route) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}
