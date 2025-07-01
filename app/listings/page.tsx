'use client';
import React, { useState } from 'react';
import TopFilterBar from './sections/top-filter-bar';
import LeftFilterSidebar from './sections/left-filter-sidebar';
import SermonListing from './sections/sermon-listing';
import { sermons } from '../data';

interface ActiveFilters {
  objectType: string[];
  language: string[];
  collection: string[];
  project: string[];
  fullyDigitized: boolean;
  hasMusicalNotations: boolean;
  dateRange: [number, number];
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterOptions {
  objectType: FilterOption[];
  language: FilterOption[];
  collection: FilterOption[];
  project: FilterOption[];
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    objectType: [],
    language: [],
    collection: [],
    project: [],
    fullyDigitized: false,
    hasMusicalNotations: false,
    dateRange: [700, 1900]
  });

  const sortOptions = [
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'chapter-asc', label: 'Chapter (Low to High)' },
    { value: 'chapter-desc', label: 'Chapter (High to Low)' },
    { value: 'relevance', label: 'Relevance' }
  ];

  const filterOptions: FilterOptions = {
    objectType: [
      { id: 'manuscripts', label: 'Archives and Manuscripts', count: 12 },
      { id: 'maps', label: 'Maps', count: 12 }
    ],
    language: [
      { id: 'arabic', label: 'Arabic', count: 12 },
      { id: 'urdu', label: 'Urdu', count: 12 }
    ],
    collection: [
      { id: 'arabic-manuscripts', label: 'Arabic Manuscripts and Maps', count: 12 },
      { id: 'hebrew-manuscripts', label: 'Hebrew Manuscripts and Printed Books', count: 12 },
      { id: 'masterpieces', label: 'Masterpieces of the Non-Western Book', count: 12 },
      { id: 'archiox', label: 'ARCHiOx: Analysis and Recording of Cultural Heritage in Oxford', count: 12 }
    ],
    project: [
      { id: 'masterpieces-project', label: 'Masterpieces of the Non-Western Book', count: 12 }
    ]
  };

  const handleFilterChange = (
    category: keyof Pick<ActiveFilters, 'objectType' | 'language' | 'collection' | 'project'>,
    id: string,
    checked: boolean
  ) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], id]
        : prev[category].filter(item => item !== id)
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      objectType: [],
      language: [],
      collection: [],
      project: [],
      fullyDigitized: false,
      hasMusicalNotations: false,
      dateRange: [700, 1900]
    });
  };

  const activeFilterCount = [
    ...activeFilters.objectType,
    ...activeFilters.language,
    ...activeFilters.collection,
    ...activeFilters.project
  ].length + 
  (activeFilters.fullyDigitized ? 1 : 0) + 
  (activeFilters.hasMusicalNotations ? 1 : 0);

  const handleSermonClick = (sermon: any) => {
    console.log('Sermon clicked:', sermon);
  };

  const handleLoadMore = () => {
    console.log('Load more clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Orations (Sermons)</h1>
          <p className="text-lg text-gray-600">
            The powerful orations of Imam Ali, addressing justice, society, and spirituality with profound wisdom and eloquence.
          </p>
        </div>
        <TopFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFilterCount={activeFilterCount}
          sortOptions={sortOptions}
        />
        <div className="flex flex-col lg:flex-row gap-8">
          <LeftFilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            activeFilterCount={activeFilterCount}
            filterOptions={filterOptions}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />
          <SermonListing
            sermons={sermons}
            onSermonClick={handleSermonClick}
            onLoadMore={handleLoadMore}
            showLoadMore={true}
          />
        </div>
      </div>
    </div>
  );
}