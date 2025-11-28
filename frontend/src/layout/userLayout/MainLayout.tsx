import React from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

const MainLayout: React.FC = () => {
  return (
    <div className="bg-bgPrimary/30 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      <Header />
      <section className="flex w-full flex-col items-center justify-center">
        <Outlet />
      </section>
      <Footer />
    </div>
  );
};

export default MainLayout;
