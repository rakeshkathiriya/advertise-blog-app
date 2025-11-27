import { useCallback, useState } from 'react';
import Modal from '../../../components/AdminPanel/Modal';
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
        <h2 className="mb-2 text-center text-2xl font-bold text-[#3a4b66]/90 italic underline underline-offset-8">
          Client Management
        </h2>
        <p className="mx-auto max-w-3xl text-center text-sm font-semibold text-[#3a4b66]/70">
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
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[#3a4b66]">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              className="rounded-lg border border-gray-300 px-1 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Inactive</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="text-14 flex items-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
          >
            Search
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-14 flex items-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
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

      {/* Edit Modal */}
      {editingClient && (
        <Modal onClose={() => setEditingClient(null)}>
          <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
            Edit Client
          </h3>
          <ClientForm
            client={editingClient}
            onCancel={() => setEditingClient(null)}
            submitLabel="Update"
            setCanRefresh={setCanRefresh}
          />
        </Modal>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
            Add New Client
          </h3>
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
        </Modal>
      )}
    </div>
  );
};

export default MyClients;
