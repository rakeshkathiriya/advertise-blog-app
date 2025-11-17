import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserRegistration } from '../../queries/auth.query';
import type { RegisterUserPayload } from '../../utils/types/auth';
import { registerSchema } from '../../utils/validationSchema/registerSchema';
import { FacebookLoginButton } from './FacebookLoginButton';

export const SignUp = () => {
  const navigate = useNavigate();
  const [initialValue] = useState<RegisterUserPayload>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'User',
    isActive: true,
  });

  const { isPending: resRegisterPending, mutate: resRegisterMutate } = useUserRegistration();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValue },
    validationSchema: registerSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (val) => {
      handleRegister(val);
    },
  });

  const { values, handleSubmit, handleChange, handleBlur, touched, errors, resetForm } = formik;

  const handleRegister = useCallback(
    async (payload: RegisterUserPayload) => {
      resRegisterMutate(payload, {
        onSuccess: (data) => {
          if (data.status) {
            toast.success(data.message ?? 'User created successfully');
            resetForm();
            navigate('/login');
          }
        },
        onError: (error) => {
          console.error('Error:', error);
          toast.error(error.message ?? 'Failed to create user');
        },
      });
    },
    [resRegisterMutate, navigate, resetForm],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#f7f7f7] to-[#eaeaea] p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-2xl border border-gray-200 p-10 shadow-xl"
      >
        <h2 className="mb-8 text-center text-4xl font-extrabold text-gray-900">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* GRID */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* FIRST NAME */}
            <div>
              <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                name="firstname"
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 w-full rounded-lg border bg-gray-50 p-3 ${
                  touched.firstname && errors.firstname ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              <p className="min-h-5 text-xs text-red-500">{touched.firstname && errors.firstname}</p>
            </div>

            {/* LAST NAME */}
            <div>
              <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                name="lastname"
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 w-full rounded-lg border bg-gray-50 p-3 ${
                  touched.lastname && errors.lastname ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              <p className="min-h-5 text-xs text-red-500">{touched.lastname && errors.lastname}</p>
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
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

          {/* PASSWORD */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 w-full rounded-lg border bg-gray-50 p-3 ${
                touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••"
            />
            <p className="min-h-5 text-xs text-red-500">{touched.password && errors.password}</p>
          </div>

          {/* SUBMIT */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            disabled={resRegisterPending}
            className="w-full rounded-lg bg-[#E4B85A] py-3 font-semibold text-gray-900 shadow-lg"
          >
            {resRegisterPending ? 'Creating Account...' : 'Create Account'}
          </motion.button>

          {/* FACEBOOK */}
          <FacebookLoginButton />
          <p className="mt-4 text-center text-sm text-gray-600">
            Already an account?{' '}
            <a href="/login" className="font-semibold text-[#1877F2] hover:underline">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
