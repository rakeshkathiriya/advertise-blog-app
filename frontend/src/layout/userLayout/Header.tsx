import { Menu, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import { AdminButton } from '../../components/common/AdminButton';
import { LogoutButton } from '../../components/common/LogoutButton';
import { useAppSelector } from '../../store/hooks';
import { getUserRole } from '../../utils/helper';

export const Header: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const role = getUserRole();
  const logInUser = useAppSelector((state) => state.auth);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowMenu(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setShowDropdown(false);
  };

  return (
    <div className="header_container w-full">
      <div className="bg-bgDefault py-1.5 text-center font-medium">
        {/* <div className="from-orange to-orangeLight bg-linear-to-r py-1.5 text-center font-medium"> */}
        <p className="text-textSecondary ml-auto text-xs font-semibold tracking-wide md:text-sm">
          Exclusive Price Drop! Hurry, <span className="underline underline-offset-4">Offer Ends Soon!</span>
        </p>
      </div>
      <header className="text-textWhite from-bgPrimaryDark to-bgPrimary flex w-full items-center justify-center bg-linear-to-r transition-all">
        <nav className="container flex w-full items-center justify-between px-4 py-3">
          <h1 className="text-textTitleSecondary cursor-pointer text-lg font-semibold tracking-wide">Logo</h1>
          <ul className="hidden md:flex">
            <NavLink
              to="/"
              className={({}) => `group mx-4 inline-block cursor-pointer text-base font-semibold tracking-wide`}
            >
              {({ isActive }) => (
                <li className="inline-block">
                  Advertisement
                  <div
                    className={`bg-bgDefault h-0.5 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'} `}
                  />
                </li>
              )}
            </NavLink>

            <NavLink
              to="/blog"
              className={({}) => `group mx-4 inline-block cursor-pointer text-base font-semibold tracking-wide`}
            >
              {({ isActive }) => (
                <li className="inline-block">
                  Blogs
                  <div
                    className={`bg-bgDefault h-0.5 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'} `}
                  />
                </li>
              )}
            </NavLink>
          </ul>
          <div className="flex flex-row items-center justify-center">
            <div className="flex gap-5">{role === 'Admin' && <AdminButton />}</div>

            <div className="relative cursor-pointer">
              <div className="flex items-center justify-between space-x-5 px-4">
                <div
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                  }}
                  className="cursor-pointer"
                >
                  <User />
                </div>
              </div>

              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="animate-fadeIn absolute top-12 right-0 z-50 flex min-w-48 flex-col rounded-2xl border border-white/10 bg-white/80 py-2 shadow-2xl backdrop-blur-xl"
                >
                  <div className="hover:bg-bgPrimary/20 hover:text-bgPrimaryDark text-bgPrimaryDark w-full rounded-xl px-4 py-4 text-start font-semibold transition-all duration-200">
                    <span>Welcome,&nbsp;&nbsp;</span>
                    {logInUser.user?.firstname}
                  </div>
                  {/* Change Password */}
                  {logInUser.user?.loginType !== 'facebook' && (
                    <div
                      onClick={() => {
                        handleClose();
                        setShowChangePasswordModal(!showChangePasswordModal);
                      }}
                      className="hover:bg-bgPrimary/20 hover:text-bgPrimaryDark text-bgPrimaryDark w-full rounded-xl px-4 py-4 text-start font-semibold transition-all duration-200"
                    >
                      Change Password
                    </div>
                  )}

                  {/* Divider */}
                  <div className="mx-3 my-1 h-px bg-gray-300/50"></div>

                  {/* Logout */}
                  <div className="rounded-xl px-4 py-2 font-semibold transition-all duration-200 hover:bg-red-100 hover:text-red-600">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>

            <div
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              className="cursor-pointer md:hidden"
            >
              {showMenu ? (
                <div>
                  {' '}
                  <X />
                </div>
              ) : (
                <div>
                  {' '}
                  <Menu />
                </div>
              )}
            </div>
          </div>
        </nav>
        {/* Mobile Menu */}{' '}
        <div
          className={`${
            showMenu ? 'max-h-90 py-4' : 'max-h-0 py-0'
          } from-bgPrimaryDark to-bgPrimary absolute top-20 left-0 z-999 w-full overflow-hidden bg-linear-to-r text-center transition-all duration-300 ease-in-out md:hidden`}
        >
          <hr className="mx-auto my-2 size-2 w-[90%] text-white/30" />
          <ul ref={menuRef}>
            <NavLink
              to="/"
              className={({}) => `group block w-full py-2 text-base font-semibold tracking-wide`}
              onClick={() => setShowMenu(false)}
            >
              {({ isActive }) => (
                <li className="inline-block">
                  Advertisement
                  <div
                    className={`bg-bgDefault h-0.5 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    } `}
                  />
                </li>
              )}
            </NavLink>

            <NavLink
              to="/blog"
              className={({}) => `group block w-full py-2 text-base font-semibold tracking-wide`}
              onClick={() => setShowMenu(false)}
            >
              {({ isActive }) => (
                <li className="inline-block">
                  Blog
                  <div
                    className={`bg-bgDefault h-0.5 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    } `}
                  />
                </li>
              )}
            </NavLink>
          </ul>
        </div>
      </header>

      {showChangePasswordModal && <ChangePasswordForm onCancel={() => setShowChangePasswordModal(false)} />}
    </div>
  );
};
