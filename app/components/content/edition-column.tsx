'use client';
import React, { useState, useEffect } from 'react';
import { type Post, type Footnote, type Edition } from '@/api/orations';
import { postsApi } from '@/api/posts';
import { formatTextWithFootnotes, isArabicText } from '@/app/utils/text-formatting';
import Select from '@/app/components/select';
import { Book, Tag as TagIcon } from 'lucide-react';

interface EditionColumnProps {
  content: Post;
  availablePosts: Post[];
  contentType: 'orations' | 'letters' | 'sayings';
  highlightRef?: string | null;
  englishWord?: string | null;
  arabicWord?: string | null;
  onEditionChange: (editionId: string) => void;
  side: 'left' | 'right';
}

const EditionColumn = ({
  content,
  availablePosts,
  contentType,
  highlightRef,
  englishWord,
  arabicWord,
  onEditionChange,
  side
}: EditionColumnProps) => {
  const [displayMode, setDisplayMode] = useState<'both' | 'english-only' | 'arabic-only'>('both');
  const [selectedTranslation, setSelectedTranslation] = useState('en');
  const [selectedEditionId, setSelectedEditionId] = useState<string>('');
  const [editions, setEditions] = useState<Edition[]>([]);

  useEffect(() => {
    postsApi.getEditions().then(res => setEditions(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (content.editions && Array.isArray(content.editions) && content.editions.length > 0) {
      setSelectedEditionId(content.editions[0].id.toString());
    } else if (content.editions && content.editions.id) {
      setSelectedEditionId(content.editions.id.toString());
    }
  }, [content]);

  const handleEditionChange = (editionId: string) => {
    setSelectedEditionId(editionId);
    onEditionChange(editionId);
  };

  const safeParagraphs = Array.isArray(content.paragraphs) ? content.paragraphs : [];
  const safeFootnotes = Array.isArray(content.footnotes) ? content.footnotes : [];

  const allFootnotesRaw = [
    ...safeFootnotes,
    ...safeParagraphs.flatMap(p => p.footnotes || [])
  ];
  const allFootnotes = Array.from(new Map(allFootnotesRaw.map(fn => [fn.id, fn])).values());

  const sortedParagraphs = [...safeParagraphs].sort((a, b) => {
    const parseNumber = (num: string) => (num || '').split('.').map(n => parseInt(n, 10));
    const aNums = parseNumber(a.number);
    const bNums = parseNumber(b.number);
    for (let i = 0; i < Math.max(aNums.length, bNums.length); i++) {
      const an = aNums[i] || 0;
      const bn = bNums[i] || 0;
      if (an !== bn) return an - bn;
    }
    return 0;
  });

  const mainTranslation =
    content.translations?.find((t: any) => t.type === selectedTranslation) ||
    content.translations?.find((t: any) => typeof t?.text === 'string' && t.text.trim().length > 0);

  const mainTranslationText = mainTranslation?.text?.trim() || '';

  const displayOptions = [
    { value: 'both', label: 'Both' },
    { value: 'english-only', label: 'English Only' },
    { value: 'arabic-only', label: 'Arabic Only' },
  ];

  const translationOptions = (content.translations || []).map(t => ({
    value: t.type,
    label: t.type === 'en' ? 'English' : t.type.toUpperCase()
  }));

  const editionOptionsRaw = editions
    .filter((ed: Edition) => {
      // Show all editions that are represented in availablePosts
      return availablePosts.some((p: Post) => {
        const pEditions = p.editions;
        if (Array.isArray(pEditions)) {
          return pEditions.some((e: any) => e.id === ed.id || e.id?.toString() === ed.id?.toString());
        } else if (pEditions && pEditions.id) {
          return pEditions.id === ed.id || pEditions.id?.toString() === ed.id?.toString();
        }
        return false;
      });
    })
    .map(ed => ({
      value: ed.id.toString(),
      label: ed.title
    }));
  const editionOptions = Array.from(new Map(editionOptionsRaw.map(item => [item.value, item])).values());

  const cleanArabicText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/<center>|<\/center>/gi, '')
      .replace(/<span[^>]*>|<\/span>/gi, '')
      .replace(/&nbsp;/gi, ' ')
      .trim();
  };

  const headingText = (content.heading || content.TocEnglish || '').trim();
  const arabicTitle = cleanArabicText(content.title || '');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col">
      {/* Column Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/95 rounded-t-2xl">
        <div className="flex flex-col gap-3">
          <Select
            options={editionOptions}
            value={selectedEditionId}
            onChange={handleEditionChange}
            placeholder="Select Edition"
            className="w-full"
          />
          <div className="flex gap-2">
            <Select
              options={displayOptions}
              value={displayMode}
              onChange={(value) => setDisplayMode(value as any)}
              placeholder="Display"
              className="flex-1"
            />
            {translationOptions.length > 1 && (
              <Select
                options={translationOptions}
                value={selectedTranslation}
                onChange={setSelectedTranslation}
                placeholder="Translation"
                className="flex-1"
              />
            )}
          </div>

          {(headingText || arabicTitle) && (
            <div className="pt-2 border-t border-gray-100">
              {headingText && (
                <p className="text-xl text-gray-700 font-inter font-bold leading-snug line-clamp-2">
                  {headingText}
                </p>
              )}
              {arabicTitle && (
                <p className="text-2xl text-gray-900 font-taha font-bold text-right leading-relaxed mt-2" dir="rtl">
                  {arabicTitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 select-none">
        <div className="space-y-8">
            {/* Title Section */}
            {(content.title || mainTranslationText) && (
                <div className="border-b border-gray-100 pb-6">
                    {(displayMode === 'both' || displayMode === 'arabic-only') && content.title && (
                        <div className="text-right mb-4">
                            <p className="text-lg leading-relaxed text-gray-900 font-taha" dir="rtl">
                                {formatTextWithFootnotes(cleanArabicText(content.title), allFootnotes, true, content.sermonNumber || 'main')}
                            </p>
                        </div>
                    )}
                    {(displayMode === 'both' || displayMode === 'english-only') && mainTranslationText && (
                        <p className="text-lg leading-relaxed text-gray-700 font-brill">
                            {formatTextWithFootnotes(mainTranslationText, allFootnotes, false, content.sermonNumber || 'main')}
                        </p>
                    )}
                </div>
            )}

            {/* Paragraphs */}
            {sortedParagraphs.map((paragraph) => {
                 const englishTranslation =
                 paragraph.translations?.find((t: any) => t.type === selectedTranslation) ||
                 paragraph.translations?.find((t: any) => typeof t?.text === 'string' && t.text.trim().length > 0);

                const englishTranslationText = englishTranslation?.text?.trim() || '';

                return (
                    <div key={paragraph.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#43896B] bg-[#43896B]/10 px-2 py-0.5 rounded">
                                {paragraph.number}
                            </span>
                        </div>
                        {(displayMode === 'both' || displayMode === 'arabic-only') && paragraph.arabic && (
                            <div className="text-right">
                                <p className="text-lg leading-loose text-gray-900 font-taha" dir="rtl">
                                    {formatTextWithFootnotes(cleanArabicText(paragraph.arabic), allFootnotes, true, paragraph.number)}
                                </p>
                            </div>
                        )}
                        {(displayMode === 'both' || displayMode === 'english-only') && englishTranslationText && (
                            <p className="text-lg leading-relaxed text-gray-700 font-brill">
                                {formatTextWithFootnotes(englishTranslationText, allFootnotes, false, paragraph.number)}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default EditionColumn;
