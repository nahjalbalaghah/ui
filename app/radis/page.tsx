'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { radisApi, RadisIntroduction, RadisApiResponse } from '@/api/posts';
import { Search, BookOpen, GitCompare, Book } from 'lucide-react';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import { useTextRefHighlight } from '@/app/hooks/useTextRefHighlight';
import ManuscriptComparisonModal from '@/app/components/manuscript-comparison-modal';
import Link from 'next/link';

function RadisContent() {
  const [radisIntroductions, setRadisIntroductions] = useState<RadisIntroduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [selectedRadisForComparison, setSelectedRadisForComparison] = useState<RadisIntroduction | null>(null);

  const { scrollToAndHighlight } = useTextRefHighlight({
    onHighlight: (ref) => {
      // Optional: Log or track highlight
      console.log('Highlighting ref:', ref);
    }
  });

  useEffect(() => {
    fetchRadisIntroductions();
  }, []);

  const fetchRadisIntroductions = async () => {
    try {
      setLoading(true);
      const response: RadisApiResponse = await radisApi.getRadisIntroductions();
      setRadisIntroductions(response.data);
      setError(null);

      // Check for highlight after data loads
      const urlParams = new URLSearchParams(window.location.search);
      const highlightRef = urlParams.get('highlightRef');
      const word = urlParams.get('word');

      if (highlightRef) {
        // Small delay to ensure rendering
        setTimeout(() => {
          scrollToAndHighlight(highlightRef);

          // Handle word highlighting if present
          if (word) {
            const element = document.querySelector(`[data-text-ref="${highlightRef}"]`);
            if (element) {
              // Target the translation container specifically
              const translationContainer = element.querySelector('.font-brill');
              if (translationContainer) {
                highlightWordInElement(translationContainer, word);
              }
            }
          }
        }, 500);
      }
    } catch (err) {
      console.error('Error fetching radis introductions:', err);
      setError("Failed to load Raḍī's introductions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRadisIntroductions();
      return;
    }

    try {
      setIsSearching(true);
      const response = await radisApi.searchRadisIntroductions(searchQuery);
      setRadisIntroductions(response.data);
    } catch (err) {
      console.error('Error searching radis introductions:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchRadisIntroductions();
  };

  // Function to highlight a word within a specific element
  const highlightWordInElement = (element: Element, word: string) => {
    // Find all text nodes in the element and wrap the matching word
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToReplace: Array<{ node: Text; matches: Array<{ start: number; end: number }> }> = [];
    let textNode;
    // Use case-insensitive substring matching
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
          const afterNode = document.createTextNode(after);
          node.parentNode?.insertBefore(span, node.nextSibling);
          node.parentNode?.insertBefore(afterNode, span.nextSibling);
        } else {
          node.parentNode?.insertBefore(span, node.nextSibling);
        }
        node.textContent = before;
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43896B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Raḍī's introductions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchRadisIntroductions}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
      <div className="bg-gradient-to-r from-[#43896B] to-[#5BA67C] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center mb-6">
              <h1 className="text-4xl lg:text-6xl font-bold">
                Raḍī's Introduction
              </h1>
            </div>
            <div className="text-2xl lg:text-3xl mb-6 font-[uthman-taha]" style={{ fontFamily: 'uthman-taha, serif' }}>
              مقدمة الرضي
            </div>
            <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
              The enlightening introduction by Al-Sharif Al-Raḍī, compiler of Nahj al-Balaghah,
              explaining his methodology and the profound wisdom contained within.
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 ">
              <Input
                type="text"
                placeholder="Search in Arabic or English..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching}
              icon={<Search size={16} />}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            {searchQuery && (
              <Button
                type="button"
                variant="outlined"
                onClick={clearSearch}
              >
                Clear
              </Button>
            )}
          </form>
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {radisIntroductions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                {searchQuery ? 'No results found for your search.' : 'No introductions available.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {radisIntroductions.map((radis) => (
                <div
                  key={radis.id}
                  id={`radis-${radis.number}`}
                  data-text-ref={radis.number}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="bg-[#43896B] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                          {radis.number}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Introduction {radis.number}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant='outlined'
                          icon={<GitCompare className='w-4 h-4' />}
                          onClick={() => {
                            setSelectedRadisForComparison(radis);
                            setIsComparisonModalOpen(true);
                          }}
                        >
                          Compare Manuscripts
                        </Button>
                        <Link href={`/manuscripts?section=${radis.number.startsWith('0.') ? radis.number : `0.${radis.number}`}`}>
                          <Button variant='outlined' icon={<Book className='w-4 h-4' />}>
                            View Manuscripts
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="mb-6">

                      <div
                        className="text-right lg:text-lg leading-loose text-gray-800 font-[uthman-taha] rounded-lg"
                        style={{ fontFamily: 'uthman-taha, serif' }}
                      >
                        {radis.arabic}
                      </div>
                    </div>
                    {radis.translation && (
                      <div className="mb-6">
                        <div className="text-gray-700 text-base lg:text-lg leading-relaxed p-4 border border-gray-200 font-brill rounded-lg">
                          {radis.translation.split('<center>').map((part, idx) => {
                            if (part.includes('</center>')) {
                              const [centeredText, rest] = part.split('</center>');
                              return (
                                <React.Fragment key={idx}>
                                  {/* Extra space before poetic lines */}
                                  <div className="my-6 text-center">{centeredText.trim()}</div>
                                  {rest && <div className="my-4">{rest.trim()}</div>}
                                </React.Fragment>
                              );
                            } else {
                              return <div key={idx} className="my-4">{part.trim()}</div>;
                            }
                          })}
                        </div>
                      </div>
                    )}


                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manuscript Comparison Modal */}
      {selectedRadisForComparison && (
        <ManuscriptComparisonModal
          isOpen={isComparisonModalOpen}
          onClose={() => {
            setIsComparisonModalOpen(false);
            setSelectedRadisForComparison(null);
          }}
          content={{
            id: selectedRadisForComparison.id,
            number: selectedRadisForComparison.number,
            arabic: selectedRadisForComparison.arabic,
            translation: selectedRadisForComparison.translation,
            heading: `Introduction ${selectedRadisForComparison.number}`,
            sermonNumber: `0.${selectedRadisForComparison.number}`,
            paragraphs: [],
            title: undefined,
            translations: undefined,
            footnotes: []
          }}
          contentType="radis"
        />
      )}
    </div>
  );
}

export default function RadisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RadisContent />
    </Suspense>
  );
}