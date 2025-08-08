'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopFilterBar from '../../orations/sections/top-filter-bar';
import LeftFilterSidebar from '../../orations/sections/left-filter-sidebar';
import ContentListing from './content-listing';
import { type Post, type ApiResponse } from '@/api/posts';

interface ContentPageConfig {
  contentType: 'orations' | 'letters' | 'sayings';
  title: string;
  subtitle: string;
  api: {
    getContent: (page?: number, pageSize?: number) => Promise<ApiResponse>;
    searchContent: (query: string, page?: number, pageSize?: number) => Promise<ApiResponse>;
  };
}

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

interface ContentPageProps {
  config: ContentPageConfig;
}

function ContentPageContent({ config }: ContentPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [content, setContent] = useState<Post[]>([]);
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

  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  const updatePageInUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.replace(`/${config.contentType}?${params.toString()}`, { scroll: false });
  };

  const loadContent = async (page = 1, search = '', filters = activeFilters, updateUrl = true) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (search) {
        response = await config.api.searchContent(search, page, 9);
      } else {
        response = await config.api.getContent(page, 9);
      }

      if (!response || !response.data) {
        throw new Error('Invalid response format from API');
      }

      let filteredData = response.data;

      filteredData = filteredData.filter(item => item.heading);

      if (filters.type.length > 0) {
        filteredData = filteredData.filter(item => 
          filters.type.some(typeFilter => 
            item.type.toLowerCase().includes(typeFilter.toLowerCase())
          )
        );
      }

      if (filters.translations.length > 0) {
        filteredData = filteredData.filter(item => {
          if (filters.translations.includes('arabic')) {
            return true;
          }
          if (filters.translations.includes('english')) {
            return item.translations && item.translations.length > 0;
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
      
      setContent(filteredData);
      setCurrentPage(page);
      setTotalPages(response.meta?.pagination?.pageCount || 1);
      setTotal(response.meta?.pagination?.total || filteredData.length);
      
      if (updateUrl) {
        updatePageInUrl(page);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to load ${config.contentType}: ${errorMessage}`);
      console.error(`Error loading ${config.contentType}:`, err);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = searchParams.get('page');
    const initialPage = page ? parseInt(page, 10) : 1;
    loadContent(initialPage, searchTerm, activeFilters, false);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
        loadContent(1, searchTerm, activeFilters, true);
      } else {
        const page = searchParams.get('page');
        const currentPageFromUrl = page ? parseInt(page, 10) : 1;
        loadContent(currentPageFromUrl, '', activeFilters, false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    loadContent(1, searchTerm, activeFilters, true);
  }, [activeFilters]);

  useEffect(() => {
    setCurrentPage(1);
    loadContent(1, searchTerm, activeFilters, true);
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

  const handleContentClick = (item: Post) => {
    // Navigation is handled by the ListingCard component using Next.js Link
    console.log(`${config.contentType} clicked:`, item);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    loadContent(page, searchTerm, activeFilters, true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading {config.title}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => loadContent()} 
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{config.title}</h1>
          <p className="text-lg text-gray-600">
            {config.subtitle}
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
          <ContentListing
            content={content}
            onContentClick={handleContentClick}
            onPageChange={handlePageChange}
            loading={loading}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            title={config.title}
            contentType={config.contentType}
          />
        </div>
      </div>
    </div>
  );
}

function ContentPageFallback({ config }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{config.title}</h1>
          <p className="text-lg text-gray-600">
            {config.subtitle}
          </p>
        </div>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-80">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentPage({ config }: ContentPageProps) {
  return (
    <Suspense fallback={<ContentPageFallback config={config} />}>
      <ContentPageContent config={config} />
    </Suspense>
  );
}
