import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPassword } from '../../queries/password/changePassword';
import { resetPasswordSchema } from '../../utils/validationSchema/changePassword';
import PasswordField from './PasswordField';

const ResetPassword = () => {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);

  const rawToken = params.get('token')?.replace(/ /g, '+') ?? null;

  const token = rawToken ? decodeURIComponent(rawToken) : null;
  const id = params.get('id') || '';

  const { mutate: resetPasswordMutation, isPending: resetPassPending } = useResetPassword();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      resetPasswordMutation(
        {
          token,
          userId: id,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        {
          onSuccess: (res) => {
            toast.success(res.message || 'Password Reset successfully');
            navigate('/login');
          },
          onError: (err) => {
            console.log('res : err : ', err.response);
            toast.error(err?.response?.data?.['error']?.message || 'Failed To Reset Password');
          },
        },
      );
    },
  });

  const { errors, touched, handleChange, handleSubmit, values, handleBlur } = formik;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#f7f7f7] to-[#eaeaea] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 shadow-xl"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4 text-center text-4xl font-extrabold tracking-wide text-gray-900"
        >
          Reset Password
        </motion.h2>

        <p className="mb-8 text-center text-sm text-gray-600">Set a new password for your account.</p>

        {/* Token Invalid Message */}

        {/* Show Form Only When Token Valid */}
        {
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password <span className="text-red-600">*</span>
              </label>

              <PasswordField
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.newPassword}
                error={errors.newPassword}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <PasswordField
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.confirmPassword}
                error={errors.confirmPassword}
              />
            </div>

            <motion.button
              type="submit"
              disabled={resetPassPending}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              className="w-full rounded-lg bg-[#E4B85A] py-3 text-lg font-semibold text-white shadow-lg"
            >
              {resetPassPending ? 'Please wait...' : 'Reset Password'}
            </motion.button>
          </form>
        }

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <a href="/login" className="font-semibold text-[#1877F2] hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
