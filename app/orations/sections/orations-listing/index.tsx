'use client';
import React from 'react';
import ListingCard from '@/app/components/cards/listing';
import Pagination from '@/app/components/pagination';
import { type Post } from '@/api/orations';

interface OrationsListingProps {
  orations: Post[];
  onOrationsClick?: (oration: Post) => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  total?: number;
  currentPage?: number;
  totalPages?: number;
  title?: string;
  subtitle?: string;
}

export default function OrationsListing({
  orations,
  onOrationsClick,
  onPageChange,
  loading = false,
  total = 0,
  currentPage = 1,
  totalPages = 1,
  title = "Orations",
  subtitle
}: OrationsListingProps) {
  return (
    <div className="lg:w-3/4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {subtitle || `Showing ${orations.length} of ${total} results`}
          </p>
        </div>
      </div>
      
      {loading && orations.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orations.map((oration) => (
              <ListingCard
                key={oration.id}
                oration={oration}
                onClick={() => onOrationsClick?.(oration)}
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
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
