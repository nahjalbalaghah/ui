'use client';
import React, { useState, useEffect } from 'react';
import { X, Search, Hash } from 'lucide-react';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import { postsApi, type Edition } from '@/api/posts';

interface SidebarFilterProps {
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
  selectedEdition?: string;
  onEditionChange?: (edition: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function SidebarFilter({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOptions,
  displayMode,
  setDisplayMode,
  onGoToNumber,
  totalItems,
  onSearch,
  selectedEdition = '',
  onEditionChange,
  isOpen,
  setIsOpen
}: SidebarFilterProps) {
  const [goToValue, setGoToValue] = useState('');
  const [editions, setEditions] = useState<Edition[]>([]);
  // Fetch editions on component mount
  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await postsApi.getEditions();
        setEditions(response.data);
      } catch (error) {
        console.error('Error fetching editions:', error);
      }
    };
    fetchEditions();
  }, []);

  const displayOptions = [
    { value: 'both', label: 'Both Titles' },
    { value: 'english-only', label: 'English Only' },
    { value: 'arabic-only', label: 'Arabic Only' },
  ];

  const editionOptions = editions.map(ed => ({
    value: ed.title,
    label: ed.title
  }));

  const handleGoTo = () => {
    const num = parseInt(goToValue, 10);
    if (num > 0 && onGoToNumber) {
      onGoToNumber(num);
      setGoToValue('');
      // Close sidebar after navigation
      setIsOpen(false);
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
      // Close sidebar after search
      setIsOpen(false);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
      // Close sidebar after search
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Hidden by default, shown only when open */}
      <div
        className={`fixed top-0 left-0 z-50 w-80 max-w-[90vw] h-screen bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Search Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Search
              </label>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  icon={<Search className="w-5 h-5 text-gray-400" />}
                  className="text-base"
                />
                <button
                  onClick={handleSearchClick}
                  className="w-full px-4 py-2.5 bg-[#43896B] text-white text-sm font-medium rounded-lg hover:bg-[#367556] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            {/* Edition Filter */}
            {editionOptions.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Edition
                </label>
                <Select
                  options={editionOptions}
                  value={selectedEdition}
                  onChange={(value) => {
                    onEditionChange?.(value);
                    setIsOpen(false);
                  }}
                  placeholder="Select edition"
                  className="w-full"
                />
              </div>
            )}

            {/* Display Mode Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Display Mode
              </label>
              <Select
                options={displayOptions}
                value={displayMode}
                onChange={(value) => setDisplayMode(value as 'both' | 'english-only' | 'arabic-only')}
                placeholder="Select display mode"
                className="w-full"
              />
            </div>

            {/* Sort By Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Sort By
              </label>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                placeholder="Select sort order"
                className="w-full"
              />
            </div>

            {/* Go to Number Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Go to Number
              </label>
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Hash className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={totalItems || undefined}
                    placeholder="Enter number"
                    value={goToValue}
                    onChange={(e) => setGoToValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-3 py-2.5 text-base border border-[#D7DEE9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43896B]/20 focus:border-[#43896B] transition-all duration-200 placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <button
                  onClick={handleGoTo}
                  disabled={!goToValue || parseInt(goToValue, 10) <= 0}
                  className="w-full px-4 py-2.5 bg-[#43896B] text-white text-sm font-medium rounded-lg hover:bg-[#367556] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
