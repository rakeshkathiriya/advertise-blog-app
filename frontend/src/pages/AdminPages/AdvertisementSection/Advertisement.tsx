import { Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import HeaderSection from '../../../components/AdminPanel/HeaderSection';
import DeletePopup from '../../../components/common/DeletePopup';
import { Spinner } from '../../../components/common/Spinner';
import { useDeleteAdvertise, useGetAllAdvertise } from '../../../queries/adminPanel/advertise.query';
import { advertiseSection } from '../../../utils/staticData/staticData';
import AdvertisementForm from './AdvertisementForm';
// <--- ADD THIS IMPORT

function Advertisement() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchCompany, setSearchCompany] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<{ name: string } | null>(null);

  const { mutate: deleteMutation, isPending: deletePending } = useDeleteAdvertise();
  // const { data: adResponse, isLoading, isError, refetch } = useGetAllAdvertise();

  const {
    data: adResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllAdvertise({
    name: searchFilter?.name ?? '',
  });

  const handleSearch = useCallback(() => {
    setSearchFilter({ name: searchCompany });
  }, [searchCompany]);

  const handleFinalDelete = useCallback(() => {
    if (!selectedPostId) return;

    deleteMutation(selectedPostId, {
      onSuccess: (data) => {
        if (data.status) {
          toast.success(data.message ?? 'Advertisement deleted successfully');
          refetch(); // Refresh list
          setShowDeletePopup(false); // Close popup AFTER success
          setSelectedPostId(null); // Reset selection
        } else {
          toast.error(data.message ?? 'Delete failed');
        }
      },
      onError: (error) => {
        toast.error(error?.message ?? 'Something went wrong');
      },
    });
  }, [selectedPostId, deleteMutation, refetch]);

  return (
    <>
      {/* ===== HEADER ===== */}
      <HeaderSection title={advertiseSection.title} subTitle={advertiseSection.subTitle} />

      {/* Search and Filter Section */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            placeholder="Search by companyName..."
            className="focus:ring-textColor flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:outline-none"
          />
          <button
            className="text-14 text-textColor flex items-center gap-2 rounded-full bg-[#aec2d1] px-6 py-2 font-semibold tracking-wide transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
            onClick={handleSearch}
          >
            <Search className="size-5" />
          </button>
        </div>

        {/* ===== ADD BUTTON ===== */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex cursor-pointer items-center rounded-full bg-[#aec2d1] px-4 py-2 text-base font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
          >
            <Plus className="lg:hidden" />
            <span className="hidden lg:inline">Create Advertisement</span>
          </button>
        </div>
      </div>

      {/* ===== GRID OF POSTS ===== */}
      <div className="mt-12 grid w-full max-w-7xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:mx-auto xl:grid-cols-4">
        {/* Loading */}
        {isLoading && (
          <div className="col-span-full text-center text-lg font-semibold text-gray-600">
            <Spinner className="bg-transparent! backdrop-blur-none!" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="col-span-full text-center text-lg font-semibold text-red-500">Failed to load posts</div>
        )}

        {/* Empty */}
        {!isLoading && !isError && (adResponse?.data ?? []).length === 0 && (
          <div className="col-span-full text-center text-lg font-semibold text-gray-500">No posts found</div>
        )}

        {/* Cards */}
        {(adResponse?.data ?? []).map((post) => (
          <div
            key={post._id}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={post.image}
                alt={post.client?.name}
                className="h-72 w-full rounded-t-3xl object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Delete Icon */}
              <button
                onClick={() => {
                  setSelectedPostId(post._id);
                  setShowDeletePopup(true);
                }}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md backdrop-blur-md transition hover:scale-110 hover:bg-red-700 hover:shadow-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-5">
              <h1 className="mb-1 text-lg font-bold tracking-wide text-gray-900">{post.client?.name}</h1>

              <p className="line-clamp-2 text-sm text-gray-500">
                {(post.description || 'No description available.').slice(0, 25) + '....'}
              </p>

              {/* Bottom Glow Line */}
              <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-linear-to-r from-transparent via-red-500/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== ADD ADVERTISEMENT MODAL ===== */}
      {showAddModal && <AdvertisementForm onCancel={() => setShowAddModal(false)} refetchData={refetch} />}

      {showDeletePopup && (
        <DeletePopup
          onConfirm={handleFinalDelete}
          onCancel={() => {
            setShowAddModal(false);
            setShowDeletePopup(false);
            setSelectedPostId(null);
          }}
          loading={deletePending}
        />
      )}
    </>
  );
}

export default Advertisement;
