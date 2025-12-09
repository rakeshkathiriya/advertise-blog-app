import { Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
  const [showSideBar, setShowSideBar] = useState<boolean>(true);
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
    } else if (activeMenu === 'Go to Advertise') {
      navigate('/');
    }
  }, [activeMenu]);

  return (
    <>
      <nav
        className={`${
          showSideBar
            ? 'fixed h-full translate-x-0 md:translate-x-0'
            : 'fixed h-full -translate-x-full md:fixed md:translate-x-0'
        } fixed z-9999 flex h-full w-64 flex-col justify-between bg-[#d8e1e8] p-6 transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div>
          <div className="mb-8 flex items-center justify-between gap-2 md:justify-center">
            <h1 className="text-xl font-semibold text-[#3a4b66] underline underline-offset-8">Logo</h1>
            <div
              onClick={() => {
                setShowSideBar(false);
              }}
              className="md:hidden"
            >
              <X />
            </div>
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
      <div
        onClick={() => {
          setShowSideBar(true);
        }}
        className="z-50 md:hidden"
      >
        {showSideBar ? (
          <div> </div>
        ) : (
          <div className="absolute top-5 left-5 border">
            {' '}
            <Menu />
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
