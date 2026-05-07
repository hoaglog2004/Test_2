import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          {title && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {/* Optional description slot if passed within title or children */}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
