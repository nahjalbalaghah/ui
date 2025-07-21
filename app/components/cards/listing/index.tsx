'use client';
import React from 'react';
import { Book, Calendar, FileText, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../../button';

interface ListingCardProps {
  sermon: {
    id: number;
    title: string;
    arabicTitle: string;
    description: string;
    chapter: number;
    type: string;
    date: string;
  };
  onClick?: () => void;
}

export default function ListingCard({ sermon, onClick }: ListingCardProps) {
  const router = useRouter();

  const handleViewDetails = (id: number) => {
    router.push(`/listings/details/${id}`);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#43896B]/20 transition-all duration-300 cursor-pointer group"
    >
      <div className="h-56 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 right-4">
            {[1, 2, 3, 4, 5, 6].map((line) => (
              <div 
                key={line} 
                className="h-1 bg-amber-800 rounded mb-3 transition-all duration-500 group-hover:bg-[#43896B]" 
              ></div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-24 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Book className="w-8 h-8 text-[#43896B]" />
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-[#43896B] text-white px-3 py-1 rounded-full text-sm font-semibold">
          Ch. {sermon.chapter}
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#43896B] transition-colors">
            {sermon.title}
          </h3>
          <p className="text-right text-gray-700 mb-3 font-arabic text-lg leading-relaxed" dir="rtl">
            {sermon.arabicTitle}
          </p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {sermon.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{sermon.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{sermon.type}</span>
          </div>
        </div>
        <Button variant='outlined' onClick={() => handleViewDetails(sermon.id)} >
            Read
        </Button>
      </div>
    </div>
  );
}