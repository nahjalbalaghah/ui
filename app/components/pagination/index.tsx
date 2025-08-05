'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showRange?: boolean;
  className?: string;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showRange = true,
  className = '',
  loading = false
}: PaginationProps) {
  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (loading) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePageNumbers();

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          currentPage === 1 || loading
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-[#43896B] hover:border-[#43896B] hover:text-white cursor-pointer'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="flex items-center justify-center w-10 h-10 text-gray-500">
              ...
            </span>
          ) : (
            <button
              onClick={() => handlePageChange(page as number)}
              disabled={loading}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 font-medium ${
                loading 
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              } ${
                currentPage === page
                  ? 'bg-[#43896B] border-[#43896B] text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-[#43896B] hover:border-[#43896B] hover:text-white'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          currentPage === totalPages || loading
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-[#43896B] hover:border-[#43896B] hover:text-white cursor-pointer'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {showRange && (
        <div className="ml-4 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
}
