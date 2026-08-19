'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, Book, ArrowRight } from 'lucide-react';
import { indexTermsApi, IndexTerm, IndexTermsFilters } from '@/api';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import Pagination from '@/app/components/pagination';
import TextRefChip from '@/app/components/text-ref-chip';
import AlphabetChips from '@/app/components/alphabet-chips';
import { normalizeForSort } from '@/app/utils/text-formatting';

export default function IndexTermsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const appliedFilters: IndexTermsFilters = {
    word_english: searchParams.get('word_english') || '',
    startsWith_english: searchParams.get('startsWith_english') || '',
    language: 'English',
  };

  const [allTerms, setAllTerms] = useState<IndexTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<IndexTermsFilters>(appliedFilters);

  // Sync filters with URL params when they change (e.g. back button)
  useEffect(() => {
    const nextFilters: IndexTermsFilters = {
      word_english: searchParams.get('word_english') || '',
      startsWith_english: searchParams.get('startsWith_english') || '',
      language: 'English',
    };
    setFilters(previous =>
      previous.word_english === nextFilters.word_english &&
      previous.startsWith_english === nextFilters.startsWith_english
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
        const data = await indexTermsApi.getAllIndexTerms();
        setAllTerms(data);
      } catch (err) {
        setError('Failed to load index terms. Please try again later.');
        console.error('Error fetching index terms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Local Filter Logic
  const filteredTerms = React.useMemo(() => {
    let result = [...allTerms];

    const { word_english, startsWith_english } = appliedFilters;

    result = result.filter(item => item.word_english && item.word_english.trim() !== '');

    // Search Filter
    if (word_english) {
      const q = word_english.toLowerCase();
      result = result.filter(item => item.word_english.toLowerCase().includes(q));
    }

    // Alphabet Filter
    if (startsWith_english) {
      const letter = startsWith_english.toLowerCase();
      result = result.filter(item => {
        return normalizeForSort(item.word_english).startsWith(letter);
      });
    }

    // Sort Alphabetically
    result.sort((a, b) => {
      const wordA = a.word_english || '';
      const wordB = b.word_english || '';
      return normalizeForSort(wordA).localeCompare(normalizeForSort(wordB));
    });

    return result;
  }, [allTerms, appliedFilters]);

  // Pagination totals
  const total = filteredTerms.length;
  const totalPages = Math.ceil(total / pageSize);
  const terms = filteredTerms.slice((page - 1) * pageSize, page * pageSize);

  const handleApplyFilters = (newFilters?: IndexTermsFilters) => {
    const filtersToUse = newFilters || filters;
    const params = new URLSearchParams();
    if (filtersToUse.word_english) params.set('word_english', filtersToUse.word_english);
    if (filtersToUse.startsWith_english) params.set('startsWith_english', filtersToUse.startsWith_english);

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
      word_english: '',
      startsWith_english: '',
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

  const hasActiveFilters = appliedFilters.word_english || appliedFilters.startsWith_english;

  const handleLetterSelect = (letter: string) => {
    const updatedFilters = { ...filters, startsWith_english: letter };
    setFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Index of Terms (English)</h1>
          <p className="text-lg text-gray-600">
            Discover the rich vocabulary and terminology used by Imam Ali (AS) in Nahj al-Balaghah
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
                label="English Word"
                placeholder="Search English word..."
                value={filters.word_english}
                onChange={(e) => setFilters({ ...filters, word_english: e.target.value })}
                className='h-9.5'
              />
          </div>
        </div>

        <div className="mb-6">
          <AlphabetChips
            selectedLetter={filters.startsWith_english || ''}
            onSelectLetter={handleLetterSelect}
            language="English"
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
                      <col className="w-1/4" />
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Section</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English Word</th>
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
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
                              <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                              <div className="h-7 bg-gray-200 rounded-full w-16"></div>
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
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm animate-pulse">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : terms.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">No terms found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{(page - 1) * pageSize + 1}</span>-<span className="font-semibold text-gray-900">{Math.min(page * pageSize, total)}</span> of <span className="font-semibold text-gray-900">{total}</span> terms
                </p>
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
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed" dir="ltr">
                    <colgroup>
                      <col className="w-24" />
                      <col className="w-1/4" />
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-left">Section</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English Word</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Text References</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {terms.map((term) => {
                        const word = term.word_english;
                        // Gather all text reference values
                        const refs = term.text_numbers?.map(t => t.value).join(',') || '';
                        const targetUrl = word
                          ? `/indexes/terms/${encodeURIComponent(word)}?${new URLSearchParams({
                              ...(refs ? { refs } : {}),
                              entry: term.documentId,
                            }).toString()}`
                          : '#';

                        return (
                          <tr
                            key={term.id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() => word && router.push(targetUrl)}
                          >
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center justify-center w-10 h-10 bg-[#43896B]/10 text-[#43896B] font-bold rounded-lg text-sm">
                                {term.section}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-medium group-hover:text-[#43896B] transition-colors">
                              {term.word_english || '-'}
                            </td>
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
              <div className="md:hidden space-y-4">
                {terms.map((term) => {
                  const word = term.word_english;
                  const refs = term.text_numbers?.map(t => t.value).join(',') || '';
                  const targetUrl = word
                    ? `/indexes/terms/${encodeURIComponent(word)}?${new URLSearchParams({
                        ...(refs ? { refs } : {}),
                        entry: term.documentId,
                      }).toString()}`
                    : '#';

                  return (
                    <div
                      key={term.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm cursor-pointer hover:border-[#43896B] transition-colors group"
                      onClick={() => word && router.push(targetUrl)}
                      dir="ltr"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-[#43896B]/10 text-[#43896B] font-bold rounded-lg text-sm shrink-0">
                          {term.section}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-semibold text-gray-900 group-hover:text-[#43896B] transition-colors">
                            {term.word_english || '-'}
                          </div>
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
