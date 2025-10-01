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
  const [displayMode, setDisplayMode] = useState<'both' | 'english-only' | 'arabic-only'>('both');
  const [content, setContent] = useState<Post[]>([]);
  const [allContent, setAllContent] = useState<Post[]>([]); // Store all content for client-side sorting
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false); // Smooth loading state
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [minLoadingTime, setMinLoadingTime] = useState(true);

  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
    if (search) {
      setSearchTerm(search);
    }
    if (sort) {
      setSortBy(sort);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const updateUrlParams = (page?: number, search?: string, sort?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (page === 1 || page === undefined) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    if (search === '' || search === undefined) {
      params.delete('search');
    } else {
      params.set('search', search);
    }
    
    if (sort === '' || sort === undefined) {
      params.delete('sort');
    } else {
      params.set('sort', sort);
    }
    
    router.replace(`/${config.contentType}?${params.toString()}`, { scroll: false });
  };

  const clientSideSearchFilter = (posts: Post[], searchQuery: string): Post[] => {
    if (!searchQuery || searchQuery.trim() === '') {
      return posts;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return posts.filter(post => {
      if (post.title?.toLowerCase().includes(query)) return true;
      
      if (post.heading?.toLowerCase().includes(query)) return true;
      
      if (post.translations && Array.isArray(post.translations)) {
        const matchesTranslation = post.translations.some(trans => 
          trans.text?.toLowerCase().includes(query)
        );
        if (matchesTranslation) return true;
      }
      
      if (post.paragraphs && Array.isArray(post.paragraphs)) {
        const matchesArabic = post.paragraphs.some(para => 
          para.arabic?.toLowerCase().includes(query)
        );
        if (matchesArabic) return true;
        
        const matchesParaTranslations = post.paragraphs.some(para => 
          para.translations?.some(trans => 
            trans.text?.toLowerCase().includes(query)
          )
        );
        if (matchesParaTranslations) return true;
      }
      
      return false;
    });
  };

  const loadContent = async (page = 1, search = '', updateUrl = true, append = false, forceFullLoad = false) => {
    try {
      if (!append) {
        if (content.length > 0 && !forceFullLoad) {
          setIsTransitioning(true);
        } else {
          setLoading(true);
          setIsTransitioning(false);
        }
      } else {
        setIsInfiniteLoading(true);
      }
      setError(null);
      
      let response;
      let allData: Post[] = [];
      
      if (sortBy && sortBy !== 'relevance' && !search) {
        const firstResponse = await config.api.getContent(1, 1000); // Large page size to get all
        if (!firstResponse || !firstResponse.data) {
          throw new Error('Invalid response format from API');
        }
        allData = firstResponse.data.filter(item => item.heading);
        
        const getDisplayNumber = (sermonNumber: string | null) => {
          if (!sermonNumber) return 0;
          const parts = sermonNumber.split('.');
          return parseInt(parts.length > 1 ? parts[1] : parts[0], 10) || 0;
        };
        
        allData.sort((a, b) => {
          switch (sortBy) {
            case 'sermon-asc':
              return getDisplayNumber(a.sermonNumber) - getDisplayNumber(b.sermonNumber);
            case 'sermon-desc':
              return getDisplayNumber(b.sermonNumber) - getDisplayNumber(a.sermonNumber);
            default:
              return 0;
          }
        });
        
        setAllContent(allData);
        
        const pageSize = 9;
        const totalItems = allData.length;
        const totalPagesCalc = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = allData.slice(startIndex, endIndex);
        
        if (append) {
          setContent(prevContent => [...prevContent, ...paginatedData]);
        } else {
          setContent(paginatedData);
        }
        
        setCurrentPage(page);
        setTotalPages(totalPagesCalc);
        setTotal(totalItems);
        setHasNextPage(page < totalPagesCalc);
        
      } else if (search) {
        // Search mode: fetch all data and apply client-side filtering
        const allDataResponse = await config.api.getContent(1, 1000);
        
        if (!allDataResponse || !allDataResponse.data) {
          throw new Error('Invalid response format from API');
        }

        // Filter items with heading first
        let filteredByHeading = allDataResponse.data.filter(item => item.heading);
        
        // Apply client-side search filter (includes translations.text)
        let searchResults = clientSideSearchFilter(filteredByHeading, search);
        
        // Sort if sortBy is active
        if (sortBy && sortBy !== 'relevance') {
          const getDisplayNumber = (sermonNumber: string | null) => {
            if (!sermonNumber) return 0;
            const parts = sermonNumber.split('.');
            return parseInt(parts.length > 1 ? parts[1] : parts[0], 10) || 0;
          };
          
          searchResults.sort((a, b) => {
            switch (sortBy) {
              case 'sermon-asc':
                return getDisplayNumber(a.sermonNumber) - getDisplayNumber(b.sermonNumber);
              case 'sermon-desc':
                return getDisplayNumber(b.sermonNumber) - getDisplayNumber(a.sermonNumber);
              default:
                return 0;
            }
          });
        }
        
        // Store all filtered results
        setAllContent(searchResults);
        
        // Paginate results
        const pageSize = 9;
        const totalItems = searchResults.length;
        const totalPagesCalc = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = searchResults.slice(startIndex, endIndex);
        
        if (append) {
          setContent(prevContent => [...prevContent, ...paginatedData]);
        } else {
          setContent(paginatedData);
        }
        
        setCurrentPage(page);
        setTotalPages(totalPagesCalc);
        setTotal(totalItems);
        setHasNextPage(page < totalPagesCalc);
        
      } else {
        // Normal mode: server-side pagination
        response = await config.api.getContent(page, 9);

        if (!response || !response.data) {
          throw new Error('Invalid response format from API');
        }

        let filteredData = response.data.filter(item => item.heading);
        
        if (append) {
          setContent(prevContent => [...prevContent, ...filteredData]);
        } else {
          setContent(filteredData);
        }
        
        setCurrentPage(page);
        setTotalPages(response.meta?.pagination?.pageCount || 1);
        setTotal(response.meta?.pagination?.total || filteredData.length);
        setHasNextPage(page < (response.meta?.pagination?.pageCount || 1));
      }
      
      // Update URL after state updates - use setTimeout to ensure state is committed
      if (updateUrl && !append) {
        setTimeout(() => {
          updateUrlParams(page, search, sortBy);
        }, 0);
      }
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'Request timeout. The server took too long to respond. Please try again.';
        } else if (err.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(`Failed to load ${config.contentType}: ${errorMessage}`);
      console.error(`Error loading ${config.contentType}:`, err);
      
      if (!append) {
        setContent([]);
      }
    } finally {
      // Smooth transition timing
      setTimeout(() => {
        setLoading(false);
        setIsTransitioning(false);
        setIsInfiniteLoading(false);
      }, 150);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isInfiniteLoading) {
      const nextPage = currentPage + 1;
      loadContent(nextPage, searchTerm, false, true);
    }
  };

  useEffect(() => {
    const page = searchParams.get('page');
    const initialPage = page ? parseInt(page, 10) : 1;
    loadContent(initialPage, searchTerm, false, false);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
        // loadContent will handle URL update after data is loaded
        loadContent(1, searchTerm, true, false);
      } else if (content.length > 0) {
        // Only reload if we had content before (meaning search was cleared)
        const page = searchParams.get('page');
        const currentPageFromUrl = page ? parseInt(page, 10) : 1;
        loadContent(currentPageFromUrl, '', true, false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    // Skip initial render - let the first useEffect handle initial load
    if (sortBy === '' && content.length === 0) {
      return;
    }
    
    // When sort changes, show loading immediately and reset to page 1
    setCurrentPage(1);
    setLoading(true);
    setContent([]); // Clear content immediately to show loading state
    setAllContent([]); // Clear cached content
    
    // loadContent will handle URL update after data is loaded
    loadContent(1, searchTerm, true, false, true);
  }, [sortBy]);

  const sortOptions = [
    { value: 'sermon-asc', label: 'Sermon Number (Ascending)' },
    { value: 'sermon-desc', label: 'Sermon Number (Descending)' },
    { value: 'relevance', label: 'Relevance' }
  ];

  const handlePageChange = (page: number) => {
    // When we have cached content (from sorting or search), do client-side pagination
    if (allContent.length > 0 && (sortBy || searchTerm)) {
      const pageSize = 9;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = allContent.slice(startIndex, endIndex);
      
      setContent(paginatedData);
      setCurrentPage(page);
      setHasNextPage(page < totalPages);
      updateUrlParams(page, searchTerm, sortBy);
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsTransitioning(true);
      loadContent(page, searchTerm, true, false);
    }
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
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />
        <div className="flex flex-col gap-8">
          {/* Show a subtle loading overlay when transitioning */}
          {isTransitioning && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#43896B] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
              Loading...
            </div>
          )}
          <ContentListing
            content={content}
            onPageChange={handlePageChange}
            onLoadMore={handleLoadMore}
            loading={loading || minLoadingTime}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            title={config.title}
            contentType={config.contentType}
            hasNextPage={hasNextPage}
            isInfiniteLoading={isInfiniteLoading}
            displayMode={displayMode}
            showTopPagination={true}
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
