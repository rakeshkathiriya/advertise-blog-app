import { Link } from 'react-router-dom';

export const AdminButton = () => {
  return (
    <Link to={'/aba-admin'}>
      <button className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-700 disabled:opacity-50">
        AdminPanel
      </button>
    </Link>
  );
};
