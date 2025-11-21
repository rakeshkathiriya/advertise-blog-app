import { memo } from 'react';
import Advertisement from './AdvertisementSection/Advertisement';
import MyClients from './ClientSection/MyClients';
import MyUsers from './UserSection/MyUsers';

function ContentArea({ activeMenu }: { activeMenu: string }) {
  return (
    <div className="flex-1 p-6">
      {activeMenu === 'Advertisement' && <Advertisement />}
      {activeMenu === 'My Clients' && <MyClients />}
      {activeMenu === 'Users' && <MyUsers />}
      {activeMenu === 'Logout'}
    </div>
  );
}

export default memo(ContentArea);
