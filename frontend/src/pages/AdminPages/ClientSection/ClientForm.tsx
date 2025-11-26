import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateClient } from '../../../queries/adminPanel/clients.query';
import type { Client } from '../../../utils/types/clients';

interface ClientFormProps {
  client: Client;
  onCancel: () => void;
  submitLabel: string;
}

const ClientForm = ({ client, onCancel, submitLabel }: ClientFormProps) => {
  const [initialValues] = useState<Client>({
    name: client.name,
    poc: client.poc,
    email: client.email,
    postLimit: client.postLimit,
    expiredDate: client.expiredDate,
    contact: client.contact,
  });

  const { mutate, isPending } = useCreateClient();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    // validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (val) => {
      console.log('Submitting client form with values:', val);
      handleClientSubmit(val);
    },
  });

  const { values, handleSubmit, setFieldValue, resetForm } = formik;

  const handleClientSubmit = useCallback(async (payload: Client) => {
    const modifyPayload = {
      ...payload,
      postLimit: Number(payload.postLimit),
      expiredDate: new Date(payload.expiredDate),
    };
    mutate(modifyPayload, {
      onSuccess: (data) => {
        if (data?.status) {
          toast.success(data?.message ?? 'Client created successfully');
          resetForm();
          onCancel();
        }
      },
      onError: (error) => {
        console.error('Error:', error);
        toast.error(error.message ?? 'Failed to create a client');
      },
    });
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Company Name</label>
        <input
          type="text"
          name="name"
          disabled={submitLabel.includes('Add') ? false : true}
          value={values.name}
          onChange={(e) => setFieldValue('name', e.target.value)}
          className={`${submitLabel.includes('Add') ? 'cursor-auto bg-white' : 'cursor-not-allowed bg-gray-300'} w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none`}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">POC</label>
        <input
          type="text"
          name="name"
          value={values.poc}
          onChange={(e) => setFieldValue('poc', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Mobile No.</label>
        <input
          type="tel"
          name="contact"
          value={values.contact}
          onChange={(e) => setFieldValue('contact', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={(e) => setFieldValue('email', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Post Limit</label>
        <input
          type="number"
          name="postLimit"
          value={values.postLimit}
          onChange={(e) => setFieldValue('postLimit', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Expiration Date (DD/MM/YYYY)</label>
        <input
          type="date"
          name="expiredDate"
          value={values.expiredDate}
          onChange={(e) => setFieldValue('expiredDate', e.target.value)}
          placeholder="31/12/2025"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="text-14 flex flex-1 items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
        >
          {isPending ? 'Loading...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
