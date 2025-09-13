'use client';
import React from 'react';
import { Book, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type Post } from '@/api/posts';
import { formatTextWithFootnotes, isArabicText } from '@/app/utils/text-formatting';

interface ListViewItemProps {
  item: Post;
  contentType: 'orations' | 'letters' | 'sayings';
}

export default function ListViewItem({ item, contentType }: ListViewItemProps) {
  const searchParams = useSearchParams();
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCardLink = () => {
    const currentPage = searchParams.get('page');
    const baseUrl = `/${contentType}/details/${item.slug}`;
    return currentPage ? `${baseUrl}?returnPage=${currentPage}` : baseUrl;
  };

  const arabicTitle = item.title || '';
  const englishTitle = item.translations?.find((t: any) => t.type === 'en')?.text || item.heading || item.title || '';

  const getDisplayNumber = () => {
    if (item.sermonNumber) {
      const parts = item.sermonNumber.split('.');
      return parts.length > 1 ? parts[1] : parts[0];
    }
    return '';
  };

  return (
    <Link href={getCardLink()} className="block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#43896B]/30 hover:bg-gray-50/50 transition-all duration-300 cursor-pointer group overflow-hidden">
        <div className="flex gap-0">
          <div className="flex-shrink-0 relative">
              <div className="flex-shrink-0 h-full relative flex items-center justify-center">
                {getDisplayNumber() ? (
                  <div className="w-14 h-full bg-gradient-to-br from-[#43896B] via-[#43896B]/90 to-[#367556] rounded-2xl rounded-r-none flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
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
            <div className="flex items-center justify-between">
              <div className="flex-grow min-w-0">
                {arabicTitle && (
                  <h3 className="font-taha text-lg font-bold text-gray-900 group-hover:text-[#43896B] transition-colors duration-300 leading-tight mb-1" style={{ lineHeight: '1.4' }}>
                    {formatTextWithFootnotes(truncateText(arabicTitle, 150), item.footnotes || [], true, item.sermonNumber || 'main')}
                  </h3>
                )}
                {englishTitle && (
                  <h3 className="mt-3 font-bold text-gray-900 group-hover:text-[#43896B] transition-colors duration-300 leading-normal ">
                    {formatTextWithFootnotes(truncateText(englishTitle, 150), item.footnotes || [], false, item.sermonNumber || 'main')}
                  </h3>
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
              
              <div className="flex-shrink-0 ml-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#43896B] transition-all duration-300 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
