import { Navigate, Outlet } from 'react-router-dom';
import { getUserRole } from '../utils/helper';

export const ProtectedRoute = () => {
  const role = getUserRole();

  // Not logged in
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
