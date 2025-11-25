import { useState } from 'react';
import Modal from '../../../components/AdminPanel/Modal';
import AdvertisementForm from './AdvertisementForm';

function Advertisement() {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleAddClient = () => {
    setShowAddModal(false);
  };

  return (
    <>
      <div className="mx-auto mb-6">
        <h2 className="mb-2 text-center text-2xl font-bold text-[#3a4b66]/90 italic underline underline-offset-8">
          Our Latest Creations
        </h2>
        <p className="mx-auto max-w-3xl text-center text-sm font-semibold text-[#3a4b66]/70">
          Manage your client subscriptions and track expiration dates. Monitor active subscriptions, view remaining
          days, and maintain up-to-date client information. Double-click on any row to edit client details.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex cursor-pointer items-center rounded-full bg-[#aec2d1] px-4 py-2 text-base font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
        >
          Add Advertisement
        </button>
      </div>

      <div className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-4">
        {[1, 2, 3, 4, 5].map((post) => {
          console.log(post);
          return (
            <div className="group relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=736&auto=format&fit=crop"
                alt="image"
                className="size-72 object-cover object-top"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-black/50 p-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                <h1 className="text-xl font-medium">Company Name</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/80">
                  Delete 🗑️
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
            Add New Advertisement
          </h3>
          <AdvertisementForm
            client={{
              name: '',
              poc: '',
              email: '',
              postLimit: '',
              expiredDate: '',
            }}
            onSubmit={handleAddClient}
            onCancel={() => setShowAddModal(false)}
            submitLabel="Save"
          />
        </Modal>
      )}
    </>
  );
}

export default Advertisement;
