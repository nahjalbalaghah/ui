'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, Book, ArrowRight } from 'lucide-react';
import { religiousConceptsApi, ReligiousConcept, ReligiousConceptsFilters } from '@/api';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import Pagination from '@/app/components/pagination';
import AlphabetChips from '@/app/components/alphabet-chips';
import { normalizeForSort, normalizeArabic } from '@/app/utils/text-formatting';

export default function ReligiousConceptsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const appliedFilters: ReligiousConceptsFilters = {
    word_arabic: searchParams.get('word_arabic') || '',
    startsWith_arabic: searchParams.get('startsWith_arabic') || '',
    language: 'Arabic',
  };

  const [allItems, setAllItems] = useState<ReligiousConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ReligiousConceptsFilters>(appliedFilters);

  // Sync filters with URL params when they change (e.g. back button)
  useEffect(() => {
    const nextFilters: ReligiousConceptsFilters = {
      word_arabic: searchParams.get('word_arabic') || '',
      startsWith_arabic: searchParams.get('startsWith_arabic') || '',
      language: 'Arabic',
    };
    setFilters(previous =>
      previous.word_arabic === nextFilters.word_arabic &&
      previous.startsWith_arabic === nextFilters.startsWith_arabic
        ? previous
        : nextFilters
    );
  }, [searchParams]);

  const pageSize = 20;

  // Initialize: Fetch ALL items once
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await religiousConceptsApi.getAllReligiousConcepts();
        setAllItems(data);
      } catch (err) {
        setError('Failed to load religious concepts. Please try again later.');
        console.error('Error fetching religious concepts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Local Filter Logic
  const filteredItems = React.useMemo(() => {
    let result = [...allItems];

    const { word_arabic, startsWith_arabic } = appliedFilters;

    // Language Filter - Force Arabic
    result = result.filter(item => item.word_arabic && item.word_arabic.trim() !== '');

    // Search Filter
    if (word_arabic) {
      const q = normalizeArabic(word_arabic);
      result = result.filter(item => normalizeArabic(item.word_arabic).includes(q));
    }

    // Alphabet Filter
    if (startsWith_arabic) {
      result = result.filter(item => normalizeArabic(item.word_arabic).startsWith(startsWith_arabic));
    }

    // Sort Alphabetically
    result.sort((a, b) => {
      const wordA = a.word_arabic || '';
      const wordB = b.word_arabic || '';
      
      return normalizeForSort(wordA).localeCompare(normalizeForSort(wordB), 'ar');
    });

    return result;
  }, [allItems, appliedFilters]);

  // Pagination totals
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / pageSize);
  const items = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleApplyFilters = (newFilters?: ReligiousConceptsFilters) => {
    const filtersToUse = newFilters || filters;
    const params = new URLSearchParams();
    if (filtersToUse.word_arabic) params.set('word_arabic', filtersToUse.word_arabic);
    if (filtersToUse.startsWith_arabic) params.set('startsWith_arabic', filtersToUse.startsWith_arabic);
    params.set('language', 'Arabic');

    const currentFilters = new URLSearchParams(searchParams.toString());
    currentFilters.delete('page');
    if (params.toString() === currentFilters.toString()) return;

    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      handleApplyFilters(filters);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      word_arabic: '',
      startsWith_arabic: '',
      language: 'Arabic',
    });
    router.push(pathname);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = appliedFilters.word_arabic || appliedFilters.startsWith_arabic;

  const handleLetterSelect = (letter: string) => {
    const updatedFilters = { ...filters };
    updatedFilters.startsWith_arabic = letter;
    setFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Index of Religious &amp; Ethical Concepts</h1>
          <p className="text-lg text-gray-600">
            Explore the religious and ethical concepts found in Nahj al-Balaghah
          </p>
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
            <Input
              label="Arabic Word"
              placeholder="Search Arabic..."
              value={filters.word_arabic}
              onChange={(e) => setFilters({ ...filters, word_arabic: e.target.value })}
              className="text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="mb-6">
          <AlphabetChips
            selectedLetter={filters.startsWith_arabic || ''}
            onSelectLetter={handleLetterSelect}
            language="Arabic"
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
                      <col className="w-1/5" />
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Section</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">Arabic</th>
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
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{items.length}</span> of <span className="font-semibold text-gray-900">{total}</span> results
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-end">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      loading={loading}
                    />
                  </div>
                )}
              </div>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed" dir="rtl">
                    <colgroup>
                      <col className="w-24" />
                      <col className="w-1/5" />
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Section</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">Arabic</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Text References</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const name = item.word_arabic;
                        const refs = item.text_numbers?.map(t => t.value).join(',') || '';
                        const targetUrl = name
                          ? `/indexes/religious-concepts/${encodeURIComponent(name)}${refs ? `?refs=${encodeURIComponent(refs)}` : ''}`
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
                            <td className="px-6 py-4 text-right">
                              <span className="text-gray-900 font-medium group-hover:text-[#43896B] transition-colors">
                                {item.word_arabic || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors rotate-180">
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
                  const name = item.word_arabic;
                  const refs = item.text_numbers?.map(t => t.value).join(',') || '';
                  const targetUrl = name
                    ? `/indexes/religious-concepts/${encodeURIComponent(name)}${refs ? `?refs=${encodeURIComponent(refs)}` : ''}`
                    : '#';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm cursor-pointer hover:border-[#43896B] transition-colors group"
                      onClick={() => name && router.push(targetUrl)}
                      dir="rtl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-gray-900 group-hover:text-[#43896B] transition-colors">
                            {item.word_arabic || '-'}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors rotate-180">
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
