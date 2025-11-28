import React from 'react';
import { AdminButton } from '../../components/common/AdminButton';
import { LogoutButton } from '../../components/common/LogoutButton';
import { getUserRole } from '../../utils/helper';

export const Header: React.FC = () => {
  const role = getUserRole();

  return (
    <div className="header_container w-full">
      <div className="bg-bgDefault py-1.5 text-center font-medium">
        {/* <div className="from-orange to-orangeLight bg-linear-to-r py-1.5 text-center font-medium"> */}
        <p className="text-bgPrimaryDark text-[13px] font-semibold tracking-wide">
          Exclusive Price Drop! Hurry, <span className="underline underline-offset-4">Offer Ends Soon!</span>
        </p>
      </div>
      <header className="text-textWhite from-bgPrimaryDark to-bgPrimary flex w-full items-center justify-center bg-linear-to-r transition-all">
        <nav className="container flex w-full items-center justify-between px-4 py-1">
          <h1 className="text-textTitleSecondary cursor-pointer text-lg font-semibold tracking-wide">Logo</h1>

          <ul>
            <li className="group mx-4 inline-block cursor-pointer text-base font-semibold tracking-wide">
              Advertisement
              <div className={`bg-bgDefault h-0.5 w-0 transition-all duration-300 group-hover:w-full`} />
            </li>
            <li className="group mx-4 inline-block cursor-pointer text-base font-semibold tracking-wide">
              Blogs
              <div className={`bg-bgDefault h-0.5 w-0 transition-all duration-300 group-hover:w-full`} />
            </li>
          </ul>

          <div className="flex gap-5">
            {/* Show AdminButton only for Admin */}
            {role === 'Admin' && <AdminButton />}
            <LogoutButton />
          </div>
        </nav>
      </header>
    </div>
  );
};
