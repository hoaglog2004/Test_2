import React from 'react';

const Badge = ({ children, status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'submitted':
        return 'text-teal-900';
      case 'draft':
        return 'text-orange-700';
      case 'archived':
        return 'text-gray-500';
      default:
        return 'text-gray-700';
    }
  };

  const getDotColor = () => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'submitted':
        return 'bg-teal-900';
      case 'draft':
        return 'bg-orange-600';
      case 'archived':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${getStatusStyles()}`}>
      <span className={`w-2 h-2 rounded-full ${getDotColor()}`}></span>
      {children}
    </span>
  );
};

export default Badge;
