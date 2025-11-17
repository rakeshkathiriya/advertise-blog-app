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

        // Clear redux-persist
        globalThis.localStorage?.removeItem('persist:auth');
        localStorage.removeItem('accessToken');
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
      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 disabled:opacity-50"
    >
      {logoutPending ? 'Logging out...' : 'Logout'}
    </button>
  );
};
