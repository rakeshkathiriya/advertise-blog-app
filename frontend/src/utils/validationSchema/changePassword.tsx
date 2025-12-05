import * as Yup from 'yup';

export interface ChangePassValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  email?: string;
}

export interface ResetPasswordPayload {
  token: string | null;
  userId: string | null;
  newPassword: string;
  confirmPassword: string;
}
const passwordRules = Yup.string()
  .required('Password is required')
  .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Must contain at least one lowercase letter')
  .matches(/\d/, 'Must contain at least one number')
  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
  .min(8, 'Password must be at least 8 characters');

export const changePasswordSchema = Yup.object({
  currentPassword: passwordRules.label('Current Password').required('Current Password is Required'),

  newPassword: passwordRules
    .label('New Password')
    .required('New Password is Required')
    .test('passwords-not-same', 'New Password cannot be the same as Current Password', function (value) {
      return value !== this.parent.currentPassword;
    }),

  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('newPassword')], 'New Password and Confirm Password must match'),
});

export const forgotPassSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

export const resetPasswordSchema = Yup.object({
  newPassword: passwordRules.label('New Password').required('New Password is Required'),

  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('newPassword')], 'New Password and Confirm Password must match'),
});
