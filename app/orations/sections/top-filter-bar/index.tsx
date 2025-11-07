'use client';
import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/app/components/input';
import Select from '@/app/components/select';

interface TopFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOptions: Array<{ value: string; label: string }>;
  displayMode: 'both' | 'english-only' | 'arabic-only';
  setDisplayMode: (value: 'both' | 'english-only' | 'arabic-only') => void;
}

export default function TopFilterBar({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOptions,
  displayMode,
  setDisplayMode
}: TopFilterBarProps) {
  const displayOptions = [
    { value: 'both', label: 'Both Titles' },
    { value: 'english-only', label: 'English Only' },
    { value: 'arabic-only', label: 'Arabic Only' },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orations, topics, or keywords..."
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5 text-gray-400" />}
            className="text-base"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          <Select
            options={displayOptions}
            value={displayMode}
            onChange={(value) => setDisplayMode(value as 'both' | 'english-only' | 'arabic-only')}
            placeholder="Display"
            className="w-full lg:w-40"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort By"
            className="w-full lg:w-60"
          />
        </div>
      </div>
    </div>
  );
}