'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, Book } from 'lucide-react';
import { indexTermsApi, IndexTerm, IndexTermsFilters } from '@/api';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import Pagination from '@/app/components/pagination';
import TextRefChip from '@/app/components/text-ref-chip';

export default function IndexTermsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const appliedFilters: IndexTermsFilters = {
    section: searchParams.get('section') || '',
    word_english: searchParams.get('word_english') || '',
    word_arabic: searchParams.get('word_arabic') || '',
    language: (searchParams.get('language') as 'English' | 'Arabic') || 'English',
  };

  const [terms, setTerms] = useState<IndexTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sections, setSections] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<IndexTermsFilters>(appliedFilters);

  // Sync filters with URL params when they change (e.g. back button)
  useEffect(() => {
    setFilters({
      section: searchParams.get('section') || '',
      word_english: searchParams.get('word_english') || '',
      word_arabic: searchParams.get('word_arabic') || '',
      language: (searchParams.get('language') as 'English' | 'Arabic') || 'English',
    });
  }, [searchParams]);
  
  const pageSize = 20;

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsData = await indexTermsApi.getSections();
        setSections(sectionsData);
      } catch (err) {
        console.error('Error fetching sections:', err);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filterParams: IndexTermsFilters = {};
        if (appliedFilters.section) filterParams.section = appliedFilters.section;
        if (appliedFilters.word_english) filterParams.word_english = appliedFilters.word_english;
        if (appliedFilters.word_arabic) filterParams.word_arabic = appliedFilters.word_arabic;
        if (appliedFilters.language) filterParams.language = appliedFilters.language;

        const response = await indexTermsApi.getIndexTerms(page, pageSize, filterParams);
        setTerms(response.data);
        setTotalPages(response.meta.pagination.pageCount);
        setTotal(response.meta.pagination.total);
      } catch (err) {
        setError('Failed to load index terms. Please try again later.');
        console.error('Error fetching index terms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [page, appliedFilters.section, appliedFilters.word_english, appliedFilters.word_arabic, appliedFilters.language]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.section) params.set('section', filters.section);
    if (filters.word_english) params.set('word_english', filters.word_english);
    if (filters.word_arabic) params.set('word_arabic', filters.word_arabic);
    if (filters.language && filters.language !== 'English') params.set('language', filters.language);
    
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({
      section: '',
      word_english: '',
      word_arabic: '',
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

  const hasActiveFilters = appliedFilters.section || appliedFilters.word_english || appliedFilters.word_arabic || appliedFilters.language !== 'English';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Index of Terms</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Section</label>
              <Select
                value={filters.section}
                onChange={(value) => setFilters({ ...filters, section: value })}
                options={[
                  { value: '', label: 'All Sections' },
                  ...sections.map(section => ({ value: section, label: section }))
                ]}
                placeholder="Select a section"
              />
            </div>
            <Input
              label="English Word"
              placeholder="Search English word..."
              value={filters.word_english}
              onChange={(e) => setFilters({ ...filters, word_english: e.target.value })}
            />
            <Input
              label="Arabic Word"
              placeholder="Search Arabic word..."
              value={filters.word_arabic}
              onChange={(e) => setFilters({ ...filters, word_arabic: e.target.value })}
              className="text-right"
              dir="rtl"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleApplyFilters}
              variant='outlined'
              icon={<Search className="w-4 h-4" />}
            >
              Apply Filters
            </Button>
          </div>
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
                        {appliedFilters.language === 'English' && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English Word</th>}
                        {appliedFilters.language === 'Arabic' && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">Arabic Word</th>}
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Text References</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[...Array(10)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          </td>
                          {appliedFilters.language === 'English' && (
                            <td className="px-6 py-4">
                              <div className="h-5 bg-gray-200 rounded w-32"></div>
                            </td>
                          )}
                          {appliedFilters.language === 'Arabic' && (
                            <td className="px-6 py-4">
                              <div className="h-5 bg-gray-200 rounded w-24 ml-auto"></div>
                            </td>
                          )}
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
              </div>
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
                        {appliedFilters.language === 'English' && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English Word</th>}
                        {appliedFilters.language === 'Arabic' && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap">Arabic Word</th>}
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Text References</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {terms.map((term) => (
                        <tr key={term.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center justify-center w-10 h-10 bg-[#43896B]/10 text-[#43896B] font-bold rounded-lg text-sm">
                              {term.section}
                            </span>
                          </td>
                          {appliedFilters.language === 'English' && (
                            <td className="px-6 py-4 text-gray-800 font-medium">
                              {term.word_english || '-'}
                            </td>
                          )}
                          {appliedFilters.language === 'Arabic' && (
                            <td className="px-6 py-4 text-right text-gray-800 font-medium" dir="rtl">
                              {term.word_arabic || '-'}
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {term.text_numbers && term.text_numbers.length > 0 ? (
                                term.text_numbers.map((textNum) => (
                                  <TextRefChip
                                    key={textNum.id}
                                    textRef={textNum.value}
                                    showIcon={true}
                                    englishWord={term.word_english}
                                    arabicWord={term.word_arabic}
                                  />
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm">No references</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="md:hidden space-y-4">
                {terms.map((term) => (
                  <div key={term.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-[#43896B]/10 text-[#43896B] font-bold rounded-lg text-sm shrink-0">
                        {term.section}
                      </span>
                      <div className="flex-1 min-w-0">
                        {appliedFilters.language === 'English' && (
                          <div className="text-base font-semibold text-gray-900 mb-1">
                            {term.word_english || '-'}
                          </div>
                        )}
                        {appliedFilters.language === 'Arabic' && (
                          <div className="text-base font-semibold text-gray-900 mb-1" dir="rtl">
                            {term.word_arabic || '-'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 mb-2">Text References</div>
                      <div className="flex flex-wrap gap-2">
                        {term.text_numbers && term.text_numbers.length > 0 ? (
                          term.text_numbers.map((textNum) => (
                            <TextRefChip
                              key={textNum.id}
                              textRef={textNum.value}
                              showIcon={true}
                              englishWord={term.word_english}
                              arabicWord={term.word_arabic}
                            />
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No references</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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