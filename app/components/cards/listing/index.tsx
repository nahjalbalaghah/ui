'use client';
import React from 'react';
import { Book } from 'lucide-react';
import Link from 'next/link';
import { type Post } from '@/api/orations';

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
}

export default function ListingCard({ sermon, oration, onClick }: ListingCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCardLink = () => {
    if (oration) {
      return `/orations/details/${oration.slug}`;
    } else if (sermon) {
      return `/listings/details/${sermon.id}`;
    }
    return '#';
  };

  const isOration = !!oration;
  const data = isOration ? oration : sermon;

  if (!data) return null;

  const title = isOration ? oration!.title : sermon!.title;
  const arabicTitle = isOration ? oration!.title : sermon!.arabicTitle;
  const englishTranslation = isOration 
    ? oration!.translations?.find((t: any) => t.type === 'en')?.text || ''
    : sermon!.description;

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
            <p className="text-right text-gray-800 mb-2 font-arabic text-base leading-relaxed" dir="rtl">
              {truncateText(arabicTitle, 90)}
            </p>
            <h3 className="font-medium text-gray-600 text-sm line-clamp-2 group-hover:text-[#43896B] transition-colors">
              {truncateText(englishTranslation, 100)}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}