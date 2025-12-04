import { useFormik } from 'formik';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useUserChangePassword } from '../queries/password/changePassword';
import { useAppSelector } from '../store/hooks';
import { changePasswordSchema, type ChangePassValues } from '../utils/validationSchema/changePassword';
import Modal from './AdminPanel/Modal';
import { Spinner } from './common/Spinner';

interface ChangePasswordFormProps {
  onCancel: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onCancel }) => {
  const logInUserEmail = useAppSelector((state) => state.auth);
  const email = logInUserEmail.user?.email;
  const [initialValues] = useState<ChangePassValues>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: email,
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    validationSchema: changePasswordSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (val) => {
      handlePassChange(val);
    },
  });

  const { isPending: resChangePassPending, mutate: resChangePassMutate } = useUserChangePassword();
  const { values, handleSubmit, handleChange, handleBlur, touched, errors, resetForm } = formik;

  const handlePassChange = useCallback(
    async (payload: ChangePassValues) => {
      resChangePassMutate(payload, {
        onSuccess: (data) => {
          if (data.status) {
            toast.success(data.message ?? 'Password Changed successfully');
            resetForm();
            onCancel();
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to Change Password');
        },
      });
    },
    [resChangePassMutate, resetForm],
  );
  return (
    <Modal onClose={onCancel}>
      <h3 className="mb-4 text-center text-lg font-bold tracking-wide text-[#3a4b66] underline underline-offset-8">
        Change Password
      </h3>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-xl space-y-8 rounded-3xl border border-[#aec2d1]/40 bg-white/90 p-8 shadow-xl backdrop-blur-xl"
      >
        {resChangePassPending && (
          <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-3xl backdrop-blur-xs">
            <Spinner />
          </div>
        )}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-[#3a4b66]">
            Current Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            name="currentPassword"
            placeholder="Enter new password"
            value={values.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#aec2d1] focus:outline-none ${
              touched.currentPassword && errors.currentPassword ? 'border-red-500' : 'border-gray-300'
            } `}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.currentPassword && errors.currentPassword}</p>
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-[#3a4b66]">
            New Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#aec2d1] focus:outline-none ${
              touched.newPassword && errors.newPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.newPassword && errors.newPassword}</p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-[#3a4b66]">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-[#aec2d1] focus:outline-none ${
              touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <p className="min-h-5 text-xs text-red-500">{touched.confirmPassword && errors.confirmPassword}</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-full bg-[#aec2d1] py-3 font-semibold text-[#3a4b66] shadow-lg transition-all hover:scale-105 hover:bg-[#bcd0db]"
        >
          Change Password
        </button>
      </form>
    </Modal>
  );
};

export default ChangePasswordForm;
