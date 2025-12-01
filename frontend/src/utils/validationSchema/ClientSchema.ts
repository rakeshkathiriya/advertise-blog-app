import * as Yup from 'yup';

export const clientSchema = Yup.object({
  name: Yup.string().trim().required('Company Name is required'),

  poc: Yup.string().trim().required('Point-of-Contact (POC) is required'),

  email: Yup.string().trim().email('Invalid email address').required('Email id is required'),

  postLimit: Yup.number()
    .integer('Post limit must be an integer')
    .min(0, 'Post limit cannot be negative')
    .required('Post limit is required'),

  expiredDate: Yup.date().typeError('Expired date must be a valid date').required('Expired date is required'),

  contact: Yup.string()
    .trim()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
    .required('Contact number is required'),
});
