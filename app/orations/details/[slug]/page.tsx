'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { orationsApi, type Post } from '@/api/orations';
import OrationsDescription from './sections/description';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrationsDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const returnPage = searchParams.get('returnPage');
  
  const [oration, setOration] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create the back URL with the correct page
  const getBackUrl = () => {
    return returnPage ? `/orations?page=${returnPage}` : '/orations';
  };

  useEffect(() => {
    const loadOration = async () => {
      try {
        setLoading(true);
        const data = await orationsApi.getOrationBySlug(slug);
        setOration(data);
        setError(null);
      } catch (err) {
        setError('Failed to load oration details. Please try again.');
        console.error('Error loading oration:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadOration();
    }
  }, [slug]);

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

  if (error || !oration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Oration not found'}
          </h2>
          <Link 
            href={getBackUrl()} 
            className="bg-[#43896B] text-white px-6 py-2 rounded-lg hover:bg-[#367556] inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orations
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
          Back to Orations
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className='w-full'>
            <OrationsDescription oration={oration} />
          </div>
        </div>
      </div>
    </div>
  );
}
