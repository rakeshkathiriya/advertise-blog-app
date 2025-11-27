import * as Yup from 'yup';

export const advertiseSchema = Yup.object().shape({
  image: Yup.mixed()
    .nullable()
    .required('Image Is Required')
    .test('fileSize', 'Image size is Must be Lesser Then 1MB', (value) => {
      if (!value) return true;
      if (!(value instanceof File)) return false;
      return value.size <= 5 * 1024 * 1024;
    })
    .test('fileType', 'Only JPG, JPEG, PNG files are allowed', (value) => {
      if (!value) return true;
      if (!(value instanceof File)) return false;

      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    }),

  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, "Description can't exceed 1000 characters"),

  client: Yup.string().required('Client name is required'),
  uploadOnFacebook: Yup.boolean(),
  uploadOnInstagram: Yup.boolean(),
});
