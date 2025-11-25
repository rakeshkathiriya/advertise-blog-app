import { useState } from 'react';
import ContentArea from './ContentArea';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState<string>('Advertisement');

  return (
    <div className="flex h-full w-full bg-white">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <ContentArea activeMenu={activeMenu} />
    </div>
  );
};

export default Dashboard;
