'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { type Post } from '@/api/posts';
import ContentDescription from './content-description';
import { ArrowLeft, Book } from 'lucide-react';
import Link from 'next/link';
import Button from '../button';

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
  
  const [content, setContent] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await api.getContentById(id);
        setContent(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load ${contentType.slice(0, -1)} details. Please try again.`);
        console.error(`Error loading ${contentType.slice(0, -1)}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(id)) {
      loadContent();
    }
  }, [id, api, contentType]);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button 
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#367556] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </button>
          
          <Link href={content?.sermonNumber ? `/manuscripts?section=${content.sermonNumber}` : '/manuscripts'}>
            <Button variant='outlined' icon={<Book className='w-4 h-4' />} >
              View Manuscripts
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className='w-full'>
            <ContentDescription content={content} contentType={contentType} />
          </div>
        </div>
      </div>
    </div>
  );
}
