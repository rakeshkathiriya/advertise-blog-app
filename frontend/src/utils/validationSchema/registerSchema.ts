import * as Yup from 'yup';

export const registerSchema = Yup.object({
  firstname: Yup.string().min(2, 'First name must be at least 2 characters').required('First name is required'),

  lastname: Yup.string().min(2, 'Last name must be at least 2 characters').required('Last name is required'),

  email: Yup.string().email('Invalid email format').required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
    .min(8, 'Password must be at least 8 characters'),
});
