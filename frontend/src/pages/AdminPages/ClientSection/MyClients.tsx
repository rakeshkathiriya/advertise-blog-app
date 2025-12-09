import { Plus, Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import HeaderSection from '../../../components/AdminPanel/HeaderSection';
import { clientSection } from '../../../utils/staticData/staticData';
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
    <>
      <HeaderSection title={clientSection.title} subTitle={clientSection.subTitle} />
      <div className="h-full w-full">
        {/* Search and Filter Section */}
        <div className="2md:flex-row 2md:items-center 2md:justify-between mb-4 flex flex-col gap-2">
          {/* LEFT SIDE: Search + Filter */}
          <div className="2md:flex-row 2md:items-center flex w-full flex-col items-start gap-2">
            {/* Company Name Input */}
            <input
              type="text"
              placeholder="Company Name"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              className="focus:ring-textColor 2md:w-[200px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:outline-none"
            />

            {/* Status Filter */}
            <label className="text-textColor text-sm font-semibold">Status:</label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="focus:ring-textColor 2md:w-[130px] w-full rounded-lg border border-gray-300 px-2 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Inactive</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="text-textColor 2md:w-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide transition-all duration-500 ease-in-out hover:scale-105"
            >
              <Search />
            </button>
          </div>

          {/* RIGHT SIDE: Add Client */}
          <div className="2md:min-w-[100px] flex w-full justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="text-textColor 2md:w-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide transition-all duration-500 ease-in-out hover:scale-105"
            >
              <Plus className="lg:hidden" />
              <span className="hidden lg:inline">Add Client</span>
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
    </>
  );
};

export default MyClients;
