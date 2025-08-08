'use client';
import React from 'react';
import { Book, Tag as TagIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type Post } from '@/api/posts';

interface ListingCardProps {
  sermon?: {
    id: number;
    title: string;
    arabicTitle: string;
    description: string;
    chapter: number;
    type: string;
    date: string;
  };
  oration?: Post;
  onClick?: () => void;
  contentType?: 'orations' | 'letters' | 'sayings';
}

export default function ListingCard({ sermon, oration, onClick, contentType = 'orations' }: ListingCardProps) {
  const searchParams = useSearchParams();
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCardLink = () => {
    if (oration) {
      const currentPage = searchParams.get('page');
      const baseUrl = `/${contentType}/details/${oration.slug}`;
      return currentPage ? `${baseUrl}?returnPage=${currentPage}` : baseUrl;
    } else if (sermon) {
      return `/listings/details/${sermon.id}`;
    }
    return '#';
  };

  const isOration = !!oration;
  const data = isOration ? oration : sermon;

  if (!data) return null;

  const title = isOration ? oration!.title : sermon!.title;
  const englishTranslation = isOration 
    ? oration!.translations?.find((t: any) => t.type === 'en')?.text || ''
    : sermon!.description;

  const displayTitle = isOration ? (oration!.heading || englishTranslation || title) : title;

  return (
    <Link href={getCardLink()} className="block h-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#43896B]/20 transition-all duration-300 cursor-pointer group h-full flex flex-col">
        <div className="h-40 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-3 left-3 right-3">
              {[1, 2, 3, 4].map((line) => (
                <div 
                  key={line} 
                  className="h-1 bg-amber-800 rounded mb-2 transition-all duration-500 group-hover:bg-[#43896B]" 
                ></div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-20 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Book className="w-6 h-6 text-[#43896B]" />
            </div>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-gray-900 text-base line-clamp-3 group-hover:text-[#43896B] transition-colors mb-3 leading-relaxed">
              {truncateText(displayTitle, 120)}
            </h3>
            
            {isOration && oration!.tags && oration!.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {oration!.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#43896B]/10 text-[#43896B] rounded-full border border-[#43896B]/20 group-hover:bg-[#43896B]/20 transition-colors"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag.name}
                  </span>
                ))}
                {oration!.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{oration!.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}