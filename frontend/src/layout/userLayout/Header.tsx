import React from 'react';
import { LogoutButton } from '../../components/common/LogoutButton';
import { getUserRole } from '../../utils/helper';

export const Header: React.FC = () => {
  // Get user role from token or context if needed
  const role = getUserRole();

  return (
    <header className="flex items-center justify-between bg-blue-600 p-4 text-white">
      <h1 className="text-2xl font-bold">{role} Dashboard</h1>
      <LogoutButton />
    </header>
  );
};
