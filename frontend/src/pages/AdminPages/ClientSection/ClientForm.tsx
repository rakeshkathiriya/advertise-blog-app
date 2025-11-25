import { useState } from 'react';
import type { Client, ClientWithIndex } from './ClientsTable';

interface ClientFormProps {
  client: Client | ClientWithIndex;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
  submitLabel: string;
}

const ClientForm = ({ client, onSubmit, onCancel, submitLabel }: ClientFormProps) => {
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
          disabled
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
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

export default ClientForm;
