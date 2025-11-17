import React from 'react';
import { LogoutButton } from '../../components/common/LogoutButton';
import { getUserRole } from '../../utils/helper';

export const Header: React.FC = () => {
  // Get user role from token or context if needed
  const role = getUserRole();

  return (
    <header className="flex w-screen items-center justify-between overflow-hidden! bg-blue-400 p-4 text-white">
      <h1 className="text-2xl font-bold">{role} Dashboard</h1>

      <div>
        {/* Additional header content can go here */}
        <ul>
          <li className="mx-4 inline-block text-xl font-bold underline-offset-8 hover:underline">Blog</li>
        </ul>
      </div>

      <LogoutButton />
    </header>
  );
};
