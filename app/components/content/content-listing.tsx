'use client';
import React from 'react';
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
  isInfiniteLoading = false
}: ContentListingProps) {
  const { lastElementRef } = useInfiniteScroll({
    hasNextPage,
    isLoading: isInfiniteLoading,
    loadMore: onLoadMore || (() => {}),
    threshold: 300
  });

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

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {loading ? "Loading..." : (subtitle || `Showing ${content.length} of ${total} results`)}
        </p>
      </div>
      {loading ? (
        renderLoadingList()
      ) : (
        <>
          {renderListView()}
          {isInfiniteLoading && (
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
          {totalPages > 1 && onPageChange && (
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
