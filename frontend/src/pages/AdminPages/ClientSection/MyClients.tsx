import { useCallback, useState } from 'react';
import type { ClientDetails } from '../../../utils/types/clients';
import ClientForm from './ClientForm';
import ClientsTable from './ClientsTable';

const MyClients = () => {
  const [editingClient, setEditingClient] = useState<ClientDetails | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [canRefresh, setCanRefresh] = useState<boolean>(false);
  const [searchCompany, setSearchCompany] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<{ name: string; status: string } | null>(null);

  const handleSearch = useCallback(() => {
    setSearchFilter({ name: searchCompany, status: statusFilter });
  }, [searchCompany, statusFilter]);

  return (
    <div className="h-full w-full">
      <div className="mx-auto mb-6">
        <h2 className="text-textColor/90 mb-2 text-center text-2xl font-bold italic underline underline-offset-8">
          Client Management
        </h2>
        <p className="text-textColor/70 mx-auto max-w-3xl text-center text-sm font-semibold">
          Manage your client subscriptions and track expiration dates. Monitor active subscriptions, view remaining
          days, and maintain up-to-date client information. Double-click on any row to edit client details.
        </p>
      </div>
      {/* Search and Filter Section */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by companyName..."
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="focus:ring-textColor flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="text-textColor text-sm font-semibold">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              className="focus:ring-textColor rounded-lg border border-gray-300 px-1 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Inactive</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="text-14 text-textColor flex items-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
          >
            Search
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-14 text-textColor flex items-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
          >
            Add Client
          </button>
        </div>
      </div>
      <ClientsTable
        canRefresh={canRefresh}
        setCanRefresh={setCanRefresh}
        setEditingClient={setEditingClient}
        searchFilter={searchFilter}
      />
      {editingClient && (
        <ClientForm
          client={editingClient}
          onCancel={() => setEditingClient(null)}
          submitLabel="Update"
          setCanRefresh={setCanRefresh}
        />
      )}
      {/* Add Modal */}
      {showAddModal && (
        <ClientForm
          client={{
            _id: '',
            name: '',
            poc: '',
            email: '',
            postLimit: 0,
            expiredDate: '',
            contact: '',
            posts: [],
          }}
          onCancel={() => setShowAddModal(false)}
          setCanRefresh={setCanRefresh}
          submitLabel="Save"
        />
      )}
    </div>
  );
};

export default MyClients;
