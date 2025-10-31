'use client';
import React, { useEffect, useState } from 'react';
import { manuscriptsApi, Manuscript, getManuscriptImageUrl, getContentTypeFromSection } from '@/api/manuscripts';
import { Filter, Image as ImageIcon, Loader2, BookOpen, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

type FilterType = 'all' | 'oration' | 'letter' | 'saying';

export default function ManuscriptsSection() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [filteredManuscripts, setFilteredManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await manuscriptsApi.getAllManuscripts(1, 100);
        setManuscripts(response.data);
        setFilteredManuscripts(response.data);
      } catch (err) {
        console.error('Error fetching manuscripts:', err);
        setError('Failed to load manuscripts');
      } finally {
        setLoading(false);
      }
    };

    fetchManuscripts();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredManuscripts(manuscripts);
    } else {
      const filtered = manuscripts.filter((manuscript) => {
        const contentType = getContentTypeFromSection(manuscript.section);
        return contentType === activeFilter;
      });
      setFilteredManuscripts(filtered);
    }
  }, [activeFilter, manuscripts]);

  const getTypeLabel = (section: string): string => {
    const type = getContentTypeFromSection(section);
    if (type === 'oration') return 'Oration';
    if (type === 'letter') return 'Letter';
    if (type === 'saying') return 'Saying';
    return 'Unknown';
  };

  const getTypeIcon = (section: string) => {
    const type = getContentTypeFromSection(section);
    if (type === 'oration') return <BookOpen className="w-4 h-4" />;
    if (type === 'letter') return <Mail className="w-4 h-4" />;
    if (type === 'saying') return <MessageSquare className="w-4 h-4" />;
    return null;
  };

  const getTypeColor = (section: string): string => {
    const type = getContentTypeFromSection(section);
    if (type === 'oration') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (type === 'letter') return 'bg-green-100 text-green-700 border-green-200';
    if (type === 'saying') return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#43896B] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading manuscripts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ImageIcon className="w-6 h-6 text-[#43896B]" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Historical Manuscripts
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore rare manuscripts of Nahj al-Balaghah from renowned libraries across the Islamic world
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#43896B] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({manuscripts.length})
          </button>
          <button
            onClick={() => setActiveFilter('oration')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              activeFilter === 'oration'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Orations ({manuscripts.filter(m => getContentTypeFromSection(m.section) === 'oration').length})
          </button>
          <button
            onClick={() => setActiveFilter('letter')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              activeFilter === 'letter'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Mail className="w-4 h-4" />
            Letters ({manuscripts.filter(m => getContentTypeFromSection(m.section) === 'letter').length})
          </button>
          <button
            onClick={() => setActiveFilter('saying')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              activeFilter === 'saying'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Sayings ({manuscripts.filter(m => getContentTypeFromSection(m.section) === 'saying').length})
          </button>
        </div>

        {/* Manuscripts Grid */}
        {filteredManuscripts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManuscripts.map((manuscript) => (
              <div
                key={manuscript.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Manuscript Image */}
                {manuscript.files && manuscript.files.length > 0 && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getManuscriptImageUrl(manuscript.files[0].url)}
                      alt={manuscript.files[0].alternativeText || 'Manuscript'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getTypeColor(manuscript.section)}`}>
                        {getTypeIcon(manuscript.section)}
                        {getTypeLabel(manuscript.section)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Manuscript Info */}
                <div className="p-5">
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#43896B]">
                      Section {manuscript.section}
                    </span>
                  </div>

                  {manuscript.bookName && (
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#43896B] transition-colors">
                      {manuscript.bookName}
                    </h3>
                  )}

                  <div className="space-y-1.5 text-sm text-gray-600">
                    {manuscript.siglaEnglish && (
                      <p className="line-clamp-1">
                        <span className="font-semibold">Sigla:</span> {manuscript.siglaEnglish}
                      </p>
                    )}
                    {manuscript.gregorianYear && (
                      <p>
                        <span className="font-semibold">Year:</span> {manuscript.gregorianYear}
                      </p>
                    )}
                    {manuscript.holdingInstitution && (
                      <p className="line-clamp-1">
                        <span className="font-semibold">Institution:</span> {manuscript.holdingInstitution}
                      </p>
                    )}
                  </div>

                  {manuscript.files && manuscript.files.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        +{manuscript.files.length - 1} more image{manuscript.files.length - 1 > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No manuscripts found for this filter.</p>
          </div>
        )}

        {/* View All Link */}
        {manuscripts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/manuscripts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#43896B] text-white rounded-lg hover:bg-[#43896B]/90 transition-colors font-semibold"
            >
              <ImageIcon className="w-5 h-5" />
              View All Manuscripts
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
