import { useEffect, useState } from 'react';
import { useAuth } from './auth/auth-context';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';

const LOGIN_PATH = '/login';
const HOME_PATH = '/';

function replaceRoute(path: string) {
  if (window.location.pathname !== path) {
    window.history.replaceState({}, '', path);
  }
}

function readCurrentPath(): string {
  return window.location.pathname || HOME_PATH;
}

function App() {
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(readCurrentPath());

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(readCurrentPath());
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      replaceRoute(LOGIN_PATH);
      setCurrentPath(LOGIN_PATH);
      return;
    }

    if (currentPath === LOGIN_PATH) {
      replaceRoute(HOME_PATH);
      setCurrentPath(HOME_PATH);
    }
  }, [currentPath, isAuthenticated]);

  if (!isAuthenticated || currentPath === LOGIN_PATH) {
    return <LoginPage />;
  }

  return <AdminDashboard />;
}

export default App;
