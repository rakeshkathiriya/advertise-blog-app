import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserLogout } from '../../queries/auth.query';
import { logoutUser } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { sidebarMenu } from '../../utils/staticData/staticData';

function Sidebar({
  activeMenu,
  setActiveMenu,
}: {
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: logoutMutate } = useUserLogout();

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

  useEffect(() => {
    if (activeMenu === 'Logout') {
      handleLogout();
    }
  }, [activeMenu]);

  return (
    <nav className="flex h-auto w-64 flex-col justify-between bg-[#d8e1e8] p-6">
      {/* Logo */}
      <div>
        <div className="mb-8 flex items-center justify-center gap-2">
          <h1 className="text-xl font-semibold text-[#3a4b66] underline underline-offset-8">Logo</h1>
        </div>

        {/* Menu */}
        <ul className="space-y-1">
          {sidebarMenu.map((menu) => (
            <li
              key={menu.name}
              className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 text-[14px] font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:bg-[#aec2d1] ${
                activeMenu === menu.name ? 'bg-[#aec2d1]' : ''
              }`}
              onClick={() => setActiveMenu(menu.name)}
            >
              <span>{menu.icon}</span>
              {menu.name}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
