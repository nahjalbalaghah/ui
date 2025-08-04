'use client';
import React, { useState, useEffect } from 'react';
import TopFilterBar from './sections/top-filter-bar';
import LeftFilterSidebar from './sections/left-filter-sidebar';
import OrationsListing from './sections/orations-listing';
import { orationsApi, type Post } from '@/api/orations';

interface ActiveFilters {
  type: string[];
  translations: string[];
  themes: string[];
  difficulty: string[];
  length: string[];
  sortBy: string;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterOptions {
  type: FilterOption[];
  translations: FilterOption[];
  themes: FilterOption[];
  difficulty: FilterOption[];
  length: FilterOption[];
}

export default function OrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [orations, setOrations] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    type: [],
    translations: [],
    themes: [],
    difficulty: [],
    length: [],
    sortBy: ''
  });

  const loadOrations = async (page = 1, search = '', filters = activeFilters) => {
    try {
      setLoading(true);
      let response;
      
      if (search) {
        response = await orationsApi.searchOrations(search, page, 9);
      } else {
        response = await orationsApi.getOrations(page, 9);
      }

      let filteredData = response.data;

      if (filters.type.length > 0) {
        filteredData = filteredData.filter(oration => 
          filters.type.some(typeFilter => 
            oration.type.toLowerCase().includes(typeFilter.toLowerCase())
          )
        );
      }

      if (filters.translations.length > 0) {
        filteredData = filteredData.filter(oration => {
          if (filters.translations.includes('arabic')) {
            return true;
          }
          if (filters.translations.includes('english')) {
            return oration.translations && oration.translations.length > 0;
          }
          return false;
        });
      }

      if (sortBy) {
        filteredData = [...filteredData].sort((a, b) => {
          switch (sortBy) {
            case 'title-asc':
              return a.title.localeCompare(b.title);
            case 'title-desc':
              return b.title.localeCompare(a.title);
            case 'sermon-asc':
              return parseInt(a.sermonNumber || '0') - parseInt(b.sermonNumber || '0');
            case 'sermon-desc':
              return parseInt(b.sermonNumber || '0') - parseInt(a.sermonNumber || '0');
            default:
              return 0;
          }
        });
      }
      
      setOrations(filteredData);
      setCurrentPage(page);
      setTotalPages(response.meta.pagination.pageCount);
      setTotal(response.meta.pagination.total);
      setError(null);
    } catch (err) {
      setError('Failed to load orations. Please try again.');
      console.error('Error loading orations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrations();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
        loadOrations(1, searchTerm);
      } else {
        setCurrentPage(1);
        loadOrations(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    loadOrations(1, searchTerm, activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    setCurrentPage(1);
    loadOrations(1, searchTerm, activeFilters);
  }, [sortBy]);

  const sortOptions = [
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'sermon-asc', label: 'Sermon Number (Low to High)' },
    { value: 'sermon-desc', label: 'Sermon Number (High to Low)' },
    { value: 'relevance', label: 'Relevance' }
  ];

  const filterOptions: FilterOptions = {
    type: [
      { id: 'oration', label: 'Orations', count: Math.floor(total * 0.7) },
      { id: 'letter', label: 'Letters', count: Math.floor(total * 0.2) },
      { id: 'saying', label: 'Sayings', count: Math.floor(total * 0.1) }
    ],
    translations: [
      { id: 'arabic', label: 'Arabic Original', count: total },
      { id: 'english', label: 'English Translation', count: Math.floor(total * 0.9) },
      { id: 'urdu', label: 'Urdu Translation', count: Math.floor(total * 0.8) },
      { id: 'persian', label: 'Persian Translation', count: Math.floor(total * 0.6) }
    ],
    themes: [
      { id: 'governance', label: 'Governance & Justice', count: Math.floor(total * 0.3) },
      { id: 'spirituality', label: 'Spirituality & Faith', count: Math.floor(total * 0.4) },
      { id: 'wisdom', label: 'Wisdom & Knowledge', count: Math.floor(total * 0.35) },
      { id: 'ethics', label: 'Ethics & Morality', count: Math.floor(total * 0.25) },
      { id: 'society', label: 'Society & Community', count: Math.floor(total * 0.2) },
      { id: 'warfare', label: 'Warfare & Strategy', count: Math.floor(total * 0.15) }
    ],
    difficulty: [
      { id: 'beginner', label: 'Beginner Friendly', count: Math.floor(total * 0.3) },
      { id: 'intermediate', label: 'Intermediate', count: Math.floor(total * 0.5) },
      { id: 'advanced', label: 'Advanced Study', count: Math.floor(total * 0.2) }
    ],
    length: [
      { id: 'short', label: 'Short (< 500 words)', count: Math.floor(total * 0.4) },
      { id: 'medium', label: 'Medium (500-1500 words)', count: Math.floor(total * 0.4) },
      { id: 'long', label: 'Long (> 1500 words)', count: Math.floor(total * 0.2) }
    ]
  };

  const handleFilterChange = (
    category: keyof Pick<ActiveFilters, 'type' | 'translations' | 'themes' | 'difficulty' | 'length'>,
    id: string,
    checked: boolean
  ) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], id]
        : prev[category].filter((item: string) => item !== id)
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      type: [],
      translations: [],
      themes: [],
      difficulty: [],
      length: [],
      sortBy: ''
    });
  };

  const activeFilterCount = [
    ...activeFilters.type,
    ...activeFilters.translations,
    ...activeFilters.themes,
    ...activeFilters.difficulty,
    ...activeFilters.length
  ].length;

  const handleOrationsClick = (oration: Post) => {
    console.log('Oration clicked:', oration);
  };

  const handlePageChange = (page: number) => {
    loadOrations(page, searchTerm, activeFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => loadOrations()} 
            className="bg-[#43896B] text-white px-6 py-2 rounded-lg hover:bg-[#367556]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          sortOptions={sortOptions}
        />
        <div className="flex flex-col lg:flex-row gap-8">
          <LeftFilterSidebar
            showFilters={true}
            setShowFilters={() => {}}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            activeFilterCount={activeFilterCount}
            filterOptions={filterOptions}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
          />
          <OrationsListing
            orations={orations}
            onOrationsClick={handleOrationsClick}
            onPageChange={handlePageChange}
            loading={loading}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
