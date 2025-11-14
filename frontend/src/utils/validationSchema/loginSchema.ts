import * as Yup from 'yup';

export interface LoginFormValues {
  email: string;
  password: string;
}

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),

  password: Yup.string().required('Password is required'),
});
