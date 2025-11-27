import { format } from 'date-fns';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateClient, useUpdateClient } from '../../../queries/adminPanel/clients.query';
import type { ClientDetails } from '../../../utils/types/clients';

interface ClientFormProps {
  client: ClientDetails;
  onCancel: () => void;
  submitLabel: string;
  setCanRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClientForm = ({ client, onCancel, submitLabel, setCanRefresh }: ClientFormProps) => {
  const [initialValues] = useState<ClientDetails>({
    _id: client._id ?? '',
    name: client.name ?? '',
    poc: client.poc ?? '',
    email: client.email ?? '',
    postLimit: client.postLimit ?? 0,
    expiredDate: client.expiredDate ?? '',
    contact: client.contact ?? '',
    posts: client.posts || [],
  });

  const { mutate: createMutate, isPending: createIsPending } = useCreateClient();
  const { mutate: updateMutate, isPending: updateIsPending } = useUpdateClient();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    // validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (val) => {
      console.log('Submitting client form with values:', val);
      if (submitLabel === 'Save') {
        handleClientSubmit(val);
      } else if (submitLabel === 'Update') {
        handleEditClient(val);
      }
    },
  });

  const { values, handleSubmit, setFieldValue, resetForm } = formik;

  const handleClientSubmit = useCallback(
    async (payload: ClientDetails) => {
      const modifyPayload = {
        ...payload,
        postLimit: Number(payload.postLimit),
        expiredDate: new Date(payload.expiredDate),
      };
      createMutate(modifyPayload, {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message ?? 'Client created successfully');
            resetForm();
            onCancel();
            setCanRefresh(true);
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to create a client');
          setCanRefresh(false);
        },
      });
    },
    [createMutate, onCancel, resetForm, setCanRefresh],
  );

  const handleEditClient = useCallback(
    async (payload: ClientDetails) => {
      const modifyPayload = {
        ...payload,
        id: payload._id,
        postLimit: Number(payload.postLimit),
        expiredDate: new Date(payload.expiredDate),
      };
      updateMutate(modifyPayload, {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message ?? 'Client update successfully');
            resetForm();
            onCancel();
            setCanRefresh(true);
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to update a client');
          setCanRefresh(false);
        },
      });
    },
    [updateMutate, onCancel, resetForm, setCanRefresh],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Company Name</label>
        <input
          type="text"
          name="name"
          disabled={submitLabel.includes('Save') ? false : true}
          value={values.name}
          onChange={(e) => setFieldValue('name', e.target.value)}
          className={`${submitLabel.includes('Save') ? 'cursor-auto bg-white' : 'cursor-not-allowed bg-gray-300'} w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none`}
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
          min={new Date().toISOString().split('T')[0]}
          name="expiredDate"
          value={values.expiredDate ? format(values.expiredDate, 'yyyy-MM-dd') : ''}
          onChange={(e) => setFieldValue('expiredDate', e.target.value)}
          placeholder="31/12/2025"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={createIsPending || updateIsPending}
          className="text-14 flex flex-1 items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide text-[#3a4b66] transition-all duration-500 ease-in-out hover:scale-105 hover:transform"
        >
          {createIsPending || updateIsPending ? 'Loading...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
