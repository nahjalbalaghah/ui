'use client';
import React, { useState, useEffect } from 'react';
import { Book, Tag as TagIcon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type Post } from '@/api/posts';
import { formatTextWithFootnotes, isArabicText } from '@/app/utils/text-formatting';

interface ListViewItemProps {
  item: Post;
  contentType: 'orations' | 'letters' | 'sayings';
  displayMode?: 'both' | 'english-only' | 'arabic-only';
}

export default function ListViewItem({ item, contentType, displayMode = 'both' }: ListViewItemProps) {
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const truncateText = (text: string, maxLength: number, mobileMaxLength?: number) => {
    const effectiveMaxLength = isMobile && mobileMaxLength ? mobileMaxLength : maxLength;
    if (text.length <= effectiveMaxLength) return text;
    return text.substring(0, effectiveMaxLength) + '...';
  };

  const getCardLink = () => {
    const currentPage = searchParams.get('page');
    const currentSort = searchParams.get('sort');
    const currentSearch = searchParams.get('search');
    const baseUrl = `/${contentType}/details/${item.id}`;
    
    const params = new URLSearchParams();
    if (currentPage) params.set('returnPage', currentPage);
    if (currentSort) params.set('returnSort', currentSort);
    if (currentSearch) params.set('returnSearch', currentSearch);
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const tocHeading = item.heading || '';
  const tocEnglish = item.TocEnglish || '';
  const tocArabic = item.TocArabic || '';
  
  const arabicTitle = tocArabic || item.title || '';
  const englishHeading = tocHeading || '';
  
  const headingTranslation = item.translations?.find((t: any) => t.type === 'en')?.text || '';

  const sortedParagraphs = item.paragraphs?.slice().sort((a: any, b: any) => {
    const parseNumber = (num: string) => {
      const parts = num.split('.').map(p => parseInt(p, 10));
      return parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
    };
    return parseNumber(a.number || '999.999.999') - parseNumber(b.number || '999.999.999');
  });
  
  const firstParagraph = sortedParagraphs?.[0];
  const firstParagraphArabic = firstParagraph?.arabic || '';
  const firstParagraphEnglish = item?.translations?.find((t: any) => t.type === 'en')?.text || '';

  // For expanded view: use paragraph content if available, otherwise use main translations
  const mainTranslationEnglish = item.translations?.find((t: any) => t.type === 'en')?.text || '';
  const expandedEnglish = firstParagraphEnglish;
  const expandedArabic = item.title || '';

  // For preview (collapsed state): use TOC text as short summary
  const previewEnglish = tocEnglish || firstParagraphEnglish || headingTranslation;
  const previewArabic = tocArabic || firstParagraphArabic || arabicTitle;

  const getDisplayNumber = () => {
    if (item.sermonNumber) {
      const parts = item.sermonNumber.split('.');
      return parts.length > 1 ? parts[1] : parts[0];
    }
    return '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#43896B]/30 hover:bg-gray-50/50 transition-all duration-300 overflow-hidden">
      <div className="flex gap-0">
        <div className="flex-shrink-0 relative">
            <div className="flex-shrink-0 h-full relative flex items-center justify-center">
              {getDisplayNumber() ? (
                <div className="w-14 h-full bg-gradient-to-br from-[#43896B] via-[#43896B]/90 to-[#367556] rounded-br-2xl rounded-r-none flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                  <span className="text-lg font-black text-white drop-shadow-sm relative z-10">
                    {getDisplayNumber()}
                  </span>
                  <div className="absolute -right-2 top-0 w-4 h-full bg-gradient-to-r from-[#367556] to-transparent transform skew-x-12"></div>
                </div>
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-[#43896B] via-[#43896B]/90 to-[#367556] rounded-2xl rounded-r-none flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                  <Book className="w-7 h-7 text-white drop-shadow-sm relative z-10" />
                  <div className="absolute -right-2 top-0 w-4 h-full bg-gradient-to-r from-[#367556] to-transparent transform skew-x-12"></div>
                </div>
              )}
            </div>
        </div>

        <div className="flex-grow min-w-0 py-6 pr-6 pl-8">
          <div className="flex flex-col lg:flex-row items-end gap-4 lg:items-start justify-between">
            <div className="flex-grow min-w-0">
              {(displayMode === 'both' || displayMode === 'english-only') && englishHeading && (
                <h3 className="text-sm lg:text-lg font-bold text-gray-900 group-hover:text-[#43896B] transition-colors duration-300 leading-normal">
                  {truncateText(englishHeading, 150, 80)}
                </h3>
              )}
              {(displayMode === 'both' || displayMode === 'english-only') && previewEnglish && (
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                  {truncateText(previewEnglish.replace(/\[\d+\]/g, '').replace(/\n/g, ' ').trim(), 80, 150)}
                </p>
              )}
              {(displayMode === 'both' || displayMode === 'arabic-only') && arabicTitle && (
                <h3 className={`font-taha lg:text-lg font-bold text-gray-900 group-hover:text-[#43896B] transition-colors duration-300 leading-tight ${displayMode === 'both' && englishHeading ? 'mt-3' : ''}`} dir="rtl" style={{ lineHeight: '1.4' }}>
                  {truncateText(arabicTitle.replace(/[()]/g, ''), 150, 80)}
                </h3>
              )}
              {(displayMode === 'both' || displayMode === 'arabic-only') && previewArabic && previewArabic !== arabicTitle && (
                <p className="text-sm font-taha text-gray-700 mt-2 leading-relaxed" dir="rtl">
                  {truncateText(previewArabic.replace(/\[\d+\]/g, '').replace(/\n/g, ' ').trim(), 300, 150)}
                </p>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-[#43896B]/10 to-[#43896B]/5 text-[#43896B] rounded-full border border-[#43896B]/20 group-hover:from-[#43896B]/20 group-hover:to-[#43896B]/10 transition-all duration-300"
                    >
                      <TagIcon className="w-3.5 h-3.5" />
                      {tag.name}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link href={getCardLink()} className="size-10 rounded-full bg-gray-100 hover:bg-[#43896B] transition-all duration-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              {((item.paragraphs && item.paragraphs.length > 0) || arabicTitle || englishHeading) && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="size-10 rounded-full bg-gray-100 hover:bg-[#43896B] transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronDown className={`w-6 h-6 text-gray-400 hover:text-white transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && ((item.paragraphs && item.paragraphs.length > 0) || item.translations || item.title) && (
        <div className="border-t border-gray-100 px-8 py-6 bg-gray-50/50">
          {expandedEnglish || expandedArabic ? (
            <>
              {expandedArabic && (
                <div className={expandedEnglish ? "mt-4" : ""}>
                  <div className="text-right">
                    <p className="text-base font-brill leading-[2.5] text-gray-900 whitespace-pre-wrap" dir="rtl" style={{ fontSize: '1rem' }}>
                      {formatTextWithFootnotes(expandedArabic,  [], true, item.sermonNumber || 'main')}
                    </p>
                  </div>
                </div>
              )}
               {expandedEnglish && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-base leading-relaxed text-gray-700 font-brill whitespace-pre-wrap">
                    {formatTextWithFootnotes(expandedEnglish,  [], false, item.sermonNumber || 'main')}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No content available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
