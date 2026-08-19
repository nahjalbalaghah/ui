'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import { namePlacesApi, GlossaryItem } from '@/api';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Pagination from '@/app/components/pagination';

export default function GlossaryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const appliedSearchWord = searchParams.get('word') || '';
  const [searchWord, setSearchWord] = useState(appliedSearchWord);

  const [allItems, setAllItems] = useState<GlossaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const pageSize = 20;

  useEffect(() => {
    setSearchWord(searchParams.get('word') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await namePlacesApi.getAllGlossaryItems();
        setAllItems(data);
      } catch (err) {
        setError('Failed to load glossary items. Please try again later.');
        console.error('Error fetching glossary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const filteredItems = React.useMemo(() => {
    let result = [...allItems];
    if (appliedSearchWord) {
      const q = appliedSearchWord.toLowerCase();
      result = result.filter(item => 
        item.word.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => a.word.localeCompare(b.word));
    return result;
  }, [allItems, appliedSearchWord]);

  const total = filteredItems.length;
  const totalPages = Math.ceil(total / pageSize);
  const items = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (searchWord) params.set('word', searchWord);
    const currentFilters = new URLSearchParams(searchParams.toString());
    currentFilters.delete('page');
    if (params.toString() === currentFilters.toString()) return;

    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timeout = window.setTimeout(handleApplyFilters, 500);
    return () => window.clearTimeout(timeout);
  }, [searchWord]);

  const handleClearFilters = () => {
    setSearchWord('');
    router.push(pathname);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    setExpandedId(null); // Reset expansion on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = !!appliedSearchWord;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Glossary</h1>
          <p className="text-lg text-gray-600">
            Explore the descriptions and meanings of various terms, names, and places.
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
              label="Search Word or Description"
              placeholder="Search..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className='h-9.5'
            />
          </div>
        </div>

        <div>
          {loading ? (
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-1/4" />
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Word</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[...Array(10)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-5 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">No items found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{(page - 1) * pageSize + 1}</span>-<span className="font-semibold text-gray-900">{Math.min(page * pageSize, total)}</span> of <span className="font-semibold text-gray-900">{total}</span> items
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
                      <col className="w-1/4" />
                      <col />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Word</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-24">View Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const isExpanded = expandedId === item.id;
                        return (
                          <React.Fragment key={item.id}>
                            <tr 
                              className={`hover:bg-gray-50 transition-colors cursor-pointer group ${isExpanded ? 'bg-gray-50' : ''}`}
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            >
                              <td className="px-6 py-4">
                                <span className={`font-semibold transition-colors ${isExpanded ? 'text-[#43896B]' : 'text-gray-900'}`}>{item.word}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-[#43896B] text-white rotate-90' : 'bg-gray-100 group-hover:bg-[#43896B] group-hover:text-white'}`}>
                                    <ArrowRight className="w-4 h-4" />
                                  </div>
                                </div>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr>
                                <td colSpan={2} className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                                  <div className="max-w-4xl animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="text-gray-700 italic leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-[#43896B]/30">
                                      {item.description}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="md:hidden space-y-4">
                {items.map((item) => {
                  const isExpanded = expandedId === item.id;
                  return (
                    <div 
                      key={item.id} 
                      className={`bg-white rounded-xl border transition-all cursor-pointer ${isExpanded ? 'border-[#43896B] ring-1 ring-[#43896B]/10' : 'border-gray-200'}`}
                      dir="ltr"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className={`text-base font-semibold transition-colors ${isExpanded ? 'text-[#43896B]' : 'text-gray-900'}`}>{item.word}</div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-[#43896B] text-white rotate-90' : 'bg-gray-100'}`}>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1">
                          <div className="pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-700 italic leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-[#43896B]/20">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      )}
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
