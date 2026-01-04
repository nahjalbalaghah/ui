'use client';
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, ChevronLeft, ChevronRight, Grid3x3, Image as ImageIcon } from 'lucide-react';

type ViewMode = 'single' | 'gallery';

interface ManuscriptViewerProps {
  pages: (string | null)[];
  bookName: string;
}

const MissingPagePlaceholder: React.FC<{ pageNumber: number }> = ({ pageNumber }) => (
  <div className="flex items-center justify-center bg-gray-100 min-h-[400px] lg:min-h-[600px] rounded-lg">
    <div className="text-center p-8">
      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Page Missing</h3>
      <p className="text-gray-500">This page is missing from this manuscript.</p>
      <p className="text-sm text-gray-400 mt-2">Page {pageNumber}</p>
    </div>
  </div>
);

const ManuscriptViewer: React.FC<ManuscriptViewerProps> = ({ pages, bookName }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(50, prev - 25));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => prev === 'single' ? 'gallery' : 'single');
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentPage(index);
    if (viewMode === 'gallery') {
      setViewMode('single');
    }
  };

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleExpand}
        />
      )}
      
      <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded ? 'fixed inset-4 z-50 animate-expand' : 'relative'
      }`}
      style={{
        transform: isExpanded ? 'scale(1)' : 'scale(1)',
        opacity: isExpanded ? 1 : 1
      }}>
        <div className="bg-[#F5F6FA] border-b border-[#E2E3E9] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleViewMode}
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              viewMode === 'gallery' ? 'bg-[#43896B] text-white' : 'hover:bg-white text-gray-700'
            }`}
            aria-label={viewMode === 'gallery' ? 'Single page view' : 'Gallery view'}
          >
            {viewMode === 'gallery' ? <ImageIcon className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleExpand}
            className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"
            aria-label={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? (
              <Minimize2 className="w-5 h-5 text-gray-700" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row h-full">
        <div className="lg:w-24 bg-[#F5F6FA] border-b lg:border-b-0 lg:border-r border-[#E2E3E9] p-2 overflow-y-auto">
          <div className="flex lg:flex-col gap-2">
              {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  currentPage === index
                    ? 'border-[#43896B] shadow-md'
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-label={`Page ${index + 1}`}
              >
                {page ? (
                  <img
                    src={page}
                    alt={`Page ${index + 1} thumbnail`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/file.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-white">
          {viewMode === 'single' ? (
            pages[currentPage] ? (
              <div className="flex items-center justify-center min-h-[400px] lg:min-h-[600px] p-4">
                <div
                  className="relative bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-300"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center'
                  }}
                >
                  <img
                    src={pages[currentPage]}
                    alt={`${bookName} - Page ${currentPage + 1}`}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            ) : (
              <MissingPagePlaceholder pageNumber={currentPage + 1} />
            )
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {pages.map((page, index) => (
                <div
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className="relative group rounded-lg overflow-hidden transition-all cursor-pointer bg-gray-100"
                >
                  {page ? (
                    <>
                      <img
                        src={page}
                        alt={`${bookName} - Page ${index + 1}`}
                        className="w-full h-auto block"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          console.error('Image failed to load:', page);
                          // Replace failed remote image with a local fallback
                          target.onerror = null;
                          target.src = '/file.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center pointer-events-none">
                        <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                          Page {index + 1}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-[3/4] flex items-center justify-center bg-gray-200">
                      <div className="text-center p-4">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs text-gray-500 font-medium">Page {index + 1}</p>
                        <p className="text-xs text-gray-400">Missing</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {viewMode === 'single' && (
        <div className="bg-[#F5F6FA] border-t border-[#E2E3E9] px-4 py-3 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Previous</span>
          </button>

          <div className="text-sm font-medium text-gray-700">
            Page {currentPage + 1} of {pages.length}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default ManuscriptViewer;
