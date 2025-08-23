'use client';
import React from 'react';
import ListingCard from '@/app/components/cards/listing';
import ListViewItem from '@/app/components/list-view-item';
import Pagination from '@/app/components/pagination';
import ViewToggle from '@/app/components/view-toggle';
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
  view: 'grid' | 'list';
  hasNextPage?: boolean;
  isInfiniteLoading?: boolean;
  onViewChange?: (view: 'grid' | 'list') => void;
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
  view = 'grid',
  hasNextPage = false,
  isInfiniteLoading = false,
  onViewChange
}: ContentListingProps) {
  const { lastElementRef } = useInfiniteScroll({
    hasNextPage,
    isLoading: isInfiniteLoading,
    loadMore: onLoadMore || (() => {}),
    threshold: 300
  });

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {content.map((item) => (
        <ListingCard
          key={item.id}
          oration={item}
          contentType={contentType}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {content.map((item, index) => (
        <div
          key={index}
          ref={index === content.length - 1 ? lastElementRef : undefined}
        >
          <ListViewItem item={item} contentType={contentType} />
        </div>
      ))}
    </div>
  );

  const renderLoadingGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {[...Array(12)].map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="h-40 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-5 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-3/5"></div>
            <div className="flex gap-2 mt-3">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
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
            <div className="flex-grow py-6 pr-6 pl-8">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
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

  const isOrationsListOnly = (contentType === 'orations');
  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {loading ? "Loading..." : (subtitle || `Showing ${content.length} of ${total} results`)}
        </p>
        {!isOrationsListOnly && onViewChange && (
          <ViewToggle view={view} onViewChange={onViewChange} />
        )}
      </div>
      {loading ? (
        isOrationsListOnly ? renderLoadingList() : (view === 'grid' ? renderLoadingGrid() : renderLoadingList())
      ) : (
        <>
          {isOrationsListOnly ? renderListView() : (view === 'grid' ? renderGridView() : renderListView())}
          {view === 'list' && isInfiniteLoading && (
            <div className="mt-8">
              <div className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl rounded-r-none"></div>
                    <div className="flex-grow py-6 pr-6 pl-8">
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
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
          {view === 'grid' && totalPages > 1 && onPageChange && !isOrationsListOnly && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showRange={true}
                loading={loading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
