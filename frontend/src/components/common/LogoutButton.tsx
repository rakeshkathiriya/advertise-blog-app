import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserLogout } from '../../queries/auth.query';
import { logoutUser } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';

export const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: logoutMutate, isPending: logoutPending } = useUserLogout();

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSuccess: (data) => {
        toast.success(data.message ?? 'Logged out successfully');

        // Clear Redux
        dispatch(logoutUser());
        localStorage.clear();
        // Redirect
        navigate('/login');
      },
      onError: (error) => {
        toast.error(error.message ?? 'Logout failed');
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={logoutPending}
      title="Logout"
      className="text-textWhite cursor-pointer rounded-lg px-4 py-2 font-semibold"
    >
      <LogOut />
    </button>
  );
};
