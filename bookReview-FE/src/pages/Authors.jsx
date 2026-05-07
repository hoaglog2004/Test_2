import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', shortBio: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/authors');
      const data = response.data;
      setAuthors(data.content || data || []);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.name.trim().length < 2) {
      setErrorMsg('Author name must be at least 2 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/authors', formData);
      setIsModalOpen(false);
      setFormData({ name: '', shortBio: '' });
      fetchAuthors();
    } catch (error) {
      console.error('Failed to create author:', error);
      setErrorMsg(error.response?.data?.message || 'Error creating author. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Authors</h1>
          <p className="text-gray-500 mt-2">Manage the authors in the HAIBAZO database.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} /> Add New Author
        </Button>
      </div>

      <Table headers={['AUTHOR NAME', 'SHORT BIO', 'BOOKS PUBLISHED']}>
        {loading ? (
          <tr>
            <td colSpan="3" className="px-6 py-8 text-center text-gray-500">Loading...</td>
          </tr>
        ) : isError ? (
          <tr>
            <td colSpan="3" className="px-6 py-8 text-center text-red-500">Không thể tải dữ liệu (Error loading data).</td>
          </tr>
        ) : !Array.isArray(authors) || authors.length === 0 ? (
          <tr>
            <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No authors found.</td>
          </tr>
        ) : (
          authors.map((author) => (
            <tr key={author.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-5 font-semibold text-gray-900">
                {author.name}
              </td>
              <td className="px-6 py-5 text-gray-600 max-w-md truncate">
                {author.shortBio || 'No bio available'}
              </td>
              <td className="px-6 py-5 text-gray-600">
                {author.booksPublished || 0} Books
              </td>
            </tr>
          ))
        )}
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Author">
        <p className="text-gray-500 text-sm mb-6 -mt-4">
          Add a new author to the HAIBAZO database to start reviewing their works.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Author Name</label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="e.g. Jane Austen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Short Bio <span className="text-gray-400 font-normal">(Optional)</span></label>
            <textarea
              rows="3"
              placeholder="Brief description of the author..."
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20 resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Authors;
