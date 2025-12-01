import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from '../../../components/common/Spinner';
import { useChangeForeverSubscribeStatus } from '../../../queries/adminPanel/users.query';
import type { UserDetails } from '../../../utils/types/users';

interface UserFormProps {
  user: UserDetails;
  onCancel: () => void;
  submitLabel: string;
  setCanRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserForm = ({ user, onCancel, submitLabel, setCanRefresh }: UserFormProps) => {
  const [initialValues] = useState<UserDetails>({
    _id: user._id ?? '',
    firstname: user.firstname ?? '',
    lastname: user.lastname ?? '',
    email: user.email ?? '',
    isForeverSubscribe: user.isForeverSubscribe ?? false,
    isSubscribed: user.isSubscribed ?? false,
  });

  const { mutate: updateMutate, isPending: updateIsPending } = useChangeForeverSubscribeStatus();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    // validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (val) => {
      console.log('Submitting client form with values:', val);
      handleEditClient(val);
    },
  });

  const { values, handleSubmit, setFieldValue, resetForm } = formik;

  const handleEditClient = useCallback(
    async (payload: UserDetails) => {
      if (!payload._id) return;

      const modifyPayload = {
        id: payload?._id,
      };
      updateMutate(modifyPayload, {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message ?? 'User update successfully');
            resetForm();
            onCancel();
            setCanRefresh(true);
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to update a user');
          setCanRefresh(false);
        },
      });
    },
    [updateMutate, onCancel, resetForm, setCanRefresh],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl space-y-3 rounded-3xl border border-[#aec2d1]/40 bg-white/90 p-8 shadow-xl backdrop-blur-xl"
    >
      {updateIsPending && (
        <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-3xl backdrop-blur-xs">
          <Spinner />
        </div>
      )}
      <div className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="firstname" className="block text-sm font-semibold text-[#3a4b66]">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            disabled
            value={values.firstname}
            onChange={(e) => setFieldValue('firstname', e.target.value)}
            className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Last Name</label>
          <input
            type="text"
            name="lastname"
            disabled
            value={values.lastname}
            onChange={(e) => setFieldValue('lastname', e.target.value)}
            className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3a4b66]">Email</label>
          <input
            type="email"
            name="email"
            disabled
            value={values.email}
            onChange={(e) => setFieldValue('email', e.target.value)}
            className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#3a4b66] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#f6f7f9] p-4 shadow-sm transition-all hover:shadow-lg">
          <input
            type="checkbox"
            name="uploadOnInstagram"
            checked={Boolean(values.isForeverSubscribe)}
            onChange={(e) => setFieldValue('isForeverSubscribe', Boolean(e.target.checked))}
            className="h-5 w-5 accent-[#3a4b66]"
          />
          <span className="text-sm font-semibold text-[#3a4b66]">ForeEver Subscribe</span>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={updateIsPending || initialValues.isForeverSubscribe === values.isForeverSubscribe}
            className={`text-14 flex flex-1 items-center justify-center gap-2 rounded-full bg-[#aec2d1] px-4 py-2 font-semibold tracking-wide text-[#3a4b66] ${updateIsPending || initialValues.isForeverSubscribe === values.isForeverSubscribe ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer'}`}
          >
            {updateIsPending ? 'Loading' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
