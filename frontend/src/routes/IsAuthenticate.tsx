import { Navigate, Outlet } from 'react-router-dom';
import { getUserRole } from '../utils/helper';

export const IsAuthenticate = () => {
  const isAuth = getUserRole();

  // If user is already logged in → redirect
  if (isAuth === 'User') {
    return <Navigate to="/" replace />;
  }

  if (isAuth === 'Admin') {
    return <Navigate to="aba-admin" replace />;
  }

  // If not logged in → allow to access Login/Signup
  return <Outlet />;
};
