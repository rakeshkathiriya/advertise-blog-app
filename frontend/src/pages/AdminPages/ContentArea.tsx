import { memo } from 'react';
import MyClients from './ClientSection/MyClients';

function ContentArea({ activeMenu }: { activeMenu: string }) {
  return (
    <div className="flex-1 p-6">
      {activeMenu === 'Articles' && <div>Articles Content</div>}
      {activeMenu === 'My Clients' && <MyClients />}
      {activeMenu === 'Users' && <div>Users Content</div>}
      {activeMenu === 'Logout' && <div>Logout Content</div>}
    </div>
  );
}

export default memo(ContentArea);
