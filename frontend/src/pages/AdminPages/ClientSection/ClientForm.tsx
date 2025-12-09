import { format } from 'date-fns';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../../components/AdminPanel/Modal';
import { Spinner } from '../../../components/common/Spinner';
import { useCreateClient, useUpdateClient } from '../../../queries/adminPanel/clients.query';
import { dateUtils } from '../../../utils/dateUtils';
import type { ClientDetails } from '../../../utils/types/clients';
import { clientSchema } from '../../../utils/validationSchema/ClientSchema';

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
    validationSchema: clientSchema,
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

  const { values, handleSubmit, handleBlur, setFieldValue, resetForm, touched, errors } = formik;

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
    <Modal onClose={onCancel} isLoading={createIsPending || updateIsPending}>
      <h3 className="text-textColor mb-4 text-center text-lg font-bold tracking-wide underline underline-offset-8">
        {`${submitLabel.includes('Save') ? 'Add New Client' : 'Update Client Information'}`}
      </h3>
      <form
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        className="mx-auto w-full max-w-2xl space-y-0 rounded-3xl border border-[#aec2d1]/40 bg-white/90 p-8 shadow-xl backdrop-blur-xl"
      >
        {createIsPending && (
          <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-3xl backdrop-blur-xs">
            <Spinner />
          </div>
        )}

        {updateIsPending && (
          <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-3xl backdrop-blur-xs">
            <Spinner />
          </div>
        )}
        <div className="space-y-1">
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">
            Company Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            disabled={submitLabel.includes('Save') ? false : true}
            value={values.name}
            onChange={(e) => setFieldValue('name', e.target.value)}
            className={`${submitLabel.includes('Save') ? 'cursor-auto bg-white' : 'cursor-not-allowed bg-gray-300'} w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none ${
              touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
            } `}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.name && errors.name}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">
            POC <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="poc"
            value={values.poc}
            onChange={(e) => setFieldValue('poc', e.target.value)}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none ${
              touched.poc && errors.poc ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.poc && errors.poc}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">
            Mobile No. <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            name="contact"
            value={values.contact}
            onChange={(e) => setFieldValue('contact', e.target.value)}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none ${
              touched.contact && errors.contact ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.contact && errors.contact}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={(e) => setFieldValue('email', e.target.value)}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none ${
              touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
            } `}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.email && errors.email}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">
            Post Limit <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="postLimit"
            value={values.postLimit}
            onChange={(e) => setFieldValue('postLimit', e.target.value)}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none ${
              touched.postLimit && errors.postLimit ? 'border-red-500' : 'border-gray-300'
            } `}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.postLimit && errors.postLimit}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">
            Expiration Date (DD/MM/YYYY) <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            min={dateUtils.yesterday()}
            name="expiredDate"
            value={values.expiredDate ? format(values.expiredDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setFieldValue('expiredDate', e.target.value)}
            placeholder="31/Jan/2025"
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none ${
              touched.expiredDate && errors.expiredDate ? 'border-red-500' : 'border-gray-300'
            } `}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.expiredDate && errors.expiredDate}</p>
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
    </Modal>
  );
};

export default ClientForm;
