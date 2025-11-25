import { useState } from 'react';
import Modal from '../../../components/AdminPanel/Modal';
import { initialClients } from '../../../utils/staticData/staticData';
import ClientForm from './ClientForm';
import ClientsTable, { type Client, type ClientWithIndex } from './ClientsTable';

const MyClients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingClient, setEditingClient] = useState<ClientWithIndex | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchCompany, setSearchCompany] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSaveEdit = () => {
    if (!editingClient) return;

    const updatedClients = [...clients];
    updatedClients[editingClient.index] = {
      name: editingClient.name,
      poc: editingClient.poc,
      email: editingClient.email,
      postLimit: editingClient.postLimit,
      expiredDate: editingClient.expiredDate,
    };
    setClients(updatedClients);
    setEditingClient(null);
  };

  const handleAddClient = (newClient: Client) => {
    setClients([...clients, newClient]);
    setShowAddModal(false);
  };

  const handleSearch = () => {};

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

        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-14 flex items-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
          >
            Add Client
          </button>
        </div>
      </div>

      <ClientsTable setEditingClient={setEditingClient} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Edit Modal */}
      {editingClient && (
        <Modal onClose={() => setEditingClient(null)}>
          <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
            Edit Client
          </h3>
          <ClientForm
            client={editingClient}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingClient(null)}
            submitLabel="Save Changes"
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
              name: '',
              poc: '',
              email: '',
              postLimit: '',
              expiredDate: '',
            }}
            onSubmit={handleAddClient}
            onCancel={() => setShowAddModal(false)}
            submitLabel="Add Client"
          />
        </Modal>
      )}
    </div>
  );
};

export default MyClients;
