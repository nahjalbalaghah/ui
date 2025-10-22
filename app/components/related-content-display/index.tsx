'use client';
import React from 'react';
import Link from 'next/link';
import { BookText, FileText, MessageSquareQuote, ArrowRight } from 'lucide-react';
import { RelatedContentItem } from '@/app/utils/manuscript-linking';

interface RelatedContentDisplayProps {
  relatedContent: RelatedContentItem[];
  manuscriptTitle: string;
}

const RelatedContentDisplay: React.FC<RelatedContentDisplayProps> = ({ relatedContent, manuscriptTitle }) => {
  if (!relatedContent || relatedContent.length === 0) {
    return null;
  }

  const getIcon = (type: 'orations' | 'letters' | 'sayings') => {
    switch (type) {
      case 'orations':
        return <BookText className="w-5 h-5" />;
      case 'letters':
        return <FileText className="w-5 h-5" />;
      case 'sayings':
        return <MessageSquareQuote className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: 'orations' | 'letters' | 'sayings') => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getTypeColor = (type: 'orations' | 'letters' | 'sayings') => {
    switch (type) {
      case 'orations':
        return 'bg-blue-500';
      case 'letters':
        return 'bg-purple-500';
      case 'sayings':
        return 'bg-amber-500';
    }
  };

  // Group content by type
  const groupedContent = relatedContent.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, RelatedContentItem[]>);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#43896B] rounded-lg">
          <BookText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Related Content
        </h2>
      </div>

      <p className="text-gray-600 mb-6 text-sm">
        This manuscript contains the following orations, letters, and sayings from Nahj al-Balagha:
      </p>

      <div className="space-y-6">
        {Object.entries(groupedContent).map(([type, items]) => (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 ${getTypeColor(type as any)} rounded-md`}>
                {getIcon(type as any)}
                <span className="sr-only">{getTypeLabel(type as any)}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {getTypeLabel(type as any)}
              </h3>
              <span className="text-sm text-gray-500 ml-auto">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="grid gap-3 ml-9">
              {items.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={`/${item.type}/details/${item.id}`}
                  className="group bg-gray-50 hover:bg-[#43896B]/5 border border-gray-200 hover:border-[#43896B]/40 rounded-lg p-4 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-[#43896B] transition-colors mb-1">
                        {item.title}
                      </h4>
                      
                      {(item.pageNumber || item.folioNumber) && (
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                          {item.folioNumber && (
                            <span className="px-2 py-0.5 bg-white rounded border border-gray-200">
                              Folio: {item.folioNumber}
                            </span>
                          )}
                          {item.pageNumber && (
                            <span className="px-2 py-0.5 bg-white rounded border border-gray-200">
                              Page: {item.pageNumber}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#43896B] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Note: Page and folio numbers indicate where this content appears within the "{manuscriptTitle}" manuscript.
        </p>
      </div>
    </div>
  );
};

export default RelatedContentDisplay;
