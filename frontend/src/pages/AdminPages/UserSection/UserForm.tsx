import { useState } from 'react';
import type { User, UserWithIndex } from './UsersTable';

interface UserFormProps {
  user: User | UserWithIndex;
  onSubmit: (client: User) => void;
  onCancel: () => void;
  submitLabel: string;
}

const UserForm = ({ user, onSubmit, onCancel, submitLabel }: UserFormProps) => {
  const [formData, setFormData] = useState<User>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    foreEverSubscribe: user.foreEverSubscribe,
    expiredDate: user.expiredDate,
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">First Name</label>
        <input
          type="text"
          disabled
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Last Name</label>
        <input
          type="text"
          disabled
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Email</label>
        <input
          type="email"
          disabled
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">ForeEver Subscribe</label>
        <input
          type="checkbox"
          checked={Boolean(formData.foreEverSubscribe)}
          onChange={(e) =>
            setFormData({
              ...formData,
              foreEverSubscribe: e.target.checked, // <-- TRUE / FALSE
            })
          }
          className="focus:ring-[#3a4b66]e h-4 w-4 rounded border border-gray-300 text-[#3a4b66] focus:ring-2"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Expiration Date (DD/MM/YYYY)</label>
        <input
          type="date"
          disabled
          value={formData.expiredDate.split('/').reverse().join('-')}
          onChange={(e) => setFormData({ ...formData, expiredDate: e.target.value.split('-').reverse().join('/') })}
          placeholder="31/12/2025"
          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
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

export default UserForm;
