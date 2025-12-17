'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sayingsApi, Post } from '@/api/posts';
import { manuscriptsApi, Manuscript, getManuscriptImageUrl } from '@/api/manuscripts';
import { ArrowLeft, BookOpen, FileText, MessageSquare, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SayingTOCPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the post data
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) {
          setError('Invalid content ID');
          return;
        }
        const postData = await sayingsApi.getSayingById(Number(id));
        
        if (!postData) {
          setError('Content not found');
          return;
        }

        setPost(postData);

        // Fetch manuscripts for this section if sermonNumber exists
        if (postData.sermonNumber) {
          try {
            const manuscriptsResponse = await manuscriptsApi.getManuscriptsBySection(postData.sermonNumber);
            setManuscripts(manuscriptsResponse.data || []);
          } catch (manuscriptError) {
            console.warn('No manuscripts found for this section:', manuscriptError);
            setManuscripts([]);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#43896B] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Table of Contents...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Content not found'}</p>
          <button
            onClick={() => router.back()}
            className="text-[#43896B] hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-[#43896B] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#43896B]" />
              <span className="font-semibold text-gray-800">Table of Contents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - TOC Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Saying Number Badge */}
              {post.sermonNumber && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#43896B]/10 text-[#43896B] rounded-full text-sm font-semibold mb-6">
                  <MessageSquare className="w-4 h-4" />
                  Saying {post.sermonNumber}
                </div>
              )}

              {/* Heading */}
              {post.heading && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Heading
                    </h3>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {post.heading}
                  </h1>
                </div>
              )}

              {/* TocEnglish */}
              {post.TocEnglish && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      English
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed font-brill">
                    {post.TocEnglish}
                  </p>
                </div>
              )}

              {/* TocArabic */}
              {post.TocArabic && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Arabic
                    </h3>
                  </div>
                  <p className="text-xl text-gray-800 leading-relaxed font-taha" dir="rtl">
                    {post.TocArabic}
                  </p>
                </div>
              )}

              {/* Link to Full Content */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link
                  href={`/sayings/details/${post.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#43896B] text-white rounded-lg hover:bg-[#43896B]/90 transition-colors font-semibold"
                >
                  <MessageSquare className="w-5 h-5" />
                  Read Full Saying
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Manuscripts */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-5 h-5 text-[#43896B]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Manuscripts
                </h2>
              </div>

              {manuscripts.length > 0 ? (
                <div className="space-y-6">
                  {manuscripts.map((manuscript) => (
                    <div key={manuscript.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      {/* Manuscript Images */}
                      {manuscript.files && manuscript.files.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {manuscript.files.map((file, index) => (
                            <div key={file.id} className="relative group">
                              <img
                                src={getManuscriptImageUrl(file.url)}
                                alt={file.alternativeText || `Manuscript ${index + 1}`}
                                className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => window.open(getManuscriptImageUrl(file.url), '_blank')}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Manuscript Metadata */}
                      <div className="space-y-2 text-sm">
                        {manuscript.bookName && (
                          <div>
                            <span className="font-semibold text-gray-700">Book:</span>
                            <span className="ml-2 text-gray-600">{manuscript.bookName}</span>
                          </div>
                        )}
                        {manuscript.siglaEnglish && (
                          <div>
                            <span className="font-semibold text-gray-700">Sigla:</span>
                            <span className="ml-2 text-gray-600">{manuscript.siglaEnglish}</span>
                          </div>
                        )}
                        {manuscript.gregorianYear && (
                          <div>
                            <span className="font-semibold text-gray-700">Year:</span>
                            <span className="ml-2 text-gray-600">{manuscript.gregorianYear}</span>
                          </div>
                        )}
                        {manuscript.holdingInstitution && (
                          <div>
                            <span className="font-semibold text-gray-700">Institution:</span>
                            <span className="ml-2 text-gray-600">{manuscript.holdingInstitution}</span>
                          </div>
                        )}
                        {manuscript.city && manuscript.country && (
                          <div>
                            <span className="font-semibold text-gray-700">Location:</span>
                            <span className="ml-2 text-gray-600">{manuscript.city}, {manuscript.country}</span>
                          </div>
                        )}
                        {manuscript.catalogNumber && (
                          <div>
                            <span className="font-semibold text-gray-700">Catalog #:</span>
                            <span className="ml-2 text-gray-600">{manuscript.catalogNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No manuscripts available for this section yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
