import React, { useState } from 'react';
import { api } from '../utils/axiosFactory';

interface PostFormData {
  image: string;
  description: string;
  pageNumber: number;
  uploadOnFacebook: boolean;
  uploadOnInstagram: boolean;
}

export default function SocialMediaPostForm() {
  const [formData, setFormData] = useState<PostFormData>({
    image: '',
    description: '',
    pageNumber: 1,
    uploadOnFacebook: false,
    uploadOnInstagram: false,
  });

  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await api.post('post/create', formData);

      setResponse(res.data);
      setFormData({
        image: '',
        description: '',
        pageNumber: 1,
        uploadOnFacebook: false,
        uploadOnInstagram: false,
      });
      console.log(res.data);
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
        {/* Image */}
        <label>Image URL</label>
        <input className="border" type="text" name="image" value={formData.image} onChange={handleChange} />

        {/* Description */}
        <label>Description</label>
        <textarea className="border" name="description" value={formData.description} onChange={handleChange} />

        {/* Facebook Checkbox */}
        <label>
          <input
            className="border"
            type="checkbox"
            name="uploadOnFacebook"
            checked={formData.uploadOnFacebook}
            onChange={handleChange}
          />
          Upload to Facebook
        </label>

        {/* Instagram Checkbox */}
        <label>
          <input
            className="border"
            type="checkbox"
            name="uploadOnInstagram"
            checked={formData.uploadOnInstagram}
            onChange={handleChange}
          />
          Upload to Instagram
        </label>

        <button className="bg-red-500" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      {/* Response Output */}
      {response && (
        <div>
          <p>Status: {String(response.status)}</p>
          <p>Message: {response.message}</p>
        </div>
      )}
    </div>
  );
}
