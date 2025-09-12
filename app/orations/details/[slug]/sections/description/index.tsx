import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { type Post } from '@/api/posts';
import { formatTextWithFootnotes, isArabicText } from '@/app/utils/text-formatting';

interface OrationsDescriptionProps {
  oration: Post;
}

const OrationsDescription = ({ oration }: OrationsDescriptionProps) => {
  const heading = oration.heading;
  
  const sortedParagraphs = [...oration.paragraphs].sort((a, b) => {
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

  const mainTranslation = oration.translations?.find(t => t.type === 'en');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-relaxed">
          {heading || 'Oration Details'}
        </h1>

        {oration.tags && oration.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {oration.tags.map((tag) => (
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

      {/* Main Title and Translation as First Paragraph */}
      {(oration.title || mainTranslation) && (
        <div className="space-y-8 mb-8">
          <div className="border-b border-gray-100 pb-8">
            <div className="bg-[#F8F9FA] rounded-lg p-6 mb-4 border-r-4 border-[#43896B]">
              <div className="text-right">
                <p className="text-xl leading-relaxed text-gray-900 font-taha">
                  {formatTextWithFootnotes(oration.title, oration.footnotes || [], true)}
                </p>
              </div>
            </div>
            
            {mainTranslation && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-lg leading-relaxed text-gray-700 font-serif italic">
                  {formatTextWithFootnotes(mainTranslation.text, oration.footnotes || [], false)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {sortedParagraphs.length > 0 && (
        <div className="space-y-8">
          {sortedParagraphs.map((paragraph) => {
            const englishTranslation = paragraph.translations?.find(t => t.type === 'en')?.text;
            
            return (
              <div key={paragraph.id} className="border-l-4 border-[#43896B] pl-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-mono">
                    {paragraph.number}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="text-right leading-loose text-xl text-gray-800 font-taha" dir="rtl">
                    {formatTextWithFootnotes(paragraph.arabic, [...(oration.footnotes || []), ...(paragraph.footnotes || [])], true)}
                  </div>
                </div>
                
                {englishTranslation && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="leading-relaxed text-gray-700">
                      {formatTextWithFootnotes(englishTranslation, [...(oration.footnotes || []), ...(paragraph.footnotes || [])], false)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sortedParagraphs.length === 0 && !(oration.title || mainTranslation) && (
        <div className="text-center py-12">
          <p className="text-gray-500">No content available for this oration.</p>
        </div>
      )}
    </div>
  );
};

export default OrationsDescription;
