import { useState } from 'react';
import Modal from '../../../components/AdminPanel/Modal';
import ForEverSubscriptionUsersTable from './ForEverSubscriptionUsersTable';
import UserForm from './UserForm';
import UsersTable, { type UserWithIndex } from './UsersTable';

const MyUsers = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingUser, setEditingUser] = useState<UserWithIndex | null>(null);
  const [searchUser, setSearchUser] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSaveEdit = () => {
    if (!editingUser) return;

    setEditingUser(null);
  };

  const handleSearch = () => {};

  return (
    <div className="h-full w-full space-y-4">
      <div className="">
        <h2 className="mb-2 text-2xl font-bold text-[#3a4b66] italic underline underline-offset-8">User Management</h2>
        <p className="text-sm text-[#3a4b66]">
          Manage your user subscriptions and track expiration dates. Monitor active subscriptions, view remaining days.
          Double-click on any row to edit user details.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by userName..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[#3a4b66]">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-1 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="text-14 flex items-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
          >
            Search
          </button>
        </div>
      </div>

      <UsersTable setEditingClient={setEditingUser} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Search and Filter Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by userName..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[#3a4b66]">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-1 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="text-14 flex items-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
          >
            Search
          </button>
        </div>
      </div>
      <ForEverSubscriptionUsersTable
        setEditingClient={setEditingUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Edit Modal */}
      {editingUser && (
        <Modal onClose={() => setEditingUser(null)}>
          <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
            Edit User
          </h3>
          <UserForm
            user={editingUser}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingUser(null)}
            submitLabel="Update"
          />
        </Modal>
      )}
    </div>
  );
};

export default MyUsers;
