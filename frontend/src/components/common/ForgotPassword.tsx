import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPasswordEmail } from '../../queries/password/changePassword';
import { forgotPassSchema } from '../../utils/validationSchema/changePassword';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [initialValues] = useState<{ email: string }>({
    email: '',
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    validationSchema: forgotPassSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (val) => {
      handleResetPass(val);
    },
  });

  const { isPending: resResetPassPending, mutate: resResetPassMutate } = useResetPasswordEmail();
  const { values, handleSubmit, handleChange, handleBlur, touched, errors, resetForm } = formik;

  const handleResetPass = useCallback(
    async (payload: { email: string }) => {
      resResetPassMutate(payload, {
        onSuccess: (data) => {
          if (data.status) {
            toast.success(data.message ?? 'Password Changed successfully');
            resetForm();
            setSubmitted(true);
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to Change Password');
        },
      });
    },
    [resResetPassMutate, resetForm],
  );
  return (
    <div className="from-bgPrimaryDark to-bgPrimary/70 flex min-h-screen items-center justify-center bg-linear-to-br p-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-slate-200 p-5 shadow-xl md:p-10"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-bgPrimary mb-4 text-center text-xl font-extrabold tracking-wide md:text-4xl"
        >
          Forgot Password
        </motion.h2>

        <p className="mb-8 text-center text-sm text-gray-600">Enter your registered email to change your password.</p>

        {!submitted ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-bgPrimary block text-sm font-medium">
                Registered Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <p className="min-h-5 text-xs text-red-500">{touched.email && errors.email}</p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={resResetPassPending}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              className="bg-bgPrimary w-full rounded-lg py-3 text-lg font-semibold text-white shadow-lg"
            >
              {resResetPassPending ? 'Please wait...' : 'Send Reset Link'}
            </motion.button>
          </form>
        ) : (
          /* Success Message After Submission */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-xs text-green-700 md:text-sm"
          >
            A reset password link has been sent to your registered email.
          </motion.div>
        )}

        {/* Back to Login */}
        <p className="md:text:sm mt-6 text-center text-xs text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-[#1877F2] hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
