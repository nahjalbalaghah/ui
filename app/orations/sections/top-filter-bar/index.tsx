'use client';
import React, { useState } from 'react';
import { Search, Hash } from 'lucide-react';
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
  onGoToNumber?: (number: number) => void;
  totalItems?: number;
  onSearch?: () => void;
}

export default function TopFilterBar({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOptions,
  displayMode,
  setDisplayMode,
  onGoToNumber,
  totalItems,
  onSearch
}: TopFilterBarProps) {
  const [goToValue, setGoToValue] = useState('');

  const displayOptions = [
    { value: 'both', label: 'Both Titles' },
    { value: 'english-only', label: 'English Only' },
    { value: 'arabic-only', label: 'Arabic Only' },
  ];

  const handleGoTo = () => {
    const num = parseInt(goToValue, 10);
    if (num > 0 && onGoToNumber) {
      onGoToNumber(num);
      setGoToValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoTo();
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search orations, topics, or keywords..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              icon={<Search className="w-5 h-5 text-gray-400" />}
              className="text-base"
            />
          </div>
          <button
            onClick={handleSearchClick}
            className="px-4 py-2.5 bg-[#43896B] text-white text-sm font-medium rounded-lg hover:bg-[#367556] transition-all duration-200 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Go to # input */}
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none">
              <Hash className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="1"
              max={totalItems || undefined}
              placeholder="Go to #"
              value={goToValue}
              onChange={(e) => setGoToValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full lg:w-28 pl-10 pr-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43896B]/20 focus:border-[#43896B] transition-all duration-200 placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleGoTo}
              disabled={!goToValue || parseInt(goToValue, 10) <= 0}
              className="ml-2 px-3 py-2.5 bg-[#43896B] text-white text-sm font-medium rounded-lg hover:bg-[#367556] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Go
            </button>
          </div>
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