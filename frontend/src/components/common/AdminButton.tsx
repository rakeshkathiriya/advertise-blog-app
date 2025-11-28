import { ShieldUser } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminButton = () => {
  return (
    <Link to={'/aba-admin'}>
      <button title="Go To Admin Panel" className="text-textWhite cursor-pointer rounded-lg px-4 py-2 font-semibold">
        <ShieldUser />
      </button>
    </Link>
  );
};
