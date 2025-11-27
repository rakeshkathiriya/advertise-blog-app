import React from 'react';
import { AdminButton } from '../../components/common/AdminButton';
import { LogoutButton } from '../../components/common/LogoutButton';
import { getUserRole } from '../../utils/helper';

export const Header: React.FC = () => {
  const role = getUserRole();

  return (
    <header className="flex w-screen items-center justify-between bg-blue-400 p-4 text-white">
      <h1 className="text-2xl font-bold">{`${role} Dashboard`}</h1>

      <div>
        <ul>
          <li className="mx-4 inline-block text-xl font-bold underline-offset-8 hover:underline">Blog</li>
        </ul>
      </div>

      <div className="flex gap-5">
        {/* Show AdminButton only for Admin */}
        {role === 'Admin' && <AdminButton />}

        <LogoutButton />
      </div>
    </header>
  );
};
