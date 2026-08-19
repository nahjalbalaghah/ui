'use client';
import React, { useState, useEffect } from 'react';
import { Tag as TagIcon, Book, BookOpen, ScrollText } from 'lucide-react';
import Link from 'next/link';
import Button from '@/app/components/button';
import { type Post, type Footnote, type Edition } from '@/api/orations';
import { postsApi } from '@/api/posts';
import { glossaryEntriesApi } from '@/api/glossary-entries';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayMode, setDisplayMode] = useState<'both' | 'english-only' | 'arabic-only'>('both');
  const [selectedTranslation, setSelectedTranslation] = useState('en');
  const [selectedEditionId, setSelectedEditionId] = useState<string>('');
  const [editions, setEditions] = useState<Edition[]>([]);
  const [availablePosts, setAvailablePosts] = useState<Post[]>([]);

  useEffect(() => {
    postsApi.getEditions().then(res => setEditions(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (content.post_base_documentId) {
      postsApi.getPostsByPostBaseDocumentId(content.post_base_documentId)
        .then(res => setAvailablePosts(res.data))
        .catch(console.error);
    }
  }, [content.post_base_documentId]);

  useEffect(() => {
    const editionParam = searchParams.get('edition');
    if (editionParam) {
      setSelectedEditionId(editionParam);
    } else if (content.editions && Array.isArray(content.editions) && content.editions.length > 0) {
      setSelectedEditionId(content.editions[0].id.toString());
    } else if (content.editions && content.editions.id) {
      setSelectedEditionId(content.editions.id.toString());
    }
  }, [content, searchParams]);

  const handleEditionChange = (editionId: string) => {
    setSelectedEditionId(editionId);

    // Update URL with edition parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('edition', editionId);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, '', newUrl);

    if (availablePosts.length > 0) {
      const targetPost = availablePosts.find(p => {
        if (p.editions && Array.isArray(p.editions)) {
          return p.editions.some((e: any) => e.id.toString() === editionId);
        } else if (p.editions && p.editions.id) {
          return p.editions.id.toString() === editionId;
        }
        return false;
      });

      if (targetPost && targetPost.id !== content.id) {
        // preserve other params when navigating to a different post
        router.push(`/content/details/${contentType}/${targetPost.id}?${params.toString()}`);
      }
    }
  };
  const [highlightedParagraphNumber, setHighlightedParagraphNumber] = useState<string | null>(null);
  const [radisIntroduction, setRadisIntroduction] = useState<{ arabic: string; translation: string } | null>(null);
  const [hasPostLevelSources, setHasPostLevelSources] = useState(false);
  const [paragraphNumbersWithSources, setParagraphNumbersWithSources] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRadisBlurb = async () => {
      if (content.sermonNumber) {
        try {
          // Import radisApi dynamically or use it if available in context
          const { radisApi } = await import('@/api/posts');
          const radis = await radisApi.getRadisIntroductionByNumber(content.sermonNumber);
          if (radis) {
            setRadisIntroduction({ arabic: radis.arabic, translation: radis.translation });
          }
        } catch (error) {
          console.error('Failed to fetch Radi introduction:', error);
        }
      }
    };
    fetchRadisBlurb();
  }, [content.sermonNumber]);

  useEffect(() => {
    // Check if any paragraph has sources in the appendix
    const hasAppendixSources = content.paragraphs.some(p => {
      const s = p.appendix_of_sources || (p as any).sources;
      if (!s) return false;
      if (Array.isArray(s)) return s.length > 0;
      if ((s as any).data && Array.isArray((s as any).data)) return (s as any).data.length > 0;
      return false;
    });

    if (hasAppendixSources) {
      setHasPostLevelSources(true);
    }

    // The source relation is not consistently included in nested post
    // responses, so use the source endpoint as the authoritative fallback.
    if (content.sermonNumber) {
      glossaryEntriesApi.getGlossaryEntries({ postSermonNumber: content.sermonNumber, pageSize: 200 })
        .then(res => {
          setHasPostLevelSources(hasAppendixSources || res.data.length > 0);
          setParagraphNumbersWithSources(new Set(
            res.data.flatMap(source => source.paragraphs || [])
              .map(paragraph => paragraph.number)
              .filter(Boolean)
          ));
        })
        .catch(() => {
          setHasPostLevelSources(hasAppendixSources);
          setParagraphNumbersWithSources(new Set());
        });
    } else {
      setParagraphNumbersWithSources(new Set());
    }
  }, [content.paragraphs, content.sermonNumber]);

  let allReferences: string[] = [];
  const heading = content.heading;

  // Handle highlighting when component mounts or highlightRef changes
  useEffect(() => {
    if (highlightRef) {
      setHighlightedParagraphNumber(highlightRef);

      // Give DOM time to render and then scroll to it
      const timer = setTimeout(() => {
        const candidates: string[] = [];
        const addCandidate = (v?: string | null) => {
          if (!v) return;
          if (candidates.includes(v)) return;
          candidates.push(v);
        };

        addCandidate(highlightRef);

        const highlightParts = highlightRef.split('.').filter(Boolean);
        if (highlightParts.length >= 2) addCandidate(highlightParts.slice(1).join('.'));
        if (highlightParts.length >= 3) addCandidate(highlightParts.slice(2).join('.'));

        if (content.sermonNumber && highlightParts.length >= 3) {
          const last = highlightParts[highlightParts.length - 1];
          addCandidate(`${content.sermonNumber}.${last}`);
        }

        let element: Element | null = null;
        for (const candidate of candidates) {
          element = document.querySelector(`[data-text-ref="${candidate}"]`);
          if (element) break;
        }

        // If no exact match, try to find a partial match (paragraph that contains this ref)
        if (!element) {
          // Try matching with sermon number prefix
          const allTextRefElements = document.querySelectorAll('[data-text-ref]');
          for (const el of allTextRefElements) {
            const refValue = el.getAttribute('data-text-ref');
            if (
              refValue &&
              (candidates.includes(refValue) ||
                candidates.some((c) => refValue === c || refValue.startsWith(c + '.') || c.startsWith(refValue + '.')))
            ) {
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
  }, [highlightRef, englishWord, arabicWord, content.sermonNumber]);

  const isHighlightedTextRef = (refValue?: string | null) => {
    if (!highlightedParagraphNumber || !refValue) return false;
    if (refValue === highlightedParagraphNumber) return true;
    if (highlightedParagraphNumber.startsWith(refValue + '.') || refValue.startsWith(highlightedParagraphNumber + '.')) return true;

    const highlightParts = highlightedParagraphNumber.split('.').filter(Boolean);
    const suffix1 = highlightParts.length >= 2 ? highlightParts.slice(1).join('.') : null;
    const suffix2 = highlightParts.length >= 3 ? highlightParts.slice(2).join('.') : null;

    if (suffix1 && (refValue === suffix1 || suffix1.startsWith(refValue + '.') || refValue.startsWith(suffix1 + '.'))) return true;
    if (suffix2 && refValue === suffix2) return true;

    if (content.sermonNumber && highlightParts.length >= 3) {
      const last = highlightParts[highlightParts.length - 1];
      if (refValue === `${content.sermonNumber}.${last}`) return true;
    }

    return false;
  };

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

  const allFootnotesRaw = [
    ...(content.footnotes || []),
    ...content.paragraphs.flatMap(p => p.footnotes || [])
  ];

  // Deduplicate by ID
  const allFootnotes = Array.from(new Map(allFootnotesRaw.map(fn => [fn.id, fn])).values());

  // Filter footnotes based on displayMode and content presence
  const filteredFootnotes = allFootnotes.filter(fn => {
    const hasEnglish = fn.english_translation && fn.english_translation.trim().length > 0;
    const hasArabic = fn.arabic_interpretation && fn.arabic_interpretation.trim().length > 0;

    if (displayMode === 'english-only') return hasEnglish;
    if (displayMode === 'arabic-only') return hasArabic;
    return hasEnglish || hasArabic;
  });

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

  const mainTranslation =
    content.translations?.find((t: any) => t.type === selectedTranslation) ||
    content.translations?.find((t: any) => typeof t?.text === 'string' && t.text.trim().length > 0);

  const mainTranslationText = mainTranslation?.text?.trim() || '';

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

  const editionOptionsRaw = editions
    .filter((ed: Edition) => availablePosts.some((p: Post) => {
      if (p.editions && Array.isArray(p.editions)) {
        return p.editions.some((e: any) => e.id === ed.id);
      } else if (p.editions && p.editions.id) {
        return p.editions.id === ed.id;
      }
      return false;
    }))
    .map(ed => ({
      value: ed.id.toString(),
      label: ed.title
    }));

  // Deduplicate editions based on ID
  const editionOptions = Array.from(new Map(editionOptionsRaw.map(item => [item.value, item])).values());

  if (editionOptions.length === 0 && selectedEditionId) {
    const currentEd = editions.find(e => e.id.toString() === selectedEditionId);
    if (currentEd) {
      editionOptions.push({ value: currentEd.id.toString(), label: currentEd.title });
    }
  }

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

        {radisIntroduction && (
          <div className="mt-8 bg-[#43896B]/5 border-l-4 border-[#43896B] p-6 rounded-r-xl">
            <div className="space-y-4">
              <div className="text-right">
                <p className="text-lg leading-relaxed text-gray-900 font-taha italic" dir="rtl">
                  {radisIntroduction.arabic}
                </p>
              </div>
              <div className="text-left">
                <p className="text-lg leading-relaxed text-gray-700 font-brill italic">
                  {radisIntroduction.translation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {content.sermonNumber && (
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[#43896B] bg-[#43896B]/10 rounded-full border border-[#43896B]/20">
            {content.sermonNumber}
          </span>
          {hasPostLevelSources && (
            <Link href={`/${contentType}/details/${content.id}/sources?num=${content.sermonNumber}`}>
              <Button variant="outlined" icon={<ScrollText className="w-4 h-4" />} className="shrink-0 py-1! px-2! text-xs!">
                Sources
              </Button>
            </Link>
          )}
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
            {(displayMode === 'both' || displayMode === 'english-only') && mainTranslationText && (
              (() => {
                const refs = extractReferences(mainTranslationText);
                allReferences = allReferences.concat(refs);
                console.log('Main translation footnotes debug:', {
                  contentFootnotes: content.footnotes?.length || 0,
                  allFootnotes: allFootnotes.length,
                  mainTranslationText: mainTranslationText.substring(0, 100) + '...',
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
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <p className="lg:text-xl leading-relaxed text-gray-700 font-brill whitespace-pre-wrap flex-1" >
                        {formatTextWithFootnotes(mainTranslationText, allFootnotes, false, content.sermonNumber || 'main')}
                      </p>
                    </div>
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
            const englishTranslation =
              paragraph.translations?.find((t: any) => t.type === selectedTranslation) ||
              paragraph.translations?.find((t: any) => typeof t?.text === 'string' && t.text.trim().length > 0);

            const englishTranslationText = englishTranslation?.text?.trim() || '';
            return (
              <div
                key={paragraph.id}
                data-text-ref={paragraph.number}
                className={`border-b border-gray-100 pb-8 last:border-b-0 last:pb-0 ${isHighlightedTextRef(paragraph.number) ? 'highlight-text-ref' : ''}`}
              >
                {paragraph.number && (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-[#43896B] bg-[#43896B]/10 rounded-full border border-[#43896B]/20">
                      {paragraph.number}
                    </span>
                    {(() => {
                      const s = paragraph.appendix_of_sources || (paragraph as any).sources;
                      const hasSources = s && (Array.isArray(s) ? s.length > 0 : ((s as any).data && Array.isArray((s as any).data) && (s as any).data.length > 0));
                      return hasSources || paragraphNumbersWithSources.has(paragraph.number);
                    })() && (
                      <Link href={`/${contentType}/details/${content.id}/sources?num=${paragraph.number}`}>
                        <Button variant="outlined" icon={<ScrollText className="w-4 h-4" />} className="shrink-0 py-1! px-2! text-xs!">
                          Sources
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
                {(displayMode === 'both' || displayMode === 'arabic-only') && paragraph.arabic && (() => {
                  // Split the Arabic text by line breaks, detect <center> parts
                  const lines = paragraph.arabic.split(/\n+/).filter(Boolean);

                  return (
                    <div className="p-0 mb-4 border-none">
                      {lines.map((line: string, index: number) => {
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

                {(displayMode === 'both' || displayMode === 'english-only') && englishTranslationText && (() => {
                  const refs = extractReferences(englishTranslationText);
                  allReferences = allReferences.concat(refs);
                  console.log('Paragraph footnotes debug:', {
                    paragraphId: paragraph.id,
                    paragraphNumber: paragraph.number,
                    contentFootnotes: content.footnotes?.length || 0,
                    paragraphFootnotes: paragraph.footnotes?.length || 0,
                    allFootnotes: allFootnotes.length,
                    englishTranslationText: englishTranslationText.substring(0, 100) + '...',
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
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <p className="lg:text-xl leading-relaxed text-gray-700 font-brill whitespace-pre-wrap flex-1">
                          {formatTextWithFootnotes(englishTranslationText, allFootnotes, false, paragraph.number)}
                        </p>
                      </div>
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

      {filteredFootnotes.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="bg-[#43896B]/10 p-2 rounded-lg">
              <Book className="w-6 h-6 text-[#43896B]" />
            </div>
            Footnotes
          </h2>
          <div className="space-y-6">
            {filteredFootnotes
              .sort((a: Footnote, b: Footnote) => {
                const parse = (s: string) => s.split('.').map(n => parseInt(n) || 0);
                const ap = parse(a.number);
                const bp = parse(b.number);
                for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
                  if ((ap[i] || 0) !== (bp[i] || 0)) return (ap[i] || 0) - (bp[i] || 0);
                }
                return 0;
              })
              .map((footnote: Footnote) => (
                <div
                  key={footnote.id}
                  className="group relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl hover:bg-[#43896B]/5 transition-all duration-300 border border-transparent hover:border-[#43896B]/10 cursor-pointer"
                  onClick={() => {
                    // Try to scroll to specific reference first (English preferred, then Arabic)
                    const englishRef = document.getElementById(`footnote-ref-${footnote.id}-english`);
                    const arabicRef = document.getElementById(`footnote-ref-${footnote.id}-arabic`);

                    const target = englishRef || arabicRef || document.querySelector(`[data-text-ref="${footnote.number}"]`);

                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Add a brief highlight effect if it's a specific ref
                      if (englishRef || arabicRef) {
                        const pulseEl = (englishRef || arabicRef) as HTMLElement;
                        pulseEl.classList.add('bg-yellow-200/50', 'transition-colors', 'duration-500');
                        setTimeout(() => {
                          pulseEl.classList.remove('bg-yellow-200/50');
                        }, 2000);
                      }
                    }
                  }}
                >
                  <div className="flex items-start shrink-0">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#43896B]/10 text-[#43896B] font-bold text-lg group-hover:bg-[#43896B] group-hover:text-white transition-colors duration-300">
                      {footnote.number.split('.').pop()}
                    </span>
                  </div>
                    <div className="flex-1 space-y-3">
                      {(displayMode === 'both' || displayMode === 'english-only') && footnote.english_translation && footnote.english_translation.trim() !== '' && (
                        <p className="text-lg text-gray-800 leading-relaxed font-brill">
                          {footnote.english_translation}
                        </p>
                      )}
                      {(displayMode === 'both' || displayMode === 'arabic-only') && footnote.arabic_interpretation && footnote.arabic_interpretation.trim() !== '' && (
                        <div className={`pt-2 ${displayMode === 'both' && footnote.english_translation && footnote.english_translation.trim() !== '' ? 'border-t border-gray-100 mt-2' : ''}`}>
                          <p className="text-xl text-gray-900 leading-relaxed font-taha text-right" dir="rtl">
                            {footnote.arabic_interpretation}
                          </p>
                        </div>
                      )}
                    </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDescription;
