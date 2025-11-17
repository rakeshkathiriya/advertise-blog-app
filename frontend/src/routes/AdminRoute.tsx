import { Navigate, Outlet } from 'react-router-dom';
import { getUserRole } from '../utils/helper';

export const AdminRoute = () => {
  const role = getUserRole();

  // Not logged in
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Not an admin
  if (role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
