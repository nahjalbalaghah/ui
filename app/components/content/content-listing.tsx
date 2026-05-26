'use client';
import React, { useState, useEffect } from 'react';
import ListViewItem from '@/app/components/list-view-item';
import Pagination from '@/app/components/pagination';
import { type Post } from '@/api/posts';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';

interface ContentListingProps {
  content: Post[];
  onPageChange?: (page: number) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  total?: number;
  currentPage?: number;
  totalPages?: number;
  title?: string;
  subtitle?: string;
  contentType: 'orations' | 'letters' | 'sayings';
  hasNextPage?: boolean;
  isInfiniteLoading?: boolean;
  isTransitioning?: boolean;
  displayMode?: 'both' | 'english-only' | 'arabic-only';
  listingParams?: {
    page?: string;
    search?: string;
    sort?: string;
    edition?: string;
    display?: string;
  };
  showTopPagination?: boolean;
}

export default function ContentListing({
  content,
  onPageChange,
  onLoadMore,
  loading = false,
  total = 0,
  currentPage = 1,
  totalPages = 1,
  title = "Content",
  subtitle,
  contentType,
  hasNextPage = false,
  isInfiniteLoading = false,
  isTransitioning = false,
  displayMode = 'both',
  listingParams,
  showTopPagination = false
}: ContentListingProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { lastElementRef } = useInfiniteScroll({
    hasNextPage,
    isLoading: isInfiniteLoading,
    loadMore: onLoadMore || (() => { }),
    threshold: 300
  });

  const renderListView = () => (
    <div className="space-y-4">
      {content.map((item, index) => (
        <div
          key={index}
          ref={index === content.length - 1 && isMobile ? lastElementRef : undefined}
        >
          <ListViewItem item={item} contentType={contentType} displayMode={displayMode} listingParams={listingParams} />
        </div>
      ))}
    </div>
  );

  const renderLoadingList = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="flex items-center gap-0">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl rounded-r-none"></div>
            <div className="grow py-6 pr-6 pl-8">
              <div className="flex items-center justify-between">
                <div className="grow">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const showInitialSkeleton = loading && content.length === 0;
  const showTransitionOverlay = isTransitioning && content.length > 0;

  return (
    <div className="w-full relative">
      <div className="flex flex-col items-center justify-center mb-10 gap-4">
        {/* Show pagination only on desktop at top */}
        {showTopPagination && totalPages > 1 && onPageChange && (
          <div className="w-full flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showRange={false}
              loading={loading}
            />
          </div>
        )}

        <p className="text-gray-500 text-sm whitespace-nowrap shrink-0">
          {showInitialSkeleton ? 'Loading content...' : (subtitle || `Showing ${content.length} of ${total} results`)}
        </p>
      </div>
      {showInitialSkeleton ? (
        renderLoadingList()
      ) : (
        <div className="relative">
          {showTransitionOverlay && (
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-white/55 backdrop-blur-[1px]">
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#43896B]" />
                Updating results...
              </div>
            </div>
          )}
          {renderListView()}
          {/* Show loading indicator on mobile for infinite scroll */}
          {isInfiniteLoading && (
            <div className="mt-8 lg:hidden">
              <div className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl rounded-r-none"></div>
                    <div className="grow py-6 pr-6 pl-8">
                      <div className="flex items-center justify-between">
                        <div className="grow">
                          <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full ml-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Show pagination at bottom on desktop only */}
          {totalPages > 1 && onPageChange && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showRange={false}
                loading={loading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
