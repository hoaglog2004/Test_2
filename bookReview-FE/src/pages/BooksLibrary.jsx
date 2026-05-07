import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Eye, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import api from '../services/api';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import Button from '../components/common/Button';

const BooksLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [insight, setInsight] = useState({ totalBooks: 0 });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
  });

  useEffect(() => {
    fetchBooks();
    fetchInsight();
  }, []);

  const fetchBooks = async (page = 0) => {
    setLoading(true);
    setIsError(false);
    try {
      const response = await api.get(`/books?page=${page}&size=10`);
      // Spring Boot returns Page<T> which has a 'content' array
      const data = response.data;
      setBooks(data.content || data || []);
      setPagination({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || (Array.isArray(data) ? data.length : 0),
      });
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsight = async () => {
    try {
      const response = await api.get('/insights/library');
      setInsight(response.data);
    } catch (error) {
      console.error('Failed to fetch insight:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
        fetchInsight();
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Books Library</h1>
        <p className="text-gray-500 mt-2">Manage and organize your collection of books and reviews.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20"
          />
        </div>
        <Button variant="outline" className="gap-2 h-11">
          <Filter size={18} /> Filter
        </Button>
        <Button variant="outline" className="gap-2 h-11">
          <ArrowUpDown size={18} /> Sort
        </Button>
      </div>

      <div className="space-y-4">
        <Table headers={['NO.', 'BOOK TITLE', 'AUTHOR NAME', 'STATUS', 'ACTIONS']}>
          {loading ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-red-500">Không thể tải dữ liệu (Error loading data).</td>
            </tr>
          ) : !Array.isArray(books) || books.length === 0 ? (
             <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No books found.</td>
            </tr>
          ) : (
            books.map((book, index) => (
              <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 text-gray-500 w-16">
                  {String(pagination.currentPage * 10 + index + 1).padStart(2, '0')}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                      {book.coverImageUrl && (
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{book.title}</div>
                      {book.genre && (
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded mt-1 font-medium">
                          {book.genre}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-600">
                  {book.author?.name || 'Unknown'}
                </td>
                <td className="px-6 py-5">
                  <Badge status={book.status}>{book.status}</Badge>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDelete(book.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </Table>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {books.length > 0 ? pagination.currentPage * 10 + 1 : 0} to {pagination.currentPage * 10 + (Array.isArray(books) ? books.length : 0)} of {pagination.totalElements} entries</span>
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={fetchBooks} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center justify-between">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Library Insights</h3>
          <p className="text-gray-500 mb-4 leading-relaxed">
            Your collection has grown by 12% this month. Fiction remains the most popular genre among your reviews.
          </p>
          <a href="#" className="text-teal-900 font-medium hover:underline inline-flex items-center gap-1">
            View Analytics <ChevronRight size={16} />
          </a>
        </div>
        <div className="bg-teal-900 rounded-xl p-8 text-white text-center w-64 shadow-lg shadow-teal-900/20">
          <Sparkles className="mx-auto mb-3 text-teal-200" size={32} />
          <div className="text-4xl font-bold mb-1">{insight.totalBooks}</div>
          <div className="text-teal-100 text-sm font-medium tracking-wide">TOTAL BOOKS</div>
        </div>
      </div>
    </div>
  );
};


export default BooksLibrary;
