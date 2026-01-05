'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, Book, ArrowRight } from 'lucide-react';
import { namePlacesApi, NamePlace, NamePlacesFilters } from '@/api';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import Pagination from '@/app/components/pagination';
import AlphabetChips from '@/app/components/alphabet-chips';

export default function NamesPlacesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const appliedFilters: NamePlacesFilters = {
    word_english: searchParams.get('word_english') || '',
    word_arabic: searchParams.get('word_arabic') || '',
    startsWith_english: searchParams.get('startsWith_english') || '',
    startsWith_arabic: searchParams.get('startsWith_arabic') || '',
    language: (searchParams.get('language') as 'English' | 'Arabic') || 'English',
  };

  const [items, setItems] = useState<NamePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<NamePlacesFilters>(appliedFilters);

  // Sync filters with URL params when they change (e.g. back button)
  useEffect(() => {
    setFilters({
      word_english: searchParams.get('word_english') || '',
      word_arabic: searchParams.get('word_arabic') || '',
      startsWith_english: searchParams.get('startsWith_english') || '',
      startsWith_arabic: searchParams.get('startsWith_arabic') || '',
      language: (searchParams.get('language') as 'English' | 'Arabic') || 'English',
    });
  }, [searchParams]);

  const pageSize = 20;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const filterParams: NamePlacesFilters = {};
        if (appliedFilters.word_english) filterParams.word_english = appliedFilters.word_english;
        if (appliedFilters.word_arabic) filterParams.word_arabic = appliedFilters.word_arabic;
        if (appliedFilters.startsWith_english) filterParams.startsWith_english = appliedFilters.startsWith_english;
        if (appliedFilters.startsWith_arabic) filterParams.startsWith_arabic = appliedFilters.startsWith_arabic;
        if (appliedFilters.language) filterParams.language = appliedFilters.language;

        const response = await namePlacesApi.getNamePlaces(page, pageSize, filterParams);
        setItems(response.data);
        setTotalPages(response.meta.pagination.pageCount);
        setTotal(response.meta.pagination.total);
      } catch (err) {
        setError('Failed to load names and places. Please try again later.');
        console.error('Error fetching names and places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [page, appliedFilters.word_english, appliedFilters.word_arabic, appliedFilters.startsWith_english, appliedFilters.startsWith_arabic, appliedFilters.language]);

  const handleApplyFilters = (newFilters?: NamePlacesFilters) => {
    const filtersToUse = newFilters || filters;
    const params = new URLSearchParams();
    if (filtersToUse.word_english) params.set('word_english', filtersToUse.word_english);
    if (filtersToUse.word_arabic) params.set('word_arabic', filtersToUse.word_arabic);
    if (filtersToUse.startsWith_english) params.set('startsWith_english', filtersToUse.startsWith_english);
    if (filtersToUse.startsWith_arabic) params.set('startsWith_arabic', filtersToUse.startsWith_arabic);
    if (filtersToUse.language && filtersToUse.language !== 'English') params.set('language', filtersToUse.language);

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({
      word_english: '',
      word_arabic: '',
      startsWith_english: '',
      startsWith_arabic: '',
      language: 'English',
    });
    router.push(pathname);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = appliedFilters.word_english || appliedFilters.word_arabic || appliedFilters.startsWith_english || appliedFilters.startsWith_arabic || appliedFilters.language !== 'English';

  const handleLetterSelect = (letter: string) => {
    const updatedFilters = { ...filters };
    if (filters.language === 'English') {
      updatedFilters.startsWith_english = letter;
      updatedFilters.startsWith_arabic = '';
    } else {
      updatedFilters.startsWith_arabic = letter;
      updatedFilters.startsWith_english = '';
    }
    setFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Index of Names & Places</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Filters</h2>
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant='danger'
                icon={<X className="w-4 h-4" />}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Language</label>
              <Select
                value={filters.language || 'English'}
                onChange={(value) => setFilters({ ...filters, language: value as 'English' | 'Arabic' })}
                options={[
                  { value: 'English', label: 'English' },
                  { value: 'Arabic', label: 'Arabic' }
                ]}
                placeholder="Select Language"
              />
            </div>
            {filters.language === 'English' ? (
              <Input
                label="English Word"
                placeholder="Search English..."
                value={filters.word_english}
                onChange={(e) => setFilters({ ...filters, word_english: e.target.value })}
              />
            ) : (
              <Input
                label="Arabic Word"
                placeholder="Search Arabic..."
                value={filters.word_arabic}
                onChange={(e) => setFilters({ ...filters, word_arabic: e.target.value })}
                className="text-right"
                dir="rtl"
              />
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => handleApplyFilters()}
              variant='outlined'
              icon={<Search className="w-4 h-4" />}
            >
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <AlphabetChips
            selectedLetter={filters.language === 'English' ? (filters.startsWith_english || '') : (filters.startsWith_arabic || '')}
            onSelectLetter={handleLetterSelect}
            language={filters.language || 'English'}
          />
        </div>

        <div>
          {loading ? (
            <>
              {/* Desktop Loading */}
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-24" />
                      {appliedFilters.language === 'English' && <col className="w-1/4" />}
                      {appliedFilters.language === 'Arabic' && <col className="w-1/5" />}
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Section</th>
                        {appliedFilters.language === 'English' && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English</th>}
                        {appliedFilters.language === 'Arabic' && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">Arabic</th>}
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Text References</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[...Array(10)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                              <div className="h-6 bg-gray-200 rounded w-12"></div>
                              <div className="h-6 bg-gray-200 rounded w-12"></div>
                              <div className="h-6 bg-gray-200 rounded w-12"></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Mobile Loading */}
              <div className="md:hidden space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <X className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => window.location.reload()} variant='solid' className="mt-4">
                Try Again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Book className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {items.length} of {total} results
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-24" />
                      {appliedFilters.language === 'English' && <col className="w-1/4" />}
                      {appliedFilters.language === 'Arabic' && <col className="w-1/5" />}
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Section</th>
                        {appliedFilters.language === 'English' && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English</th>}
                        {appliedFilters.language === 'Arabic' && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">Arabic</th>}
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Text References</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const name = appliedFilters.language === 'Arabic' ? item.word_arabic : item.word_english;
                        const refs = item.text_numbers?.map(t => t.value).join(',') || '';
                        const targetUrl = name
                          ? `/indexes/names-places/${encodeURIComponent(name)}${refs ? `?refs=${encodeURIComponent(refs)}` : ''}`
                          : '#';

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 cursor-pointer transition-colors group"
                            onClick={() => name && router.push(targetUrl)}
                          >
                            <td className="px-6 py-4">
                              <div className="w-10 h-10 bg-[#43896B]/10 rounded-lg flex items-center justify-center text-[#43896B] font-semibold">
                                {item.section || '-'}
                              </div>
                            </td>
                            {appliedFilters.language === 'English' && (
                              <td className="px-6 py-4">
                                <span className="text-gray-900 font-medium group-hover:text-[#43896B] transition-colors">
                                  {item.word_english || '-'}
                                </span>
                              </td>
                            )}
                            {appliedFilters.language === 'Arabic' && (
                              <td className="px-6 py-4 text-right" dir="rtl">
                                <span className="text-gray-900 font-medium group-hover:text-[#43896B] transition-colors">
                                  {item.word_arabic || '-'}
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {items.map((item) => {
                  const name = appliedFilters.language === 'Arabic' ? item.word_arabic : item.word_english;
                  const refs = item.text_numbers?.map(t => t.value).join(',') || '';
                  const targetUrl = name
                    ? `/indexes/names-places/${encodeURIComponent(name)}${refs ? `?refs=${encodeURIComponent(refs)}` : ''}`
                    : '#';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm cursor-pointer hover:border-[#43896B] transition-colors group"
                      onClick={() => name && router.push(targetUrl)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          {appliedFilters.language === 'English' && (
                            <div className="text-base font-semibold text-gray-900 group-hover:text-[#43896B] transition-colors">
                              {item.word_english || '-'}
                            </div>
                          )}
                          {appliedFilters.language === 'Arabic' && (
                            <div className="text-base font-semibold text-gray-900 group-hover:text-[#43896B] transition-colors" dir="rtl">
                              {item.word_arabic || '-'}
                            </div>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    loading={loading}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
