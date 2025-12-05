import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserLogin } from '../../queries/auth.query';
import { setUser } from '../../store/authSlice';
import { useAppDispatch } from '../../store/hooks';
import type { LoginUserPayload } from '../../utils/types/auth';
import { loginSchema, type LoginFormValues } from '../../utils/validationSchema/loginSchema';
import { FacebookLoginButton } from './FacebookLoginButton';
import PasswordField from './PasswordField';

const LoginPage = () => {
  const [initialValues] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutate: loginMutate, isPending: loginPending } = useUserLogin();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (val) => {
      handleLogin(val);
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors, resetForm } = formik;

  const handleLogin = useCallback(
    async (payload: LoginUserPayload) => {
      loginMutate(payload, {
        onSuccess: (data) => {
          if (data?.status) {
            toast.success(data?.message ?? 'Logged in successfully');
            const userDetail = data?.data;
            const userData = {
              _id: userDetail?._id,
              firstname: userDetail?.firstname,
              lastname: userDetail?.lastname,
              email: userDetail?.email,
              role: userDetail?.role,
              loginType: 'normal',
            };
            localStorage.setItem('accessToken', data?.accessToken ?? '');

            dispatch(setUser(userData));
            if (userData.role === 'Admin') {
              navigate('/aba-admin');
              return;
            }
            if (userData.role === 'User') {
              navigate('/');
              return;
            }
            resetForm();
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Login failed');
        },
      });
    },
    [loginMutate, navigate, resetForm],
  );

  return (
    <div className="from-bgPrimaryDark to-bgPrimary/70 flex min-h-screen items-center justify-center bg-linear-to-br p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-slate-200 p-10 shadow-xl"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-bgPrimary mb-8 text-center text-4xl font-extrabold tracking-wide"
        >
          Welcome Back
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-bgPrimary block text-sm font-medium">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 w-full rounded-lg border bg-gray-50 p-3 ${
                touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@mail.com"
            />
            <p className="min-h-5 text-xs text-red-500">{touched.email && errors.email}</p>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-bgPrimary block text-sm font-medium">
                Password <span className="text-red-600">*</span>
              </label>

              {/* Forgot Password Link */}
              <Link to="/forgot-password" className="text-sm font-medium text-[#1877F2] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <PasswordField
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.password}
              error={errors.password}
            />
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loginPending}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            className="bg-bgPrimary w-full rounded-lg py-3 text-lg font-semibold text-white shadow-lg"
          >
            {loginPending ? 'Logging in...' : 'Login'}
          </motion.button>

          {/* Facebook Button */}
          <FacebookLoginButton />

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-semibold text-[#1877F2] hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
