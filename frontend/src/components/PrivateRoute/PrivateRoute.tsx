import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import Spinner from '../Spinner/Spinner';

interface PrivateRouteProps {
  redirectTo?: string;
  requiredRole?: string;
}

export default function PrivateRoute({ redirectTo = '/login', requiredRole }: PrivateRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;

  return <Outlet />;
}
