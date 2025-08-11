'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TopFilterBar from '../../orations/sections/top-filter-bar';
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

  const loadContent = async (page = 1, search = '', updateUrl = true) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (search) {
        response = await config.api.searchContent(search, page, 12);
      } else {
        response = await config.api.getContent(page, 12);
      }

      if (!response || !response.data) {
        throw new Error('Invalid response format from API');
      }

      let filteredData = response.data;

      // Filter out items without heading
      filteredData = filteredData.filter(item => item.heading);

      // Apply sorting if specified
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
    loadContent(initialPage, searchTerm, false);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
        loadContent(1, searchTerm, true);
      } else {
        const page = searchParams.get('page');
        const currentPageFromUrl = page ? parseInt(page, 10) : 1;
        loadContent(currentPageFromUrl, '', false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    loadContent(1, searchTerm, true);
  }, [sortBy]);

  const sortOptions = [
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'sermon-asc', label: 'Sermon Number (Low to High)' },
    { value: 'sermon-desc', label: 'Sermon Number (High to Low)' },
    { value: 'relevance', label: 'Relevance' }
  ];

  const handlePageChange = (page: number) => {
    setLoading(true);
    loadContent(page, searchTerm, true);
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
        <div className="flex flex-col gap-8">
          <ContentListing
            content={content}
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
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
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
