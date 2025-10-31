'use client';
import React from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import Button from '../button';

export interface ManuscriptLinkData {
  id: string;
  title: string;
  sourceReference: string;
  pageNumber?: string;
  folioNumber?: string;
}

interface ManuscriptReferenceProps {
  manuscripts: ManuscriptLinkData[];
  contentType: 'orations' | 'letters' | 'sayings';
}

const ManuscriptReference: React.FC<ManuscriptReferenceProps> = ({ manuscripts, contentType }) => {
  if (!manuscripts || manuscripts.length === 0) {
    return null;
  }

  return (
    <div 
      id="manuscript-references"
      className="bg-gradient-to-br from-[#43896B]/5 to-[#43896B]/10 rounded-2xl border border-[#43896B]/20 p-4 lg:p-6 mt-8 scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#43896B] rounded-lg">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">
          Related Manuscripts
        </h2>
      </div>
      
      <p className="text-gray-600 mb-6 text-sm">
        This {contentType.slice(0, -1)} appears in the following historical manuscripts:
      </p>

      <div className="space-y-4">
        {manuscripts.map((manuscript) => (
          <div
            key={manuscript.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#43896B]/40 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#43896B]" />
                  {manuscript.title}
                </h3>
                
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Source:</span> {manuscript.sourceReference}
                  </p>
                  
                  {(manuscript.pageNumber || manuscript.folioNumber) && (
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-700">
                        {manuscript.folioNumber ? 'Folio:' : 'Page:'}
                      </span>{' '}
                      {manuscript.folioNumber || manuscript.pageNumber}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={`/manuscripts?id=${manuscript.id}`}
              >
                <Button icon={<ExternalLink className="w-4 h-4 hidden lg:block" />} className='w-full' >
                    View Manuscript
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#43896B]/20">
        <p className="text-xs text-gray-500 italic">
          Note: Manuscript references are based on historical compilations and may vary across different editions.
        </p>
      </div>
    </div>
  );
};

export default ManuscriptReference;
