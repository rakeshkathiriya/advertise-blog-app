import React, { useState } from 'react';
import { api } from '../utils/axiosFactory';

interface PostFormData {
  image: File | null;
  description: string;
  uploadOnFacebook: boolean;
  uploadOnInstagram: boolean;
  client: string;
}

export default function SocialMediaPostForm() {
  const [formData, setFormData] = useState<PostFormData>({
    image: null,
    description: '',
    uploadOnFacebook: false,
    uploadOnInstagram: false,
    client: '',
  });

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Handle text and checkbox fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, JPEG, PNG formats are allowed');
      return;
    }

    setFormData({ ...formData, image: file });
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      // Create multipart form data
      const form = new FormData();
      if (formData.image) form.append('image', formData.image);
      form.append('description', formData.description);
      form.append('uploadOnFacebook', String(formData.uploadOnFacebook));
      form.append('uploadOnInstagram', String(formData.uploadOnInstagram));
      form.append('client', String(formData.client));
      // Axios will automatically detect boundaries
      const res = await api.post('admin/advertisements', form);

      setResponse(res.data);

      // Reset form
      setFormData({
        image: null,
        description: '',
        uploadOnFacebook: false,
        uploadOnInstagram: false,
        client: '',
      });
    } catch (error: any) {
      setResponse({
        status: false,
        message: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Social Media Post</h2>

      <form onSubmit={handleSubmit}>
        {/* File Upload */}
        <label>Upload Image (jpg, jpeg, png)</label>
        <input
          className="border"
          type="file"
          name="image"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
        />

        {/* Description */}
        <label>Description</label>
        <textarea className="border" name="description" value={formData.description} onChange={handleChange} />

        {/* Facebook Checkbox */}
        <label>
          <input type="checkbox" name="uploadOnFacebook" checked={formData.uploadOnFacebook} onChange={handleChange} />
          Upload to Facebook
        </label>

        {/* Instagram Checkbox */}
        <label>
          <input
            type="checkbox"
            name="uploadOnInstagram"
            checked={formData.uploadOnInstagram}
            onChange={handleChange}
          />
          Upload to Instagram
        </label>

        <label>
          <input type="text" name="client" value={formData.client} onChange={handleChange} />
          client
        </label>

        <button className="bg-green-500 px-4 py-2 text-white" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      {/* Response */}
      {response && (
        <div className="mt-4">
          <p>
            <strong>Status:</strong> {String(response.status)}
          </p>
          <p>
            <strong>Message:</strong> {response.message}
          </p>
        </div>
      )}
    </div>
  );
}
