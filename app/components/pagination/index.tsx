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
  // Google-style pagination: show pages around current page with ellipsis
  const getVisiblePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 10;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sliding window of 10 pages
      let start = Math.max(1, currentPage - 5);
      let end = Math.min(totalPages, start + 9);

      if (end - start < 9) {
        start = Math.max(1, end - 9);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
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
    <div className={`w-full ${className}`}>
      {/* Google-style pagination - centered layout */}
      <nav className="flex items-center justify-center" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${currentPage === 1 || loading
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-[#43896B] hover:text-[#367556] cursor-pointer'
            }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-2 text-sm text-gray-500 select-none">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  disabled={loading}
                  className={`min-w-[40px] px-3 py-2 text-sm font-medium transition-colors duration-200 ${loading
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                    } ${currentPage === page
                      ? 'text-[#43896B] border-b-2 border-[#43896B] font-semibold'
                      : 'text-gray-600 hover:text-[#43896B] border-b-2 border-transparent'
                    }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${currentPage === totalPages || loading
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-[#43896B] hover:text-[#367556] cursor-pointer'
            }`}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Page info - optional */}
      {showRange && (
        <div className="text-center mt-3 text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
}
