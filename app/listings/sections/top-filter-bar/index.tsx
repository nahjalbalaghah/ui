'use client';
import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import Button from '@/app/components/button';

interface TopFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  activeFilterCount: number;
  sortOptions: Array<{ value: string; label: string }>;
}

export default function TopFilterBar({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  activeFilterCount,
  sortOptions
}: TopFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search sermons, topics, or keywords..."
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5 text-gray-400" />}
            className="text-base"
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort By"
            className="min-w-[160px]"
          />
          <Button
            variant="outlined"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-4 h-4" />}
            className={`relative ${showFilters ? 'bg-[#43896B] text-white border-[#43896B]' : ''}`}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}