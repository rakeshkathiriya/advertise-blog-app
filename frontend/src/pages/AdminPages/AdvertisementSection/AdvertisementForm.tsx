import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { advertiseCreation, useClientsDDOptions } from '../../../queries/adminPanel/clients.query';
import type { CommonApiError } from '../../../utils/types/common';
import type { AdvertisePayload, AdvertiseResponse } from '../../../utils/types/post';
import { advertiseSchema } from '../../../utils/validationSchema/advertiseSchema';

const AdvertisementForm = ({
  onCancel,
  refetchData,
}: {
  onCancel: () => void;
  refetchData: (options?: RefetchOptions) => Promise<QueryObserverResult<AdvertiseResponse, CommonApiError>>;
}) => {
  const [initialValue] = useState<AdvertisePayload>({
    image: null,
    description: '',
    uploadOnFacebook: false,
    uploadOnInstagram: false,
    client: '',
  });

  const { isPending: resAdvertisePending, mutate: resAdvertiseMutate } = advertiseCreation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValue },
    validateOnBlur: true,
    validationSchema: advertiseSchema,
    validateOnChange: true,
    onSubmit: (val) => {
      handleRegister(val);
    },
  });

  const { values, handleSubmit, handleChange, setFieldValue, handleBlur, touched, errors, resetForm } = formik;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    console.log(file);
    if (file) {
      formik.setFieldValue('image', file);
    }
  };

  const handleRegister = useCallback(
    async (payload: AdvertisePayload) => {
      const formData = new FormData();

      if (payload.image) {
        formData.append('image', payload.image);
      }

      formData.append('description', payload.description);
      formData.append('uploadOnFacebook', String(payload.uploadOnFacebook));
      formData.append('uploadOnInstagram', String(payload.uploadOnInstagram));
      formData.append('client', payload.client);

      resAdvertiseMutate(formData, {
        onSuccess: (data) => {
          if (data.status) {
            toast.success(data.message ?? 'Advertise created successfully');
            resetForm();
            onCancel();
            refetchData();
          } else {
            toast.error(data.message ?? '');
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to create advertise');
        },
      });
    },
    [resAdvertiseMutate, resetForm, onCancel],
  );

  const { data: clientsResponse } = useClientsDDOptions();
  console.log(clientsResponse);
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl space-y-8 rounded-3xl border border-[#aec2d1]/40 bg-white/90 p-8 shadow-xl backdrop-blur-xl"
    >
      <div className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-1">
          <label htmlFor="image" className="block text-sm font-semibold text-[#3a4b66]">
            Advertise Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            onBlur={handleBlur}
            accept="image/jpeg,image/jpg,image/png"
            className={`w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700 transition-all hover:bg-gray-200 focus:ring-2 focus:ring-[#aec2d1] focus:outline-none ${
              touched.image && errors.image ? 'border-red-500' : 'border-gray-300'
            } `}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.image && errors.image}</p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-semibold text-[#3a4b66]">
            Description
          </label>
          <div className="relative">
            <textarea
              name="description"
              rows={4}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`scrollbar-thin scrollbar-thumb-[#aec2d1] scrollbar-track-gray-200 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#aec2d1] focus:outline-none ${
                touched.description && errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write something amazing..."
            />
          </div>
          <p className="min-h-5 text-xs text-red-500">{touched.description && errors.description}</p>
        </div>

        {/* Upload Toggles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#f6f7f9] p-4 shadow-sm transition-all hover:shadow-lg">
            <input
              name="uploadOnFacebook"
              checked={Boolean(values.uploadOnFacebook)}
              onChange={(e) => {
                setFieldValue('uploadOnFacebook', Boolean(e.target.checked));
              }}
              onBlur={handleBlur}
              type="checkbox"
              className="h-5 w-5 accent-[#3a4b66]"
            />
            <span className="text-sm font-semibold text-[#3a4b66]">Facebook</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#f6f7f9] p-4 shadow-sm transition-all hover:shadow-lg">
            <input
              type="checkbox"
              name="uploadOnInstagram"
              checked={Boolean(values.uploadOnInstagram)}
              onChange={(e) => {
                setFieldValue('uploadOnInstagram', Boolean(e.target.checked));
              }}
              onBlur={handleBlur}
              className="h-5 w-5 accent-[#3a4b66]"
            />
            <span className="text-sm font-semibold text-[#3a4b66]">Instagram</span>
          </div>
        </div>

        {/* Client Select */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-[#3a4b66]">Choose a Client</label>
          <select
            name="client"
            id="client"
            value={values.client}
            onChange={handleChange}
            className={`w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#aec2d1] focus:outline-none ${
              touched.client && errors.client ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select a client --</option>
            {clientsResponse?.data.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <p className="min-h-5 text-xs text-red-500">{touched.client && errors.client}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={resAdvertisePending}
          className="flex-1 rounded-full bg-[#aec2d1] py-3 font-semibold text-[#3a4b66] shadow-lg transition-all hover:scale-105 hover:bg-[#bcd0db]"
        >
          {resAdvertisePending ? 'Creating Advertise...' : 'Create Advertise'}
        </button>
      </div>
    </form>
  );
};

export default AdvertisementForm;
