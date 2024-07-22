// src/components/Pagination.tsx

'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalCoins: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalCoins, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalCoins / itemsPerPage);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button 
        onClick={handlePreviousClick} 
        disabled={currentPage === 1}
        className="bg-gray-500 text-white px-4 py-2 rounded mx-2 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-lg">{currentPage} / {totalPages}</span>
      <button 
        onClick={handleNextClick} 
        disabled={currentPage >= totalPages}
        className="bg-gray-500 text-white px-4 py-2 rounded mx-2 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
