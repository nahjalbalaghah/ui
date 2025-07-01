'use client';
import React from 'react';
import Button from '@/app/components/button';
import ListingCard from '@/app/components/cards/listing';

interface Sermon {
  id: number;
  title: string;
  arabicTitle: string;
  description: string;
  chapter: number;
  type: string;
  date: string;
}

interface SermonListingProps {
  sermons: Sermon[];
  onSermonClick?: (sermon: Sermon) => void;
  onLoadMore?: () => void;
  showLoadMore?: boolean;
  title?: string;
  subtitle?: string;
}

export default function SermonListing({
  sermons,
  onSermonClick,
  onLoadMore,
  showLoadMore = true,
  title = "Chapters",
  subtitle
}: SermonListingProps) {
  return (
    <div className="lg:w-3/4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {subtitle || `Showing ${sermons.length} results`}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {sermons.map((sermon) => (
          <ListingCard
            key={sermon.id}
            sermon={sermon}
            onClick={() => onSermonClick?.(sermon)}
          />
        ))}
      </div>
      {showLoadMore && (
        <div className="text-center mt-12">
          <Button 
            variant="outlined" 
            className="px-8"
            onClick={onLoadMore}
          >
            Load More Sermons
          </Button>
        </div>
      )}
    </div>
  );
}