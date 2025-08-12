import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { type Post } from '@/api/posts';
import { formatTextWithBold, isArabicText } from '@/app/utils/text-formatting';

interface ContentDescriptionProps {
  content: Post;
  contentType: 'orations' | 'letters' | 'sayings';
}

const ContentDescription = ({ content, contentType }: ContentDescriptionProps) => {
  const heading = content.heading;
  
  const sortedParagraphs = [...content.paragraphs].sort((a, b) => {
    const parseNumber = (num: string) => {
      return num.split('.').map(n => parseInt(n, 10));
    };
    
    const aNumbers = parseNumber(a.number);
    const bNumbers = parseNumber(b.number);
    
    for (let i = 0; i < Math.max(aNumbers.length, bNumbers.length); i++) {
      const aNum = aNumbers[i] || 0;
      const bNum = bNumbers[i] || 0;
      if (aNum !== bNum) {
        return aNum - bNum;
      }
    }
    return 0;
  });

  const mainTranslation = content.translations?.find(t => t.type === 'en');

  const getContentLabel = () => {
    switch (contentType) {
      case 'orations':
        return 'Oration';
      case 'letters':
        return 'Letter';
      case 'sayings':
        return 'Saying';
      default:
        return 'Content';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-relaxed">
          {heading || `${getContentLabel()} Details`}
        </h1>

        {content.tags && content.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-[#43896B]/10 text-[#43896B] rounded-full border border-[#43896B]/20 hover:bg-[#43896B]/20 transition-colors"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
        {content.sermonNumber && (
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[#43896B] bg-[#43896B]/10 rounded-full border border-[#43896B]/20">
              {content.sermonNumber}
            </span>
          </div>
        )}

      {/* Main Title and Translation as First Paragraph */}
      {(content.title || mainTranslation) && (
        <div className="space-y-8 mb-8">
          <div className="border-b border-gray-100 pb-8">
            <div className="bg-[#F8F9FA] rounded-lg p-6 mb-4 border-r-4 border-[#43896B]">
              <div className="text-right">
                <p className="text-xl leading-relaxed text-gray-900 font-taha">
                  {formatTextWithBold(content.title, true)}
                </p>
              </div>
            </div>
            
            {mainTranslation && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-lg leading-relaxed text-gray-700 font-serif italic">
                  {formatTextWithBold(mainTranslation.text, false)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {sortedParagraphs.length > 0 && (
        <div className="space-y-8">
          {sortedParagraphs.map((paragraph) => {
            const englishTranslation = paragraph.translations?.find(t => t.type === 'en');
            
            return (
              <div key={paragraph.id} className="border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
                {paragraph.number && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[#43896B] bg-[#43896B]/10 rounded-full border border-[#43896B]/20">
                      {paragraph.number}
                    </span>
                  </div>
                )}
                
                <div className="bg-[#F8F9FA] rounded-lg p-6 mb-4 border-r-4 border-[#43896B]">
                  <div className="text-right">
                    <p className="text-xl leading-relaxed text-gray-900 font-taha">
                      {formatTextWithBold(paragraph.arabic, true)}
                    </p>
                  </div>
                </div>
                
                {englishTranslation && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <p className="text-lg leading-relaxed text-gray-700 font-serif italic">
                      {formatTextWithBold(englishTranslation.text, false)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sortedParagraphs.length === 0 && !(content.title || mainTranslation) && (
        <div className="text-center py-12">
          <p className="text-gray-500">No content available for this {contentType.slice(0, -1)}.</p>
        </div>
      )}
    </div>
  );
};

export default ContentDescription;
