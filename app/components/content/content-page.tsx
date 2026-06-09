'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, Search } from 'lucide-react';
import SidebarFilter from '@/app/components/sidebar-filter';
import ContentListing from './content-listing';
import { type Post, type ApiResponse } from '@/api/posts';

import { normalizeTextForSearch } from '@/app/utils/text-formatting';

interface ContentPageConfig {
  contentType: 'orations' | 'letters' | 'sayings';
  title: string;
  subtitle: string;
  api: {
    getContent: (page?: number, pageSize?: number, editionTitle?: string) => Promise<ApiResponse>;
    searchContent: (query: string, page?: number, pageSize?: number, editionTitle?: string) => Promise<ApiResponse>;
  };
  tocArabic?: string;
  tocEnglish?: string;
}

interface ContentPageProps {
  config: ContentPageConfig;
}

function ContentPageContent({ config }: ContentPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(() => searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'sermon-asc');
  const [selectedEdition, setSelectedEdition] = useState(() => searchParams.get('edition') || 'Qutbuddin');
  const [displayMode, setDisplayMode] = useState<'both' | 'english-only' | 'arabic-only'>(() => {
    const raw = searchParams.get('display');
    if (raw === 'english-only' || raw === 'arabic-only' || raw === 'both') return raw;
    return 'both';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [content, setContent] = useState<Post[]>([]);
  const [allContent, setAllContent] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [minLoadingTime, setMinLoadingTime] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRestoringState, setIsRestoringState] = useState(false);

  const aboutEditionHref = selectedEdition
    ? `/editions/about?edition=${encodeURIComponent(selectedEdition)}`
    : '/editions/about';

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTime(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const updateUrlParams = (page?: number, search?: string, sort?: string, edition?: string, display?: string) => {
    const params = new URLSearchParams();

    // Use current state if parameters not provided
    const currentSearch = search !== undefined ? search : appliedSearchTerm;
    const currentSort = sort !== undefined ? sort : sortBy;
    const currentEdition = edition !== undefined ? edition : selectedEdition;
    const currentPageNum = page !== undefined ? page : currentPage;
    const currentDisplay = display !== undefined ? display : displayMode;

    if (currentPageNum && currentPageNum !== 1) {
      params.set('page', currentPageNum.toString());
    }

    if (currentSearch && currentSearch !== '') {
      params.set('search', currentSearch);
    }

    if (currentSort && currentSort !== '') {
      params.set('sort', currentSort);
    }

    if (currentEdition && currentEdition !== '') {
      params.set('edition', currentEdition);
    }

    if (currentDisplay && currentDisplay !== 'both') {
      params.set('display', currentDisplay);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/${config.contentType}?${queryString}` : `/${config.contentType}`;

    // Use window.history.pushState to avoid unnecessary re-renders
    window.history.pushState(null, '', newUrl);
  };

  const clientSideSearchFilter = (posts: Post[], searchQuery: string): Post[] => {
    if (!searchQuery || searchQuery.trim() === '') {
      return posts;
    }

    const query = normalizeTextForSearch(searchQuery);

    return posts.filter(post => {
      if (normalizeTextForSearch(post.title || '').includes(query)) return true;

      if (normalizeTextForSearch(post.heading || '').includes(query)) return true;

      if (post.translations && Array.isArray(post.translations)) {
        const matchesTranslation = post.translations.some(trans =>
          normalizeTextForSearch(trans.text || '').includes(query)
        );
        if (matchesTranslation) return true;
      }

      if (post.paragraphs && Array.isArray(post.paragraphs)) {
        const matchesArabic = post.paragraphs.some(para =>
          normalizeTextForSearch(para.arabic || '').includes(query)
        );
        if (matchesArabic) return true;

        const matchesParaTranslations = post.paragraphs.some(para =>
          para.translations?.some(trans =>
            normalizeTextForSearch(trans.text || '').includes(query)
          )
        );
        if (matchesParaTranslations) return true;
      }

      return false;
    });
  };

  // Helper function to fetch all content with pagination handling
  const fetchAllContent = async (): Promise<Post[]> => {
    const batchSize = 100; // Strapi typically limits to 100 per request
    let currentPage = 1;
    let hasMore = true;
    const allData: Post[] = [];

    while (hasMore) {
      const response = await config.api.getContent(currentPage, batchSize, selectedEdition);
      if (!response || !response.data) {
        break;
      }

      const filteredData = response.data.filter(item => item.heading);
      allData.push(...filteredData);

      // Check if there are more pages
      const totalPages = response.meta?.pagination?.pageCount || 1;
      hasMore = currentPage < totalPages;
      currentPage++;
    }

    return allData;
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
        allData = await fetchAllContent();
        if (allData.length === 0) {
          throw new Error('Invalid response format from API');
        }

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

        const pageSize = 15;
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
        const fetchedData = await fetchAllContent();

        if (fetchedData.length === 0) {
          throw new Error('Invalid response format from API');
        }

        // Apply client-side search filter (includes translations.text)
        let searchResults = clientSideSearchFilter(fetchedData, search);

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
        const pageSize = 15;
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
        response = await config.api.getContent(page, 15, selectedEdition);

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

      // Update URL after state updates
      if (updateUrl && !append) {
        updateUrlParams(page, search, sortBy, selectedEdition, displayMode);
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

  // Sync URL params to state when navigating back (e.g., browser back button)
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const edition = searchParams.get('edition');
    const display = searchParams.get('display');

    const urlPage = page ? parseInt(page, 10) : 1;
    const urlSearch = search || '';
    const urlSort = sort || 'sermon-asc';
    const urlEdition = edition || 'Qutbuddin';
    const urlDisplay = display === 'english-only' || display === 'arabic-only' || display === 'both' ? display : 'both';

    // Check if URL params differ from current state
    const stateChanged =
      urlPage !== currentPage ||
      urlSearch !== searchTerm ||
      urlSort !== sortBy ||
      urlEdition !== selectedEdition ||
      urlDisplay !== displayMode;

    if (isInitialized && stateChanged) {
      // User navigated back/forward, restore state from URL
      setIsRestoringState(true);
      setSearchTerm(urlSearch);
      setAppliedSearchTerm(urlSearch);
      setSortBy(urlSort);
      setSelectedEdition(urlEdition);
      setDisplayMode(urlDisplay);
      setCurrentPage(urlPage);

      // Load content with URL parameters
      loadContent(urlPage, urlSearch, false, false).finally(() => {
        setIsRestoringState(false);
      });
    } else if (!isInitialized) {
      // Initial load
      setDisplayMode(urlDisplay);
      setAppliedSearchTerm(urlSearch);
      loadContent(urlPage, urlSearch, false, false).finally(() => {
        setIsInitialized(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Manual search handler (triggered by search button)
  const handleSearch = () => {
    setCurrentPage(1);
    setAllContent([]); // Clear cached content to force fresh search
    setAppliedSearchTerm(searchTerm);
    loadContent(1, searchTerm, true, false);
  };

  // Handle sort changes
  useEffect(() => {
    if (!isInitialized || isRestoringState) return;

    setCurrentPage(1);
    setLoading(true);
    setContent([]);
    setAllContent([]);

    loadContent(1, appliedSearchTerm, true, false, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, selectedEdition]);

  useEffect(() => {
    if (!isInitialized || isRestoringState) return;
    updateUrlParams(currentPage, undefined, undefined, undefined, displayMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayMode]);

  const sortOptions = [
    { value: 'sermon-asc', label: 'Sermon Number (Ascending)' },
    { value: 'sermon-desc', label: 'Sermon Number (Descending)' },
    { value: 'relevance', label: 'Relevance' }
  ];

  const handlePageChange = (page: number) => {
    if (allContent.length > 0 && (sortBy || searchTerm)) {
      const pageSize = 15;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = allContent.slice(startIndex, endIndex);

      setContent(paginatedData);
      setCurrentPage(page);
      setHasNextPage(page < totalPages);
      updateUrlParams(page, appliedSearchTerm, sortBy, selectedEdition, displayMode);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsTransitioning(true);
      loadContent(page, searchTerm, true, false);
    }
  };

  const handleGoToNumber = async (targetNumber: number) => {
    // Validate the number is within range
    if (targetNumber < 1) {
      return;
    }

    const pageSize = 15;

    // Helper function to get display number from sermon number
    const getDisplayNumber = (sermonNumber: string | null) => {
      if (!sermonNumber) return 0;
      const parts = sermonNumber.split('.');
      return parseInt(parts.length > 1 ? parts[1] : parts[0], 10) || 0;
    };

    // Function to scroll to the card once it's rendered
    const scrollToCard = (attempts = 0) => {
      const cardElement = document.getElementById(`listing-${targetNumber}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a brief highlight effect
        cardElement.classList.add('ring-2', 'ring-[#43896B]', 'ring-offset-2');
        setTimeout(() => {
          cardElement.classList.remove('ring-2', 'ring-[#43896B]', 'ring-offset-2');
        }, 2000);
      } else if (attempts < 50) {
        // Retry up to 50 times (5 seconds total) to handle slower page loads
        setTimeout(() => scrollToCard(attempts + 1), 100);
      }
    };

    setIsTransitioning(true);

    try {
      // We need all content to find the item position
      let dataToSearch: Post[] = [];

      if (allContent.length > 0) {
        // Already have all content loaded (sorted/searched mode)
        dataToSearch = allContent;
      } else {
        // Need to fetch all content - fetch in batches to handle API pagination limits
        const fetchedData = await fetchAllContent();

        if (fetchedData.length === 0) {
          setIsTransitioning(false);
          return;
        }

        dataToSearch = fetchedData;

        // Sort by sermon number ascending (default order)
        dataToSearch.sort((a, b) => getDisplayNumber(a.sermonNumber) - getDisplayNumber(b.sermonNumber));

        // Store for future use
        setAllContent(dataToSearch);
      }

      // Find the index of the item with the target sermon number
      const itemIndex = dataToSearch.findIndex(item => getDisplayNumber(item.sermonNumber) === targetNumber);

      if (itemIndex === -1) {
        // Item not found
        setIsTransitioning(false);
        return;
      }

      // Calculate which page this item is on (1-based)
      const targetPage = Math.floor(itemIndex / pageSize) + 1;

      // Get the paginated data for this page
      const startIndex = (targetPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = dataToSearch.slice(startIndex, endIndex);

      // Update state
      setContent(paginatedData);
      setCurrentPage(targetPage);
      setTotalPages(Math.ceil(dataToSearch.length / pageSize));
      setTotal(dataToSearch.length);
      setHasNextPage(targetPage < Math.ceil(dataToSearch.length / pageSize));
      updateUrlParams(targetPage, appliedSearchTerm, sortBy, selectedEdition, displayMode);

      // Wait for React to render the new content, then scroll
      requestAnimationFrame(() => {
        setTimeout(() => scrollToCard(), 100);
      });
    } catch (err) {
      console.error('Error in handleGoToNumber:', err);
    } finally {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
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
        </div>

        {(config.tocArabic || config.tocEnglish) && (
          <div className="mb-10">
            <div className="flex flex-col">
              {config.tocArabic && (
                <div className="text-right">
                  <h2 className="lg:text-2xl font-bold text-gray-900 leading-relaxed font-arabic mb-2" dir="rtl">
                    {config.tocArabic}
                  </h2>
                </div>
              )}
              {config.tocEnglish && (
                <div className="text-left">
                  <p className="lg:text-lg text-gray-600 leading-relaxed border-t border-gray-50 pt-6">
                    {config.tocEnglish}
                  </p>
                </div>
              )}
              <div className="mt-4 flex justify-start">
                <Link
                  href={aboutEditionHref}
                  className="text-sm font-semibold text-[#43896B] hover:text-[#367556] underline underline-offset-4"
                >
                  About this edition
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Filter - rendered as overlay modal */}
        <SidebarFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          onGoToNumber={handleGoToNumber}
          totalItems={total}
          onSearch={handleSearch}
          selectedEdition={selectedEdition}
          onEditionChange={(edition) => {
            setSelectedEdition(edition);
            setCurrentPage(1);
            setContent([]);
            setAllContent([]);
          }}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Search Bar and Filters - Above Content */}
        <div className="mb-8">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <div className="relative">
                <input
                  placeholder="Search orations, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="w-full px-4 py-2.5 text-base border border-[#D7DEE9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43896B]/20 focus:border-[#43896B] transition-all duration-200 placeholder:text-gray-400"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 bg-[#43896B] text-white rounded-lg hover:bg-[#367556] transition-all duration-200 cursor-pointer"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-col gap-8">
          {(isTransitioning || loading) && (
            <div className="sticky top-0 z-30 h-1.5 w-full overflow-hidden rounded-full bg-[#43896B]/15">
              <div className="h-full w-1/3 animate-[loadingBar_1.2s_ease-in-out_infinite] rounded-full bg-[#43896B]" />
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
            isTransitioning={isTransitioning}
            displayMode={displayMode}
            listingParams={{
              page: currentPage > 1 ? currentPage.toString() : '',
              search: appliedSearchTerm,
              sort: sortBy,
              edition: selectedEdition,
              display: displayMode
            }}
            showTopPagination={true}
          />
        </div>
      </div>
      <style jsx>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(320%);
          }
        }
      `}</style>
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
