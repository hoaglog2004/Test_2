import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, MapPin } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const CreateReview = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState({
    bookId: '',
    rating: 0,
    content: '',
    reviewerName: '',
    tags: [],
    status: 'SUBMITTED' // Or DRAFT based on which button is clicked
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      const data = response.data;
      setBooks(data.content || data || []);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove)
    });
  };

  const handleSubmit = async (status) => {
    setErrorMsg('');

    if (!formData.bookId) {
      setErrorMsg('Please select a book to review.');
      return;
    }
    if (!formData.reviewerName || formData.reviewerName.trim().length < 2) {
      setErrorMsg('Please provide your name as a reviewer (min 2 characters).');
      return;
    }
    if (formData.rating === 0) {
      setErrorMsg('Please select a rating from 1 to 5 stars.');
      return;
    }
    if (formData.content.trim().length < 10) {
      setErrorMsg('Review content must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/reviews', { ...formData, status });
      navigate('/reviews'); // Or wherever Reviews are listed
    } catch (error) {
      console.error('Failed to create review:', error);
      setErrorMsg(error.response?.data?.message || 'Error creating review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 flex gap-8">
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create a New Review</h1>
          <p className="text-gray-500 mt-2">Share your thoughts on your latest read with the community.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="space-y-6">
            {errorMsg && (
              <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {errorMsg}
              </div>
            )}
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Book Selection</label>
                <select
                  required
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b6375%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat"
                >
                  <option value="" disabled>Select a book from your library</option>
                  {Array.isArray(books) && books.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Author</label>
                <input
                  type="text"
                  disabled
                  value={books.find(b => b.id === formData.bookId)?.author?.name || ''}
                  placeholder="Auto-filled based on selection"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Your Rating</label>
              <div className="inline-flex items-center gap-4 bg-blue-50/50 px-4 py-2 rounded-full">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-colors ${
                        (hoveredRating || formData.rating) >= star
                          ? 'fill-teal-900 text-teal-900'
                          : 'text-gray-300'
                      }`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    />
                  ))}
                </div>
                <span className="text-teal-900 font-semibold">{formData.rating > 0 ? formData.rating.toFixed(1) : '0.0'} / 5.0</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Review Content</label>
              <textarea
                rows="8"
                required
                placeholder="Write your detailed review here. Consider discussing the plot, characters, pacing, and overall themes..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Tags <span className="text-gray-400 font-normal">(Optional)</span></label>
              <div className="flex flex-wrap gap-2 items-center">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-blue-900">×</button>
                  </span>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="e.g. Sci-Fi"
                    className="w-32 px-3 py-1 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-teal-900"
                  />
                  <Button variant="outline" onClick={handleAddTag} className="h-8 py-0 px-3 text-xs rounded-full">
                    + Add Tag
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
              <Button type="button" variant="ghost" disabled={isSubmitting} onClick={() => handleSubmit('DRAFT')}>
                Save as Draft
              </Button>
              <Button type="button" disabled={isSubmitting} onClick={() => handleSubmit('SUBMITTED')}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Guidelines */}
      <div className="w-80">
        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-900">
              <MapPin size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Review<br/>Guidelines</h3>
          </div>
          
          <div className="mb-6 pb-6 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Reviewer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.reviewerName}
              onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20"
            />
          </div>
          
          <ul className="space-y-5 text-sm text-gray-600">
            <li className="flex gap-3">
              <CheckCircle2 size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <span>Be constructive and respectful. Focus on the content, not the author personally.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <span>Avoid major plot spoilers, or use the spoiler tag if necessary.</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
              <span>Aim for at least 150 words to provide meaningful insight to other readers.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateReview;
