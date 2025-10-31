'use client';
import React from 'react';
import { FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface TOCDisplayProps {
  heading?: string;
  TocEnglish?: string;
  TocArabic?: string;
  contentId: number;
  contentType: 'orations' | 'letters' | 'sayings';
  sermonNumber?: string;
}

export default function TOCDisplay({
  heading,
  TocEnglish,
  TocArabic,
  contentId,
  contentType,
  sermonNumber,
}: TOCDisplayProps) {
  const hasTOCData = heading || TocEnglish || TocArabic;

  if (!hasTOCData) {
    return null;
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#43896B]" />
          <h4 className="text-xs font-semibold text-[#43896B] uppercase tracking-wide">
            Table of Contents
          </h4>
        </div>
        <Link
          href={`/${contentType}/details/${contentId}/toc`}
          className="text-xs text-[#43896B] hover:underline font-medium"
        >
          View Full TOC
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-2">
        {heading && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Heading:</p>
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              {truncateText(heading, 100)}
            </p>
          </div>
        )}

        {TocEnglish && (
          <div>
            <p className="text-xs text-gray-500 mb-1">English:</p>
            <p className="text-sm text-gray-700 leading-snug font-brill">
              {truncateText(TocEnglish, 120)}
            </p>
          </div>
        )}

        {TocArabic && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Arabic:</p>
            <p className="text-sm text-gray-800 leading-snug font-taha" dir="rtl">
              {truncateText(TocArabic, 120)}
            </p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-gray-200">
        <Link
          href={`/${contentType}/details/${contentId}/toc`}
          className="inline-flex items-center gap-1.5 text-xs text-[#43896B] hover:text-[#43896B]/80 font-medium transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Read with Manuscripts
        </Link>
      </div>
    </div>
  );
}
