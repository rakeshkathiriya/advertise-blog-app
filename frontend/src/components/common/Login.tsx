import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { loginSchema, type LoginFormValues } from '../../utils/validationSchema/loginSchema';

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

export const Login = () => {
  const handleSubmit = (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
    console.log('Login Data:', values);
    actions.setSubmitting(false);
    alert('Login Successful!');
  };

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
          className="mb-8 text-center text-4xl font-extrabold tracking-wide text-gray-900"
        >
          Welcome Back
        </motion.h2>

        <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
          {({ touched, errors }) => (
            <Form className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={`mt-1 w-full rounded-lg border bg-gray-50 p-3 text-gray-900 focus:ring-2 focus:ring-[#1877F2] ${
                    touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@mail.com"
                />
                <div className="min-h-5">
                  <ErrorMessage name="email" component="p" className="text-xs text-red-500" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className={`mt-1 w-full rounded-lg border bg-gray-50 p-3 text-gray-900 focus:ring-2 focus:ring-[#1877F2] ${
                    touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <div className="min-h-5">
                  <ErrorMessage name="password" component="p" className="text-xs text-red-500" />
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                className="w-full rounded-lg bg-[#E4B85A] py-3 text-lg font-semibold text-white shadow-lg hover:bg-[#d2a149]"
              >
                Login
              </motion.button>

              {/* Login with Facebook */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                className="mt-2 flex w-full items-center justify-center gap-3 rounded-lg bg-[#1877F2] py-3 text-white shadow-md hover:bg-[#0f63c9]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H18l-.5 3h-2.7v7A10 10 0 0 0 22 12" />
                </svg>
                Login with Facebook
              </motion.button>

              {/* Sign Up Link */}
              <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-semibold text-[#1877F2] hover:underline">
                  Sign up
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};
