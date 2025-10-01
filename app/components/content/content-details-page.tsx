'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { type Post } from '@/api/posts';
import ContentDescription from './content-description';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
  const id = parseInt(params.id as string);
  const returnPage = searchParams.get('returnPage');
  
  const [content, setContent] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create the back URL with the correct page
  const getBackUrl = () => {
    return returnPage ? `/${contentType}?page=${returnPage}` : `/${contentType}`;
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

  // Only show error page if there's an actual error, not just null content
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
          </h2>
          <Link 
            href={getBackUrl()} 
            className="bg-[#43896B] text-white px-6 py-2 rounded-lg hover:bg-[#367556] inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </Link>
        </div>
      </div>
    );
  }

  // If no content but no error, show "not found" page instead of redirecting
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title.slice(0, -1)} not found
          </h2>
          <p className="text-gray-600 mb-6">The requested {contentType.slice(0, -1)} could not be found.</p>
          <Link 
            href={getBackUrl()} 
            className="bg-[#43896B] text-white px-6 py-2 rounded-lg hover:bg-[#367556] inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {title}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={getBackUrl()} 
          className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#367556] mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {title}
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className='w-full'>
            <ContentDescription content={content} contentType={contentType} />
          </div>
        </div>
      </div>
    </div>
  );
}
