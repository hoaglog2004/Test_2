import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const AddBook = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [authors, setAuthors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authorId: '',
    description: '',
    genre: '',
    status: 'PUBLISHED',
    coverImageUrl: ''
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors');
      const data = response.data;
      setAuthors(data.content || data || []);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to API
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await api.post('/books/upload-cover', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, coverImageUrl: response.data.url });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Error uploading image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.title.trim().length < 2) {
      setErrorMsg('Book title must be at least 2 characters long.');
      return;
    }
    if (!formData.authorId) {
      setErrorMsg('Please select an author.');
      return;
    }
    if (!formData.coverImageUrl) {
      setErrorMsg('Please upload a cover image.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/books', formData);
      navigate('/');
    } catch (error) {
      console.error('Failed to create book:', error);
      setErrorMsg(error.response?.data?.message || 'Error creating book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Book</h1>
        <p className="text-gray-500 mt-2">Enter the details below to add a new book to the library.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}
          
          <div 
            className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewImage ? (
              <img src={previewImage} alt="Cover preview" className="w-full h-full object-contain" />
            ) : (
              <>
                <ImagePlus className="text-gray-400 mb-3" size={32} />
                <span className="text-sm font-semibold text-gray-900">Click to upload cover image</span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Book Title</label>
            <input
              type="text"
              required
              placeholder="e.g. The Great Gatsby"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Author</label>
            <select
              required
              value={formData.authorId}
              onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b6375%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat"
            >
              <option value="" disabled>Select an author</option>
              {Array.isArray(authors) && authors.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Genre</label>
            <input
              type="text"
              placeholder="e.g. Fiction, Sci-Fi"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
            <textarea
              rows="4"
              placeholder="Brief summary or description of the book..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
