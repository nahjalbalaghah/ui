'use client';
import React, { useState, useEffect } from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { type Post } from '@/api/posts';
import { formatTextWithFootnotes, isArabicText } from '@/app/utils/text-formatting';
import { extractReferences, replaceReferencesWithSuperscripts } from '@/app/utils';
import Select from '@/app/components/select';

interface ContentDescriptionProps {
  content: Post;
  contentType: 'orations' | 'letters' | 'sayings';
  highlightRef?: string | null;
  englishWord?: string | null;
  arabicWord?: string | null;
}

const ContentDescription = ({ content, contentType, highlightRef, englishWord, arabicWord }: ContentDescriptionProps) => {
  const [displayMode, setDisplayMode] = useState<'both' | 'english-only' | 'arabic-only'>('both');
  const [selectedTranslation, setSelectedTranslation] = useState('en');
  const [highlightedParagraphNumber, setHighlightedParagraphNumber] = useState<string | null>(null);

  let allReferences: string[] = [];
  const heading = content.heading;

  // Handle highlighting when component mounts or highlightRef changes
  useEffect(() => {
    if (highlightRef) {
      // The highlightRef is already the full paragraph number (e.g., "1.26.1")
      setHighlightedParagraphNumber(highlightRef);
      
      // Give DOM time to render and then scroll to it
      const timer = setTimeout(() => {
        // Try exact match first
        let element = document.querySelector(`[data-text-ref="${highlightRef}"]`);
        
        // If no exact match, try to find a partial match (paragraph that contains this ref)
        if (!element) {
          // Try matching with sermon number prefix
          const allTextRefElements = document.querySelectorAll('[data-text-ref]');
          for (const el of allTextRefElements) {
            const refValue = el.getAttribute('data-text-ref');
            if (refValue && (refValue === highlightRef || refValue.startsWith(highlightRef + '.') || highlightRef.startsWith(refValue + '.'))) {
              element = el;
              break;
            }
          }
        }
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add highlight class
          element.classList.add('highlight-text-ref');
          
          // If we have a word to highlight, do that too
          const wordToHighlight = englishWord || arabicWord;
          if (wordToHighlight) {
            // Find the text container within this element
            // Look for the paragraph with font-brill class (English) or font-taha class (Arabic)
            const textElement = englishWord 
              ? element.querySelector('.font-brill') 
              : element.querySelector('.font-taha');
            if (textElement) {
              highlightWordInParagraph(textElement, wordToHighlight);
            } else {
              // Try to find any text container
              const anyTextElement = element.querySelector('p');
              if (anyTextElement) {
                highlightWordInParagraph(anyTextElement, wordToHighlight);
              }
            }
          }
        }
      }, 500); // Increased timeout slightly to ensure rendering

      return () => clearTimeout(timer);
    }
  }, [highlightRef, englishWord, arabicWord]);

  // Function to highlight a word within a specific paragraph
  const highlightWordInParagraph = (paragraphDiv: Element, word: string) => {
    // Find all text nodes in the paragraph and wrap the matching word
    const walker = document.createTreeWalker(
      paragraphDiv,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToReplace: Array<{ node: Text; matches: Array<{ start: number; end: number }> }> = [];
    let textNode;
    // Use case-insensitive substring matching (not word boundaries)
    // This way "adder" matches "adders", "adder's", etc.
    const wordRegex = new RegExp(word, 'gi');

    // Collect all text nodes with the word
    while (textNode = walker.nextNode() as Text | null) {
      let match;
      const matches: Array<{ start: number; end: number }> = [];
      wordRegex.lastIndex = 0;
      
      while ((match = wordRegex.exec(textNode.textContent || '')) !== null) {
        matches.push({ start: match.index, end: wordRegex.lastIndex });
      }

      if (matches.length > 0) {
        nodesToReplace.push({ node: textNode, matches });
      }
    }

    // Replace nodes with highlighted spans
    for (const { node, matches } of nodesToReplace.reverse()) {
      for (const match of matches.reverse()) {
        const before = node.textContent?.substring(0, match.start) || '';
        const highlighted = node.textContent?.substring(match.start, match.end) || '';
        const after = node.textContent?.substring(match.end) || '';

        const span = document.createElement('span');
        span.className = 'highlight-word';
        span.textContent = highlighted;

        if (after) {
          node.textContent = before;
          const afterNode = document.createTextNode(after);
          node.parentNode?.insertBefore(span, node.nextSibling);
          node.parentNode?.insertBefore(afterNode, span.nextSibling);
        } else {
          node.textContent = before;
          node.parentNode?.insertBefore(span, node.nextSibling);
        }
      }
    }
  };

  const allFootnotes = [
    ...(content.footnotes || []),
    ...content.paragraphs.flatMap(p => p.footnotes || [])
  ];

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

  const mainTranslation = content.translations?.find(t => t.type === selectedTranslation);

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

  const displayOptions = [
    { value: 'both', label: 'English and Arabic' },
    { value: 'english-only', label: 'English Only' },
    { value: 'arabic-only', label: 'Arabic Only' },
  ];

  const availableTranslations = content.translations || [];
  const translationOptions = availableTranslations.map(t => ({
    value: t.type,
    label: t.type === 'en' ? 'English' : t.type.toUpperCase()
  }));

  // Utility: clean unwanted HTML tags and entities from Arabic text
  const cleanArabicText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/<center>|<\/center>/gi, '')   // remove center tags
      .replace(/<span[^>]*>|<\/span>/gi, '') // remove span tags
      .replace(/&nbsp;/gi, ' ')              // replace non-breaking spaces
      .trim();
  };


  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-4 leading-relaxed whitespace-pre-wrap">
          {heading || `${getContentLabel()} Details`}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {content.tags && content.tags.length > 0 && (
            <>
              {content.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-[#43896B]/10 text-[#43896B] rounded-full border border-[#43896B]/20 hover:bg-[#43896B]/20 transition-colors"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag.name}
                </span>
              ))}
            </>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Select
            options={displayOptions}
            value={displayMode}
            onChange={(value) => setDisplayMode(value as 'both' | 'english-only' | 'arabic-only')}
            placeholder="Display Mode"
            className="w-full sm:w-48"
          />
          {availableTranslations.length > 1 && (
            <Select
              options={translationOptions}
              value={selectedTranslation}
              onChange={setSelectedTranslation}
              placeholder="Translation"
              className="w-full sm:w-40"
            />
          )}
        </div>
      </div>
      {content.sermonNumber && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[#43896B] bg-[#43896B]/10 rounded-full border border-[#43896B]/20">
            {content.sermonNumber}
          </span>
        </div>
      )}
      {(content.title || mainTranslation) && (
        <div 
          className={`space-y-8 mb-8 ${highlightedParagraphNumber === content.sermonNumber ? 'highlight-text-ref' : ''}`}
          data-text-ref={content.sermonNumber}
        >
          <div className="border-b border-gray-100 pb-8">
            {(displayMode === 'both' || displayMode === 'arabic-only') && content.title && (
              <div className="p-0 mb-4 border-none">
                <div className="text-right">
                  <p className="lg:text-xl leading-relaxed text-gray-900 font-taha whitespace-pre-wrap" dir="rtl">
                    {formatTextWithFootnotes(cleanArabicText(content.title), allFootnotes, true, content.sermonNumber || 'main')}
                  </p>
                </div>
              </div>
            )}
            {(displayMode === 'both' || displayMode === 'english-only') && mainTranslation && (
              (() => {
                const refs = extractReferences(mainTranslation.text);
                allReferences = allReferences.concat(refs);
                console.log('Main translation footnotes debug:', {
                  contentFootnotes: content.footnotes?.length || 0,
                  allFootnotes: allFootnotes.length,
                  mainTranslationText: mainTranslation.text.substring(0, 100) + '...',
                  footnoteDetails: allFootnotes.map(f => ({
                    id: f.id,
                    number: f.number,
                    english_word: f.english_word,
                    arabic_word: f.arabic_word,
                    section: f.section
                  }))
                });

                return (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <p className="lg:text-xl leading-relaxed text-gray-700 font-brill whitespace-pre-wrap" >
                      {formatTextWithFootnotes(mainTranslation.text, allFootnotes, false, content.sermonNumber || 'main')}
                    </p>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {sortedParagraphs.length > 0 && (
        <div className="space-y-8">
          {sortedParagraphs.map((paragraph) => {
            const englishTranslation = paragraph.translations?.find(t => t.type === selectedTranslation);
            return (
              <div 
                key={paragraph.id} 
                data-text-ref={paragraph.number}
                className={`border-b border-gray-100 pb-8 last:border-b-0 last:pb-0 ${highlightedParagraphNumber === paragraph.number ? 'highlight-text-ref' : ''}`}
              >
                {paragraph.number && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[#43896B] bg-[#43896B]/10 rounded-full border border-[#43896B]/20">
                      {paragraph.number}
                    </span>
                  </div>
                )}
                {(displayMode === 'both' || displayMode === 'arabic-only') && paragraph.arabic && (() => {
                  // Split the Arabic text by line breaks, detect <center> parts
                  const lines = paragraph.arabic.split(/\n+/).filter(Boolean);

                  return (
                    <div className="p-0 mb-4 border-none">
                      {lines.map((line, index) => {
                        const isCentered = /<center>/i.test(line);
                        const cleanedLine = line
                          .replace(/<center>|<\/center>/gi, '')
                          .replace(/<span[^>]*>|<\/span>/gi, '')
                          .replace(/&nbsp;/gi, ' ')
                          .trim();

                        if (!cleanedLine) return null;

                        return (
                          <div key={index} className={isCentered ? 'text-center' : 'text-right'}>
                            <p
                              className={`lg:text-xl leading-loose text-gray-900 font-taha whitespace-pre-wrap ${isCentered ? 'inline-block' : ''
                                }`}
                              dir="rtl"
                            >
                              {formatTextWithFootnotes(cleanedLine, allFootnotes, true, paragraph.number)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {(displayMode === 'both' || displayMode === 'english-only') && englishTranslation && (() => {
                  const refs = extractReferences(englishTranslation.text);
                  allReferences = allReferences.concat(refs);
                  console.log('Paragraph footnotes debug:', {
                    paragraphId: paragraph.id,
                    paragraphNumber: paragraph.number,
                    contentFootnotes: content.footnotes?.length || 0,
                    paragraphFootnotes: paragraph.footnotes?.length || 0,
                    allFootnotes: allFootnotes.length,
                    englishTranslationText: englishTranslation.text.substring(0, 100) + '...',
                    footnoteDetails: allFootnotes.map(f => ({
                      id: f.id,
                      number: f.number,
                      english_word: f.english_word,
                      arabic_word: f.arabic_word,
                      section: f.section
                    }))
                  });

                  return (
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <p className="lg:text-xl leading-relaxed text-gray-700 font-brill whitespace-pre-wrap">
                        {formatTextWithFootnotes(englishTranslation.text, allFootnotes, false, paragraph.number)}
                      </p>
                    </div>
                  );
                })()}
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
