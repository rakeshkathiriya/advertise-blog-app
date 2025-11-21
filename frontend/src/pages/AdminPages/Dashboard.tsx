import { useState } from 'react';

interface Client {
  name: string;
  poc: string;
  email: string;
  postLimit: string;
  expiredDate: string;
}

interface ClientWithIndex extends Client {
  index: number;
}

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState<string>('Articles');

  return (
    <div className="flex h-full w-full bg-white">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <ContentArea activeMenu={activeMenu} />
    </div>
  );
};

export default Dashboard;

function Sidebar({
  activeMenu,
  setActiveMenu,
}: {
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <nav className="flex h-screen w-64 flex-col justify-between bg-[#d8e1e8] p-6">
      {/* Logo */}
      <div>
        <div className="mb-8 flex items-center justify-center gap-2">
          <h1 className="text-xl font-semibold text-[#3a4b66] underline underline-offset-8">Logo</h1>
        </div>

        {/* Menu */}
        <ul className="space-y-1">
          {sidebarMenu.map((menu) => (
            <li
              key={menu.name}
              className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 text-[14px] font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:bg-[#aec2d1] ${
                activeMenu === menu.name ? 'bg-[#aec2d1]' : ''
              }`}
              onClick={() => setActiveMenu(menu.name)}
            >
              <span>{menu.icon}</span>
              {menu.name}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

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

const MyClients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingClient, setEditingClient] = useState<ClientWithIndex | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchCompany, setSearchCompany] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [appliedSearchCompany, setAppliedSearchCompany] = useState<string>('');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string>('all');
  const itemsPerPage = 10;

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const getStatus = (expiredDate: string): 'Active' | 'Inactive' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = parseDate(expiredDate);
    return expired > today ? 'Active' : 'Inactive';
  };

  const getRemainingDays = (expiredDate: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = parseDate(expiredDate);
    if (expired > today) {
      const diffTime = expired.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    return '-';
  };

  const handleDelete = (idx: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter((_, i) => i !== idx));
    }
  };

  const handleRowDoubleClick = (client: Client, idx: number) => {
    setEditingClient({ ...client, index: idx });
  };

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

  // Filter clients based on search and status
  const filteredClients = clients.filter((client) => {
    const matchesCompany = client.name.toLowerCase().includes(appliedSearchCompany.toLowerCase());
    const status = getStatus(client.expiredDate);
    const matchesStatus =
      appliedStatusFilter === 'all' ||
      (appliedStatusFilter === 'active' && status === 'Active') ||
      (appliedStatusFilter === 'inactive' && status === 'Inactive');
    return matchesCompany && matchesStatus;
  });

  const handleSearch = () => {
    setAppliedSearchCompany(searchCompany);
    setAppliedStatusFilter(statusFilter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentClients = filteredClients.slice(startIdx, endIdx);

  return (
    <div className="h-full w-full">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-[#3a4b66] italic underline underline-offset-8">
          Client Management
        </h2>
        <p className="text-sm text-[#3a4b66]">
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

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-2xl">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="rounded-lg bg-[#aec2d1] text-left">
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="px-3 py-2 text-base font-semibold tracking-wide whitespace-nowrap text-[#3a4b66]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentClients.map((client, idx) => {
              const actualIdx = startIdx + idx;
              const status = getStatus(client.expiredDate);
              const remainingDays = getRemainingDays(client.expiredDate);

              return (
                <tr
                  key={actualIdx}
                  className="cursor-pointer text-gray-900 transition-colors hover:bg-gray-50"
                  onDoubleClick={() => handleRowDoubleClick(client, actualIdx)}
                >
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap text-[#3a4b66]">
                    {client.name}
                  </td>
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap text-[#3a4b66]">
                    {client.poc}
                  </td>
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap text-[#3a4b66]">
                    {client.email}
                  </td>
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap text-[#3a4b66]">
                    {client.postLimit}
                  </td>
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap text-[#3a4b66]">
                    {client.expiredDate}
                  </td>
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap text-[#3a4b66]">
                    {remainingDays}
                  </td>
                  <td className="px-3 py-2 text-[14px] font-semibold tracking-wide whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(actualIdx);
                        setCurrentPage(1);
                      }}
                      className="text-red-600 transition-colors hover:text-red-800"
                      title="Delete client"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm font-semibold tracking-wide text-[#3a4b66]">
          Showing {filteredClients.length > 0 ? startIdx + 1 : 0} to {Math.min(endIdx, filteredClients.length)} of
          &nbsp; {filteredClients.length} clients
        </p>
        <div className="inline-flex gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`min-w-5 rounded-lg px-3 py-1 text-[14px] font-semibold tracking-wide text-[#3a4b66] hover:bg-[#aec2d1] ${
              currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.5 9.8125H4.15625L9.46875 4.40625C9.75 4.125 9.75 3.6875 9.46875 3.40625C9.1875 3.125 8.75 3.125 8.46875 3.40625L2 9.96875C1.71875 10.25 1.71875 10.6875 2 10.9688L8.46875 17.5312C8.59375 17.6562 8.78125 17.75 8.96875 17.75C9.15625 17.75 9.3125 17.6875 9.46875 17.5625C9.75 17.2812 9.75 16.8438 9.46875 16.5625L4.1875 11.2188H17.5C17.875 11.2188 18.1875 10.9062 18.1875 10.5312C18.1875 10.125 17.875 9.8125 17.5 9.8125Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-full px-2.5 py-1 text-[14px] font-semibold tracking-wide text-[#3a4b66] hover:bg-[#aec2d1] ${
                currentPage === i + 1 ? 'cursor-not-allowed bg-[#aec2d1]' : 'cursor-pointer text-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`min-w-5 rounded-lg px-3 py-1 text-[14px] font-semibold tracking-wide text-[#3a4b66] hover:bg-[#aec2d1] ${
              currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 10L11.5312 3.4375C11.25 3.15625 10.8125 3.15625 10.5312 3.4375C10.25 3.71875 10.25 4.15625 10.5312 4.4375L15.7812 9.78125H2.5C2.125 9.78125 1.8125 10.0937 1.8125 10.4688C1.8125 10.8438 2.125 11.1875 2.5 11.1875H15.8437L10.5312 16.5938C10.25 16.875 10.25 17.3125 10.5312 17.5938C10.6562 17.7188 10.8437 17.7812 11.0312 17.7812C11.2187 17.7812 11.4062 17.7188 11.5312 17.5625L18 11C18.2812 10.7187 18.2812 10.2812 18 10Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingClient && (
        <Modal onClose={() => setEditingClient(null)}>
          <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
            Edit Client
          </h3>
          <ClientForm
            client={editingClient}
            onChange={setEditingClient}
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
            onChange={() => {}}
            onSubmit={handleAddClient}
            onCancel={() => setShowAddModal(false)}
            submitLabel="Add Client"
          />
        </Modal>
      )}
    </div>
  );
};

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6">
      <button onClick={onClose} className="absolute top-4 right-4 font-bold text-[#3a4b66] hover:text-gray-700">
        X
      </button>
      {children}
    </div>
  </div>
);

interface ClientFormProps {
  client: Client | ClientWithIndex;
  onChange: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
  submitLabel: string;
}

const ClientForm = ({ client, onChange, onSubmit, onCancel, submitLabel }: ClientFormProps) => {
  const [formData, setFormData] = useState<Client>({
    name: client.name,
    poc: client.poc,
    email: client.email,
    postLimit: client.postLimit,
    expiredDate: client.expiredDate,
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Company Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">POC</label>
        <input
          type="text"
          value={formData.poc}
          onChange={(e) => setFormData({ ...formData, poc: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Post Limit</label>
        <input
          type="text"
          value={formData.postLimit}
          onChange={(e) => setFormData({ ...formData, postLimit: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Expiration Date (DD/MM/YYYY)</label>
        <input
          type="date"
          value={formData.expiredDate.split('/').reverse().join('-')}
          onChange={(e) => setFormData({ ...formData, expiredDate: e.target.value.split('-').reverse().join('/') })}
          placeholder="31/12/2025"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          className="text-14 flex flex-1 items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
        >
          {submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="text-14 flex flex-1 items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

import React from 'react';

interface SidebarMenuItem {
  name: string;
  icon: string;
}

const sidebarMenu: SidebarMenuItem[] = [
  { name: 'Articles', icon: '📄' },
  { name: 'My Clients', icon: '👥' },
  { name: 'Users', icon: '🧑' },
  { name: 'Logout', icon: '🔒 ' },
];

const initialClients: Client[] = [
  {
    name: 'Nandor the Relentless',
    poc: 'User 1',
    email: 'user1@mail.com',
    postLimit: '2',
    expiredDate: '12/12/2023',
  },
  {
    name: 'Marceline Nightshade',
    poc: 'User 2',
    email: 'user2@mail.com',
    postLimit: '4',
    expiredDate: '05/01/2024',
  },
  {
    name: 'Victor Stormborn',
    poc: 'User 3',
    email: 'user3@mail.com',
    postLimit: '2',
    expiredDate: '18/02/2024',
  },
  {
    name: 'Selena Darkwood',
    poc: 'User 4',
    email: 'user4@mail.com',
    postLimit: '6',
    expiredDate: '27/03/2024',
  },
  {
    name: 'Leo Firecrest',
    poc: 'User 5',
    email: 'user5@mail.com',
    postLimit: '3',
    expiredDate: '10/04/2024',
  },
  {
    name: 'Elara Moonfall',
    poc: 'User 6',
    email: 'user6@mail.com',
    postLimit: '1',
    expiredDate: '29/04/2024',
  },
  {
    name: 'Corvin Blackthorn',
    poc: 'User 7',
    email: 'user7@mail.com',
    postLimit: '8',
    expiredDate: '15/05/2026',
  },
  {
    name: 'Isabella Ravensong',
    poc: 'User 8',
    email: 'user8@mail.com',
    postLimit: '5',
    expiredDate: '02/06/2026',
  },
  {
    name: 'Damien Frostborn',
    poc: 'User 9',
    email: 'user9@mail.com',
    postLimit: '3',
    expiredDate: '19/06/2026',
  },
  {
    name: 'Lyra Starcrest',
    poc: 'User 10',
    email: 'user10@mail.com',
    postLimit: '2',
    expiredDate: '30/06/2024',
  },
];

const tableHead: string[] = [
  'Client Company Name',
  'Client POC',
  'Client Email',
  'Post Limit',
  'S.Expired Date',
  'Status',
  'Remaining Days',
  'Actions',
];
