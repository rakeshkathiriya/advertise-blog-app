import { useCallback, useEffect, useState } from 'react';
import HeaderSection from '../../../components/AdminPanel/HeaderSection';
import Modal from '../../../components/AdminPanel/Modal';
import Tabs from '../../../components/AdminPanel/Tabs';
import { userSection } from '../../../utils/staticData/staticData';
import type { UserDetails } from '../../../utils/types/users';
import ForEverSubscriptionUsersTable from './ForEverSubscriptionUsersTable';
import UserForm from './UserForm';
import UsersTable from './UsersTable';

const MyUsers = () => {
  const [activeTab, setActiveTab] = useState('subscribe_users');
  const [editingUser, setEditingUser] = useState<UserDetails | null>(null);
  const [searchUser, setSearchUser] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [canRefresh, setCanRefresh] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<{ email: string; isSubscribed: string } | null>(null);

  const handleSearch = useCallback(() => {
    setSearchFilter({ email: searchUser, isSubscribed: statusFilter });
  }, [searchUser, statusFilter]);

  useEffect(() => {
    setCanRefresh(false);
    setSearchFilter(null);
  }, [activeTab]);

  return (
    <>
      <HeaderSection title={userSection.title} subTitle={userSection.subTitle} />
      <div className="h-full w-full space-y-4">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Search and Filter Section */}
        {activeTab === 'subscribe_users' && (
          <>
            {/* SEARCH SECTION */}
            <div className="2md:flex-row 2md:items-center 2md:justify-between flex flex-col gap-4">
              {/* LEFT SIDE: Search + Filters */}
              <div className="2md:flex-row 2md:items-center flex w-full flex-col items-start gap-2">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search by Email"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="focus:ring-textColor 2md:w-[200px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:outline-none"
                />

                {/* Status Filter */}
                <div className="2md:w-auto flex w-full items-center gap-2">
                  <label className="text-textSecondary text-sm font-semibold">Status:</label>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="2md:w-[140px] border-borderMedium text-textSecondary focus:ring-borderMedium w-full rounded-lg border px-2 py-2 text-sm font-semibold focus:ring-2"
                  >
                    <option value="all">All</option>
                    <option value="true">Subscribe</option>
                    <option value="false">UnSubscribe</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="2md:w-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>

            {/* TABLE */}
            <UsersTable
              setEditingUser={setEditingUser}
              canRefresh={canRefresh}
              setCanRefresh={setCanRefresh}
              searchFilter={searchFilter}
            />
          </>
        )}

        {/* Search and Filter Section */}
        {activeTab === 'forever_subscribe_users' && (
          <>
            <div className="2md:flex-row 2md:items-center 2md:justify-between flex flex-col gap-4">
              {/* LEFT SIDE: Search Input */}
              <div className="2md:flex-row 2md:items-center flex w-full flex-col items-start gap-2">
                <input
                  type="text"
                  placeholder="Search by Email"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="focus:ring-textColor 2md:w-[200px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:outline-none"
                />

                <button
                  onClick={handleSearch}
                  className="2md:w-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>

            <ForEverSubscriptionUsersTable
              setEditingUser={setEditingUser}
              canRefresh={canRefresh}
              setCanRefresh={setCanRefresh}
              searchFilter={searchFilter}
            />
          </>
        )}

        {/* Edit Modal */}
        {editingUser && (
          <Modal onClose={() => setEditingUser(null)}>
            <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
              Edit User
            </h3>
            <UserForm
              user={editingUser}
              onCancel={() => setEditingUser(null)}
              submitLabel="Update"
              setCanRefresh={setCanRefresh}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default MyUsers;
