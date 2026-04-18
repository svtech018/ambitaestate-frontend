import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

export default function RequireAdminAuth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/admin/login', { replace: true });
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setChecking(true);
      const ok = await authService.check();
      if (mounted) {
        setAuthenticated(ok);
        setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (checking) return null; // or a spinner

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}