'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { type Post, orationsApi, lettersApi, sayingsApi } from '@/api/posts';
import ContentDescription from './content-description';
import { ArrowLeft, Book, GitCompare, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Button from '../button';
import ManuscriptComparisonModal from '../manuscript-comparison-modal';

interface ContentDetailsPageProps {
  contentType: 'orations' | 'letters' | 'sayings';
  title: string;
  api: {
    getContentById: (id: number) => Promise<Post | null>;
  };
}

export default function ContentDetailsPage({ contentType, title, api }: ContentDetailsPageProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const returnPage = searchParams.get('returnPage');
  const returnSort = searchParams.get('returnSort');
  const returnSearch = searchParams.get('returnSearch');
  const highlightRef = searchParams.get('highlightRef');
  const englishWord = searchParams.get('word');
  const arabicWord = searchParams.get('arabicWord');

  const [content, setContent] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [adjacentPosts, setAdjacentPosts] = useState<{ previous: Post | null; next: Post | null }>({
    previous: null,
    next: null
  });
  const [adjacentLoading, setAdjacentLoading] = useState(false);

  const getBackUrl = () => {
    const urlParams = new URLSearchParams();
    if (returnPage) urlParams.set('page', returnPage);
    if (returnSort) urlParams.set('sort', returnSort);
    if (returnSearch) urlParams.set('search', returnSearch);

    const queryString = urlParams.toString();
    return queryString ? `/${contentType}?${queryString}` : `/${contentType}`;
  };

  const handleBackNavigation = (e: React.MouseEvent) => {
    e.preventDefault();

    if (window.history.length > 1 && (returnPage || returnSort || returnSearch)) {
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

        const contentPromise = api.getContentById(id);

        let adjacentPromise: Promise<{ previous: Post | null; next: Post | null }>;
        switch (contentType) {
          case 'orations':
            adjacentPromise = orationsApi.getAdjacentOrations(id);
            break;
          case 'letters':
            adjacentPromise = lettersApi.getAdjacentLetters(id);
            break;
          case 'sayings':
            adjacentPromise = sayingsApi.getAdjacentSayings(id);
            break;
          default:
            adjacentPromise = Promise.resolve({ previous: null, next: null });
        }

        const [contentData, adjacentData] = await Promise.all([contentPromise, adjacentPromise]);

        setContent(contentData);
        setAdjacentPosts(adjacentData);
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
    router.push(`/${contentType}/details/${post.id}`);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#367556] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </button>

          <div className="flex flex-wrap gap-3">
            <Button
              variant='outlined'
              disabled={!adjacentPosts.previous}
              onClick={() => adjacentPosts.previous && navigateToPost(adjacentPosts.previous)}
              icon={<ChevronLeft className='w-4 h-4' />}
            >
              Prev
            </Button>
            <Button
              variant='outlined'
              disabled={!adjacentPosts.next}
              onClick={() => adjacentPosts.next && navigateToPost(adjacentPosts.next)}
            >
              <div className='flex items-center gap-2'>
                Next
                <ChevronRight className='w-4 h-4' />
              </div>
            </Button>
            <Button
              variant='outlined'
              icon={<GitCompare className='w-4 h-4' />}
              onClick={() => setIsComparisonModalOpen(true)}
            >
              Compare Manuscripts
            </Button>
            <Link href={content?.sermonNumber ? `/manuscripts?section=${content.sermonNumber}` : '/manuscripts'}>
              <Button variant='outlined' icon={<Book className='w-4 h-4' />} >
                View Manuscripts
              </Button>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className='w-full'>
            <ContentDescription
              content={content}
              contentType={contentType}
              highlightRef={highlightRef}
              englishWord={englishWord}
              arabicWord={arabicWord}
            />
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
