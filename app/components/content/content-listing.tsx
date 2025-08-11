'use client';
import React from 'react';
import ListingCard from '@/app/components/cards/listing';
import Pagination from '@/app/components/pagination';
import { type Post } from '@/api/posts';

interface ContentListingProps {
  content: Post[];
  onPageChange?: (page: number) => void;
  loading?: boolean;
  total?: number;
  currentPage?: number;
  totalPages?: number;
  title?: string;
  subtitle?: string;
  contentType: 'orations' | 'letters' | 'sayings';
}

export default function ContentListing({
  content,
  onPageChange,
  loading = false,
  total = 0,
  currentPage = 1,
  totalPages = 1,
  title = "Content",
  subtitle,
  contentType
}: ContentListingProps) {
  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {loading ? "Loading..." : (subtitle || `Showing ${content.length} of ${total} results`)}
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
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
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {content.map((item) => (
              <ListingCard
                key={item.id}
                oration={item}
                contentType={contentType}
              />
            ))}
          </div>
          
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
