import { Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../../components/AdminPanel/Modal';
import DeletePopup from '../../../components/common/DeletePopup';
import { useDeleteAdvertise, useGetAllAdvertise } from '../../../queries/adminPanel/advertise.query';
import AdvertisementForm from './AdvertisementForm';
// <--- ADD THIS IMPORT

function Advertisement() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const deleteMutation = useDeleteAdvertise();
  const { data: adResponse, isLoading, isError, refetch } = useGetAllAdvertise();

  const handleFinalDelete = () => {
    if (!selectedPostId) return;

    handleDelete(selectedPostId);

    setShowDeletePopup(false);
    setSelectedPostId(null);
  };

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: (data) => {
          if (data.status) {
            toast.success(data.message ?? 'Advertisement deleted successfully');
            refetch(); // Refresh list
          } else {
            toast.error(data.message ?? 'Delete failed');
          }
        },
        onError: (error) => {
          toast.error(error?.message ?? 'Something went wrong');
        },
      });
    },
    [deleteMutation, refetch],
  );

  return (
    <>
      {/* ===== HEADER ===== */}
      <div className="mx-auto mb-6">
        <h2 className="mb-2 text-center text-2xl font-bold text-[#3a4b66]/90 italic underline underline-offset-8">
          Our Latest Creations
        </h2>
        <p className="mx-auto max-w-3xl text-center text-sm font-semibold text-[#3a4b66]/70">
          Manage your client subscriptions and track expiration dates. Monitor active subscriptions, view remaining
          days, and maintain up-to-date client information.
        </p>
      </div>

      {/* ===== ADD BUTTON ===== */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex cursor-pointer items-center rounded-full bg-[#aec2d1] px-4 py-2 text-base font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
        >
          Add Advertisement
        </button>
      </div>

      {/* ===== GRID OF POSTS ===== */}
      <div className="mx-auto mt-12 grid w-full max-w-7xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Loading */}
        {isLoading && <div className="col-span-full text-center text-lg font-semibold text-gray-600">Loading...</div>}

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

              <p className="line-clamp-2 text-sm text-gray-500">{post.description || 'No description available.'}</p>

              {/* Bottom Glow Line */}
              <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-linear-to-r from-transparent via-red-500/60 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
          </div>
        ))}
      </div>

      {/* ===== ADD ADVERTISEMENT MODAL ===== */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
            Add New Advertisement
          </h3>
          <AdvertisementForm onCancel={() => setShowAddModal(false)} refetchData={refetch} />
        </Modal>
      )}

      {showDeletePopup && (
        <DeletePopup
          onConfirm={handleFinalDelete}
          onCancel={() => {
            setShowAddModal(false);
            setShowDeletePopup(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </>
  );
}

export default Advertisement;
