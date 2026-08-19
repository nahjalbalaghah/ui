'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { type Post, postsApi } from '@/api/posts';
import { audioApi } from '@/api/audio';
import ContentDescription from './content-description';
import ParallelView from './parallel-view';
import { ArrowLeft, Book, GitCompare, ChevronLeft, ChevronRight, ScrollText, Split } from 'lucide-react';
import Link from 'next/link';
import Button from '../button';
import Select from '../select';
import ManuscriptComparisonModal from '../manuscript-comparison-modal';
import AudioPlayer from './audio-player';

interface ContentDetailsPageProps {
  contentType: 'orations' | 'letters' | 'sayings';
  title: string;
  api: {
    getContentById: (id: number) => Promise<Post | null>;
  };
  id?: number;
}

export default function ContentDetailsPage({ contentType, title, api, id: propId }: ContentDetailsPageProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Try to get id from prop first, then from params.id, then from catch-all params
  const id = propId || (() => {
    if (params.id) return parseInt(params.id as string);
    if (params.params && Array.isArray(params.params) && params.params.length >= 2) {
      return parseInt(params.params[1]);
    }
    return NaN;
  })();
  const returnPage = searchParams.get('returnPage');
  const returnSort = searchParams.get('returnSort');
  const returnSearch = searchParams.get('returnSearch');
  const editionId = searchParams.get('edition');
  const display = searchParams.get('display');
  const highlightRef = searchParams.get('highlightRef');
  const englishWord = searchParams.get('word');
  const arabicWord = searchParams.get('arabicWord');

  const buildDetailsUrl = (postId: number | string) => {
    const qs = searchParams.toString();
    return qs ? `/content/details/${contentType}/${postId}?${qs}` : `/content/details/${contentType}/${postId}`;
  };

  const [content, setContent] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [adjacentPosts, setAdjacentPosts] = useState<{ previous: Post | null; next: Post | null }>({
    previous: null,
    next: null
  });
  const [adjacentLoading, setAdjacentLoading] = useState(false);
  const [allItemNumbers, setAllItemNumbers] = useState<{ id: number; number: string }[]>([]);
  const [navigationPosts, setNavigationPosts] = useState<Post[]>([]);
  const [audioTracks, setAudioTracks] = useState<{ arabic?: string; english?: string }>({});
  const [isParallelViewActive, setIsParallelViewActive] = useState(false);
  const [availablePosts, setAvailablePosts] = useState<Post[]>([]);

  const getDisplayNumber = (sermonNumber?: string | null) => {
    if (!sermonNumber) return '';
    if (sermonNumber.includes('.')) {
      return sermonNumber.split('.').pop() || sermonNumber;
    }
    return sermonNumber;
  };

  const getEditionPrefix = (sermonNumber?: string | null) => {
    if (!sermonNumber || !sermonNumber.includes('.')) return '';
    return sermonNumber.split('.')[0] || '';
  };

  const sortPostsByDisplayNumber = (posts: Post[]) => {
    return [...posts].sort((a, b) => {
      const aNum = parseInt(getDisplayNumber(a.sermonNumber), 10);
      const bNum = parseInt(getDisplayNumber(b.sermonNumber), 10);
      if (isNaN(aNum) || isNaN(bNum)) {
        return getDisplayNumber(a.sermonNumber).localeCompare(getDisplayNumber(b.sermonNumber));
      }
      return aNum - bNum;
    });
  };

  useEffect(() => {
    const fetchAllNumbers = async () => {
      try {
        let allPosts: any[] = [];
        let currentPage = 1;
        let hasMore = true;
        const pageSize = 100;

        const typeMapping = {
          'orations': 'Oration',
          'letters': 'Letter',
          'sayings': 'Saying'
        };

        let editionTitle: string | undefined;
        if (editionId) {
          const editionsResponse = await postsApi.getEditions();
          const matchingEdition = (editionsResponse.data || []).find((ed: any) => ed?.id?.toString() === editionId);
          editionTitle = matchingEdition?.title;
        }
        const editionPrefix = !editionTitle ? getEditionPrefix(content?.sermonNumber) : '';

        while (hasMore) {
          const response = await postsApi.getPosts({
            page: currentPage,
            pageSize: pageSize,
            filters: { type: typeMapping[contentType], ...(editionTitle ? { editionTitle } : {}) },
            fields: ['id', 'sermonNumber'],
            populate: [], // Optimize: we only need ID and number for the dropdown
            sort: 'id:asc'
          });

          if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
            allPosts.push(...response.data);
            const totalPages = response.meta?.pagination?.pageCount || 1;
            hasMore = currentPage < totalPages;
            currentPage++;
          } else {
            hasMore = false;
          }
        }

        if (allPosts.length > 0) {
          const scopedPosts = editionPrefix
            ? allPosts.filter((post) => getEditionPrefix(post?.sermonNumber) === editionPrefix)
            : allPosts;
          const sortedPosts = sortPostsByDisplayNumber(
            scopedPosts.filter((post): post is Post => !!post?.id)
          );
          setNavigationPosts(sortedPosts);

          const numbers = sortedPosts
            .map(p => {
              const numStr = getDisplayNumber(p.sermonNumber);
              return {
                id: p.id,
                number: numStr || p.id.toString()
              };
            })
            .filter(item => item.number)
            .filter((item, index, arr) => arr.findIndex(x => x.number === item.number) === index)
            .sort((a, b) => {
              const numA = parseInt(a.number);
              const numB = parseInt(b.number);
              if (isNaN(numA) || isNaN(numB)) return a.number.localeCompare(b.number);
              return numA - numB;
            });
          setAllItemNumbers(numbers);
        } else {
          setNavigationPosts([]);
          setAllItemNumbers([]);
        }
      } catch (error) {
        console.error('Failed to fetch item numbers:', error);
        setNavigationPosts([]);
        setAllItemNumbers([]);
      }
    };
    fetchAllNumbers();
  }, [content?.sermonNumber, contentType, editionId]);

  const getBackUrl = () => {
    const urlParams = new URLSearchParams();
    if (returnPage) urlParams.set('page', returnPage);
    if (returnSort) urlParams.set('sort', returnSort);
    if (returnSearch) urlParams.set('search', returnSearch);
    if (editionId) urlParams.set('edition', editionId);
    if (display) urlParams.set('display', display);

    const queryString = urlParams.toString();
    return queryString ? `/${contentType}?${queryString}` : `/${contentType}`;
  };

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();

    if (window.history.length > 1 && (returnPage || returnSort || returnSearch || editionId || display)) {
      router.back();
    } else {
      router.push(getBackUrl());
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setAdjacentLoading(true);
        setError(null);

        const contentData = await api.getContentById(id);

        setContent(contentData);
      } catch (err) {
        setError(`Failed to load ${contentType.slice(0, -1)} details. Please try again.`);
        console.error(`Error loading ${contentType.slice(0, -1)}:`, err);
      } finally {
        setLoading(false);
        setAdjacentLoading(false);
      }
    };

    if (!isNaN(id)) {
      loadData();
    }
  }, [id, api, contentType]);

  useEffect(() => {
    if (!content || navigationPosts.length === 0) {
      setAdjacentPosts({ previous: null, next: null });
      setAdjacentLoading(false);
      return;
    }

    const currentNumber = getDisplayNumber(content.sermonNumber);
    const currentIndex = navigationPosts.findIndex((post) => {
      if (post.id === content.id) return true;
      return currentNumber !== '' && getDisplayNumber(post.sermonNumber) === currentNumber;
    });

    if (currentIndex === -1) {
      setAdjacentPosts({ previous: null, next: null });
      setAdjacentLoading(false);
      return;
    }

    setAdjacentPosts({
      previous: currentIndex > 0 ? navigationPosts[currentIndex - 1] : null,
      next: currentIndex < navigationPosts.length - 1 ? navigationPosts[currentIndex + 1] : null,
    });
    setAdjacentLoading(false);
  }, [content, navigationPosts]);

  useEffect(() => {
    const fetchAudio = async () => {
      if (content?.sermonNumber) {
        const audio = await audioApi.getAudioBySermonNumber(content.sermonNumber);
        setAudioTracks({
          arabic: audio?.audioTracks?.arabic?.url,
          english: audio?.audioTracks?.english?.url,
        });
      } else {
        setAudioTracks({});
      }
    };
    fetchAudio();
  }, [content]);

  useEffect(() => {
    const fetchAvailablePosts = async () => {
      if (!content) return;

      try {
        const typeMapping: Record<string, string> = {
          'orations': 'Oration',
          'letters': 'Letter',
          'sayings': 'Saying'
        };

        const uniqueById = (posts: Post[]) => {
          const seen = new Set<number>();
          return posts.filter(post => {
            if (seen.has(post.id)) return false;
            seen.add(post.id);
            return true;
          });
        };

        // Prefer sermonNumber for grouping editions as they can be split across post-bases
        // and use different prefixes (e.g., 1.1 vs 4.1 for Oration 1)
        if (content.sermonNumber) {
          const itemNumber = content.sermonNumber.includes('.')
            ? content.sermonNumber.split('.').pop()
            : content.sermonNumber;

          const responseByNumber = await postsApi.getPosts({
            filters: {
              $or: [
                { sermonNumber: itemNumber },
                { sermonNumber: content.sermonNumber },
                { sermonNumberEndsWith: `.${itemNumber}` }
              ],
              type: typeMapping[contentType]
            },
            pageSize: 50 // Ensure we get all editions
          });

          let responseByBase: Post[] = [];
          if (content.post_base_documentId) {
            const byBase = await postsApi.getPostsByPostBaseDocumentId(content.post_base_documentId);
            responseByBase = byBase.data || [];
          }

          const combinedResults = uniqueById([
            ...(responseByNumber.data || []),
            ...responseByBase,
            content
          ]).filter(post => post.type === typeMapping[contentType]);

          // Filter for exact item number match to avoid matching e.g. ".11" when searching for ".1"
          // and also include the current post and any results with no sermonNumber
          const matchedPosts = combinedResults.filter(p => {
            if (!p.sermonNumber) return true;
            const pNum = p.sermonNumber?.split('.').pop();
            return pNum === itemNumber;
          });

          setAvailablePosts(matchedPosts.length > 0 ? matchedPosts : combinedResults);
        } else if (content.post_base_documentId) {
          // Fallback to post_base_documentId if sermonNumber is not available
          const response = await postsApi.getPostsByPostBaseDocumentId(content.post_base_documentId);
          setAvailablePosts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch available editions:', error);
      }
    };

    fetchAvailablePosts();
  }, [content?.sermonNumber, content?.post_base_documentId, contentType]);

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'orations':
        return 'Oration';
      case 'letters':
        return 'Letter';
      case 'sayings':
        return 'Saying';
      default:
        return 'Post';
    }
  };

  const truncateText = (text: string | undefined, maxLength: number = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const navigateToPost = (post: Post) => {
    router.push(buildDetailsUrl(post.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded mb-8 w-3/4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
          </h2>
          <button
            onClick={handleBackNavigation}
            className="bg-[#43896B] text-white px-6 py-2 rounded-lg hover:bg-[#367556] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title.slice(0, -1)} not found
          </h2>
          <p className="text-gray-600 mb-6">The requested {contentType.slice(0, -1)} could not be found.</p>
          <button
            onClick={handleBackNavigation}
            className="bg-[#43896B] text-white px-6 py-2 rounded-lg hover:bg-[#367556] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button and action buttons */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Top Row: Back button and Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <button
              onClick={handleBackNavigation}
              className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#367556] font-semibold transition-colors cursor-pointer text-lg whitespace-nowrap"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to {title}
            </button>

            <div className="flex items-center gap-3">
              <Button
                variant='outlined'
                disabled={!adjacentPosts.previous}
                onClick={() => adjacentPosts.previous && navigateToPost(adjacentPosts.previous)}
                icon={<ChevronLeft className='w-4 h-4' />}
                className="h-11"
              >
                Prev
              </Button>

              <Select
                value={id.toString()}
                onChange={(value: string) => router.push(buildDetailsUrl(value))}
                options={allItemNumbers.map(item => ({ value: item.id.toString(), label: `${getContentTypeLabel()} ${item.number}` }))}
                placeholder={`Go to #`}
                className="w-36 h-11 shrink-0"
              />

              <Button
                variant='outlined'
                disabled={!adjacentPosts.next}
                onClick={() => adjacentPosts.next && navigateToPost(adjacentPosts.next)}
                className="h-11"
              >
                <div className='flex items-center gap-2'>
                  Next
                  <ChevronRight className='w-4 h-4' />
                </div>
              </Button>
            </div>
          </div>

          {/* Bottom Row: Audio and Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            {/* Audio Player */}
            <AudioPlayer tracks={audioTracks} />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={isParallelViewActive ? 'solid' : 'outlined'}
                icon={<Split className='w-4 h-4' />}
                onClick={() => setIsParallelViewActive(!isParallelViewActive)}
                className="h-11"
              >
                Parallel View
              </Button>
              <Button
                variant='outlined'
                icon={<GitCompare className='w-4 h-4' />}
                onClick={() => setIsComparisonModalOpen(true)}
                className="h-11"
              >
                Compare Manuscripts
              </Button>
              <Link href={content?.sermonNumber ? `/manuscripts?section=${content.sermonNumber}` : '/manuscripts'}>
                <Button variant='outlined' icon={<Book className='w-4 h-4' />} className="h-11">
                  View Manuscripts
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className='w-full'>
            {isParallelViewActive ? (
              <ParallelView
                key={content.id}
                initialPost={content}
                availablePosts={availablePosts}
                contentType={contentType}
                highlightRef={highlightRef}
                englishWord={englishWord}
                arabicWord={arabicWord}
              />
            ) : (
              <ContentDescription
                content={content}
                contentType={contentType}
                highlightRef={highlightRef}
                englishWord={englishWord}
                arabicWord={arabicWord}
              />
            )}
          </div>
        </div>

        {/* Next/Previous Navigation */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Previous Post */}
            <div className="flex-1">
              {adjacentPosts.previous ? (
                <button
                  onClick={() => navigateToPost(adjacentPosts.previous!)}
                  className="w-full group p-4 rounded-xl border border-gray-200 bg-white hover:border-[#43896B] hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 text-gray-500 group-hover:text-[#43896B] mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Previous {getContentTypeLabel()}</span>
                  </div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#43896B] line-clamp-2">
                    {truncateText(adjacentPosts.previous.heading)}
                  </div>
                  {adjacentPosts.previous.sermonNumber && (
                    <div className="text-sm text-gray-500 mt-1">
                      {adjacentPosts.previous.sermonNumber}
                    </div>
                  )}
                </button>
              ) : (
                <div className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-50">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Previous {getContentTypeLabel()}</span>
                  </div>
                  <div className="text-gray-400">No previous {getContentTypeLabel().toLowerCase()}</div>
                </div>
              )}
            </div>

            {/* Next Post */}
            <div className="flex-1">
              {adjacentPosts.next ? (
                <button
                  onClick={() => navigateToPost(adjacentPosts.next!)}
                  className="w-full group p-4 rounded-xl border border-gray-200 bg-white hover:border-[#43896B] hover:shadow-md transition-all text-right"
                >
                  <div className="flex items-center justify-end gap-2 text-gray-500 group-hover:text-[#43896B] mb-2">
                    <span className="text-sm font-medium">Next {getContentTypeLabel()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-gray-900 group-hover:text-[#43896B] line-clamp-2">
                    {truncateText(adjacentPosts.next.heading)}
                  </div>
                  {adjacentPosts.next.sermonNumber && (
                    <div className="text-sm text-gray-500 mt-1">
                      {adjacentPosts.next.sermonNumber}
                    </div>
                  )}
                </button>
              ) : (
                <div className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-50">
                  <div className="flex items-center justify-end gap-2 text-gray-400 mb-2">
                    <span className="text-sm font-medium">Next {getContentTypeLabel()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div className="text-gray-400">No next {getContentTypeLabel().toLowerCase()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manuscript Comparison Modal */}
      <ManuscriptComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        content={content}
        contentType={contentType}
      />
    </div>
  );
}
