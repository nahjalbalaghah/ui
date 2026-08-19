'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { X, Book, ArrowRight } from 'lucide-react';
import { quranHadithApi, QuranHadith, QuranHadithFilters } from '@/api';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import Pagination from '@/app/components/pagination';
import AlphabetChips from '@/app/components/alphabet-chips';
import { normalizeForSort } from '@/app/utils/text-formatting';

export default function QuranHadithContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1');
  const appliedFilters: QuranHadithFilters = {
    reference_type: (searchParams.get('reference_type') as any) || '',
    surah_name: searchParams.get('surah_name') || '',
    surah_number: searchParams.get('surah_number') || '',
    verse_translation: searchParams.get('verse_translation') || '',
    verse_text: searchParams.get('verse_text') || '',
    startsWith_surah: searchParams.get('startsWith_surah') || '',
    startsWith_verse: searchParams.get('startsWith_verse') || '',
    language: (searchParams.get('language') as 'English' | 'Arabic') || 'English',
  };

  const [allItems, setAllItems] = useState<QuranHadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahNames, setSurahNames] = useState<{ name: string; arabicName: string }[]>([]);

  const [filters, setFilters] = useState<QuranHadithFilters>(appliedFilters);
  const isArabic = filters.language === 'Arabic';

  // Sync filters with URL params when they change (e.g. back button)
  useEffect(() => {
    const nextFilters: QuranHadithFilters = {
      reference_type: (searchParams.get('reference_type') as any) || '',
      surah_name: searchParams.get('surah_name') || '',
      surah_number: searchParams.get('surah_number') || '',
      verse_translation: searchParams.get('verse_translation') || '',
      verse_text: searchParams.get('verse_text') || '',
      startsWith_surah: searchParams.get('startsWith_surah') || '',
      startsWith_verse: searchParams.get('startsWith_verse') || '',
      language: (searchParams.get('language') as 'English' | 'Arabic') || 'English',
    };
    setFilters(previous =>
      previous.reference_type === nextFilters.reference_type &&
      previous.surah_name === nextFilters.surah_name &&
      previous.surah_number === nextFilters.surah_number &&
      previous.verse_translation === nextFilters.verse_translation &&
      previous.verse_text === nextFilters.verse_text &&
      previous.startsWith_surah === nextFilters.startsWith_surah &&
      previous.startsWith_verse === nextFilters.startsWith_verse &&
      previous.language === nextFilters.language
        ? previous
        : nextFilters
    );
  }, [searchParams]);

  const pageSize = 20;

  const getReferenceLabel = (item: QuranHadith) => {
    if (appliedFilters.language === 'Arabic') {
      return item.arabic_name || item.surah_name_arabic || '-';
    }
    return item.reference || item.surah_name || item.title || '-';
  };

  const getTitleLabel = (item: QuranHadith) => item.title || '-';

  const getDetailText = (item: QuranHadith) =>
    appliedFilters.language === 'Arabic' ? (item.verse_text || item.arabic_text || '-') : (item.verse_translation || item.english_translation || '-');

  const getTargetUrl = (item: QuranHadith) => {
    const refs = item.text_numbers?.map(t => t.value).join(',') || '';
    const urlSlug = item.title || item.reference || item.surah_name || item.documentId;
    const params = new URLSearchParams({
      ...(refs ? { refs } : {}),
      entry: item.documentId,
    });
    return `/indexes/quran-hadith/${encodeURIComponent(urlSlug)}?${params.toString()}`;
  };

  // Initialize: Fetch ALL items once
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [data, namesData] = await Promise.all([
          quranHadithApi.getAllQuranHadiths(),
          quranHadithApi.getSurahNames()
        ]);
        setAllItems(data);
        setSurahNames(namesData);
      } catch (err) {
        setError('Failed to load Qur\'an and Hadith references. Please try again later.');
        console.error('Error fetching quran and hadith:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Local Filter Logic
  const filteredItems = React.useMemo(() => {
    let result = [...allItems];

    const { reference_type, surah_name, surah_number, verse_translation, verse_text, startsWith_surah, startsWith_verse, language } = appliedFilters;

    // Filter by Reference Type
    if (reference_type) {
      result = result.filter(item => (item as any).reference_type === reference_type);
    }

    // Filter by Surah Name (if selected and reference type is Quran)
    if (surah_name && (!reference_type || reference_type === 'Quran')) {
      result = result.filter(item => item.surah_name === surah_name);
    }

    // Language Filter
    if (language === 'English') {
      result = result.filter(item => item.verse_translation && item.verse_translation.trim() !== '');
    } else {
      result = result.filter(item => item.verse_text && item.verse_text.trim() !== '');
    }

    // Search Filter
    if (language === 'English' && verse_translation) {
      const q = verse_translation.toLowerCase();
      result = result.filter(item => item.verse_translation.toLowerCase().includes(q));
    } else if (language === 'Arabic' && verse_text) {
      result = result.filter(item => item.verse_text.includes(verse_text));
    }

    // Alphabet Filter
    if (language === 'English' && startsWith_surah) {
      const letter = startsWith_surah.toLowerCase();
      result = result.filter(item => {
        return normalizeForSort(item.surah_name).startsWith(letter);
      });
    } else if (language === 'Arabic' && startsWith_verse) {
      result = result.filter(item => item.verse_text.startsWith(startsWith_verse));
    }

    // Sort Alphabetically
    result.sort((a, b) => {
      const isArabic = appliedFilters.language === 'Arabic';
      const wordA = (isArabic && a.surah_name_arabic) ? a.surah_name_arabic : (a.surah_name || '');
      const wordB = (isArabic && b.surah_name_arabic) ? b.surah_name_arabic : (b.surah_name || '');
      
      if (isArabic) {
        return wordA.localeCompare(wordB, 'ar');
      }
      return normalizeForSort(wordA).localeCompare(normalizeForSort(wordB));
    });

    return result;
  }, [allItems, appliedFilters]);

  // Pagination totals
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / pageSize);
  const items = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const handleApplyFilters = (newFilters?: QuranHadithFilters) => {
    const filtersToUse = newFilters || filters;
    const params = new URLSearchParams();
    if (filtersToUse.reference_type) params.set('reference_type', filtersToUse.reference_type);
    if (filtersToUse.surah_name) params.set('surah_name', filtersToUse.surah_name);
    if (filtersToUse.surah_number) params.set('surah_number', filtersToUse.surah_number);
    if (filtersToUse.verse_translation) params.set('verse_translation', filtersToUse.verse_translation);
    if (filtersToUse.verse_text) params.set('verse_text', filtersToUse.verse_text);
    if (filtersToUse.startsWith_surah) params.set('startsWith_surah', filtersToUse.startsWith_surah);
    if (filtersToUse.startsWith_verse) params.set('startsWith_verse', filtersToUse.startsWith_verse);
    if (filtersToUse.language && filtersToUse.language !== 'English') params.set('language', filtersToUse.language);

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
      reference_type: '',
      surah_name: '',
      surah_number: '',
      verse_translation: '',
      verse_text: '',
      startsWith_surah: '',
      startsWith_verse: '',
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

  const hasActiveFilters = appliedFilters.reference_type || appliedFilters.surah_name || appliedFilters.surah_number || appliedFilters.verse_translation || appliedFilters.verse_text || appliedFilters.startsWith_surah || appliedFilters.startsWith_verse || appliedFilters.language !== 'English';

  const handleLetterSelect = (letter: string) => {
    const updatedFilters = { ...filters };
    if (filters.language === 'English') {
      updatedFilters.startsWith_surah = letter;
      updatedFilters.startsWith_verse = '';
    } else {
      updatedFilters.startsWith_verse = letter;
      updatedFilters.startsWith_surah = '';
    }
    setFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Index of Qur&apos;an &amp; Hadith</h1>
          <p className="text-lg text-gray-600">
            Discover references to the Holy Qur&apos;an and prophetic traditions in Nahj al-Balaghah
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{isArabic ? 'عوامل التصفية' : 'Filters'}</h2>
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant='danger'
                icon={<X className="w-4 h-4" />}
              >
                {isArabic ? 'مسح عوامل التصفية' : 'Clear Filters'}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">{isArabic ? 'اللغة' : 'Language'}</label>
              <Select
                value={filters.language || 'English'}
                onChange={(value) => setFilters({ ...filters, language: value as 'English' | 'Arabic' })}
                options={[
                  { value: 'English', label: isArabic ? 'الإنجليزية' : 'English' },
                  { value: 'Arabic', label: isArabic ? 'العربية' : 'Arabic' }
                ]}
                placeholder={isArabic ? 'اختر اللغة' : 'Select Language'}
              />
            </div>
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">{isArabic ? 'المرجع' : 'Reference'}</label>
              <Select
                value={filters.reference_type || ''}
                onChange={(value) => {
                  const newFilters = { ...filters, reference_type: value as any };
                  if (value !== 'Quran') newFilters.surah_name = '';
                  setFilters(newFilters);
                }}
                options={[
                  { value: '', label: isArabic ? 'جميع المراجع' : 'All References' },
                  { value: 'Quran', label: isArabic ? 'القرآن' : "Qur'an" },
                  { value: 'Hadith', label: isArabic ? 'الحديث' : 'Hadith' },
                  { value: 'Poetry', label: isArabic ? 'الشعر' : 'Poetry' },
                  { value: 'Proverbs', label: isArabic ? 'الأمثال' : 'Proverbs' }
                ]}
                placeholder={isArabic ? 'اختر المرجع' : 'Select Reference'}
              />
            </div>
            {(filters.reference_type === 'Quran' || !filters.reference_type) && (
              <div>
                <label className="block font-medium text-sm text-gray-700 mb-1">{isArabic ? 'السورة' : 'Surah'}</label>
                <Select
                  value={filters.surah_name}
                  onChange={(value) => setFilters({ ...filters, surah_name: value })}
                  options={[
                    { value: '', label: isArabic ? 'جميع السور' : 'All Surahs' },
                    ...surahNames.map(surah => ({ 
                      value: surah.name, 
                      label: filters.language === 'Arabic' && surah.arabicName ? surah.arabicName : surah.name 
                    }))
                  ]}
                  placeholder={isArabic ? 'اختر السورة' : 'Select a Surah'}
                />
              </div>
            )}
            {filters.language === 'English' ? (
              <Input
                label="Search Translation"
                placeholder="Search translation..."
                value={filters.verse_translation}
                onChange={(e) => setFilters({ ...filters, verse_translation: e.target.value })}
                className='h-9.5'
              />
            ) : (
              <Input
                label="البحث في النص العربي"
                placeholder="ابحث بالعربية..."
                value={filters.verse_text}
                onChange={(e) => setFilters({ ...filters, verse_text: e.target.value })}
                className="text-right h-9.5"
                dir="rtl"
              />
            )}
          </div>
        </div>

        <div className="mb-6">
          <AlphabetChips
            selectedLetter={filters.language === 'English' ? filters.startsWith_surah || '' : filters.startsWith_verse || ''}
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
                      <col className="hidden" />
                      {appliedFilters.language === 'English' && <col className="w-32" />}
                      <col />
                      <col className="w-24" />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reference</th>
                        {appliedFilters.language === 'English' && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>}
                        {appliedFilters.language === 'English' && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English Translation</th>}
                        {appliedFilters.language === 'Arabic' && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Arabic Text</th>}
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[...Array(10)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center">
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
                  {appliedFilters.language === 'Arabic' ? (
                    <>
                      عرض <span className="font-semibold text-gray-900">{items.length}</span> من <span className="font-semibold text-gray-900">{total}</span> نتائج
                    </>
                  ) : (
                    <>
                      Showing <span className="font-semibold text-gray-900">{items.length}</span> of <span className="font-semibold text-gray-900">{total}</span> results
                    </>
                  )}
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
                  <table className="w-full table-fixed" dir={appliedFilters.language === 'Arabic' ? 'rtl' : 'ltr'}>
                    <colgroup>
                      <col className="w-40" />
                      {appliedFilters.language === 'English' && <col className="w-32" />}
                      <col />
                      <col className="w-24" />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="hidden">
                          {appliedFilters.language === 'Arabic' ? 'المرجع' : 'Reference'}
                        </th>
                        {appliedFilters.language === 'English' && (
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                        )}
                        {appliedFilters.language === 'English' && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">English Translation</th>}
                        {appliedFilters.language === 'Arabic' && <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">النص العربي</th>}
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                          {appliedFilters.language === 'Arabic' ? 'التفاصيل' : 'Details'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => {
                        const displayText = getDetailText(item);
                        const targetUrl = getTargetUrl(item);

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 cursor-pointer transition-colors group"
                            onClick={() => router.push(targetUrl)}
                          >
                            <td className="hidden">
                              <div className="space-y-1">
                                <span className="text-gray-900 font-medium">
                                  {getReferenceLabel(item)}
                                </span>
                                {item.category && (
                                  <div>
                                    <span className="inline-flex items-center rounded-full bg-[#43896B]/10 px-2 py-0.5 text-xs font-medium text-[#43896B]">
                                      {item.category}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            {appliedFilters.language === 'English' && (
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <span className="text-gray-600">{getTitleLabel(item)}</span>
                                  {item.category && (
                                    <div>
                                      <span className="inline-flex items-center rounded-full bg-[#43896B]/10 px-2 py-0.5 text-xs font-medium text-[#43896B]">
                                        {item.category}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            )}
                            {appliedFilters.language === 'English' && (
                              <td className="px-6 py-4">
                                <span className="text-gray-900 group-hover:text-[#43896B] transition-colors line-clamp-2">
                                  {displayText}
                                </span>
                              </td>
                            )}
                            {appliedFilters.language === 'Arabic' && (
                              <td className="px-6 py-4 text-right">
                                <span className="text-gray-900 group-hover:text-[#43896B] transition-colors line-clamp-2">
                                  {displayText}
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors ${appliedFilters.language === 'Arabic' ? 'rotate-180' : ''}`}>
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
                  const displayText = getDetailText(item);
                  const targetUrl = getTargetUrl(item);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm cursor-pointer hover:border-[#43896B] transition-colors group"
                      onClick={() => router.push(targetUrl)}
                      dir={appliedFilters.language === 'Arabic' ? 'rtl' : 'ltr'}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="hidden">
                              {getReferenceLabel(item)}
                            </span>
                            {item.category && (
                              <span className="text-sm text-gray-500">
                                {item.category}
                              </span>
                            )}
                          </div>
                          {appliedFilters.language === 'English' && (
                            <div className="text-sm text-gray-500 mb-1">
                              {getTitleLabel(item)}
                            </div>
                          )}
                          {appliedFilters.language === 'English' && (
                            <div className="text-sm text-gray-900 line-clamp-2">
                              {displayText}
                            </div>
                          )}
                          {appliedFilters.language === 'Arabic' && (
                            <div className="text-sm text-gray-900 line-clamp-2">
                              {displayText}
                            </div>
                          )}
                        </div>
                        <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors shrink-0 ${appliedFilters.language === 'Arabic' ? 'rotate-180' : ''}`}>
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
