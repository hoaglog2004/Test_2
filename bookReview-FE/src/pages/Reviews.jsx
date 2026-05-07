import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Plus } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async (page = 0) => {
    setLoading(true);
    setIsError(false);
    try {
      const response = await api.get(`/reviews/all?page=${page}&size=10`);
      const data = response.data;
      setReviews(data.content || data || []);
      setPagination({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || (Array.isArray(data) ? data.length : 0),
      });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Reviews</h1>
          <p className="text-gray-500 mt-2">Manage all the reviews submitted by readers across the platform.</p>
        </div>
        <Link to="/reviews/new">
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Add New Review
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <Table headers={['NO.', 'REVIEW CONTENT', 'RATING', 'STATUS', 'ACTIONS']}>
          {loading ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-red-500">Không thể tải dữ liệu (Error loading data).</td>
            </tr>
          ) : !Array.isArray(reviews) || reviews.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No reviews found.</td>
            </tr>
          ) : (
            reviews.map((review, index) => (
              <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-gray-500 w-16">
                  {String(pagination.currentPage * 10 + index + 1).padStart(2, '0')}
                </td>
                <td className="px-6 py-5">
                  <div className="max-w-md">
                    <p className="text-gray-900 font-medium truncate mb-1">
                      {review.content}
                    </p>
                    <div className="flex gap-2">
                      {review.tags?.map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {renderStars(review.rating)}
                </td>
                <td className="px-6 py-5">
                  <Badge status={review.status}>{review.status}</Badge>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-teal-600 transition-colors">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {reviews.length > 0 ? pagination.currentPage * 10 + 1 : 0} to{' '}
            {pagination.currentPage * 10 + (Array.isArray(reviews) ? reviews.length : 0)} of{' '}
            {pagination.totalElements} entries
          </span>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={fetchReviews}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
