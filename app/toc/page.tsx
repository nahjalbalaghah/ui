'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Search } from 'lucide-react';
import Link from 'next/link';
import { postBasesApi, type PostBase } from '@/api/posts';

type TabType = 'orations' | 'letters' | 'sayings';

const TAB_CONFIG = {
  orations: {
    label: 'Orations',
    sublabel: 'Khutbah',
    type: 'Oration' as const,
    color: 'blue',
    icon: BookOpen,
    prefix: '1',
    fetchTOC: () => postBasesApi.getOrationsTOC(),
  },
  letters: {
    label: 'Letters',
    sublabel: 'Maktoobat',
    type: 'Letter' as const,
    color: 'green',
    icon: FileText,
    prefix: '2',
    fetchTOC: () => postBasesApi.getLettersTOC(),
  },
  sayings: {
    label: 'Sayings',
    sublabel: 'Hikam',
    type: 'Saying' as const,
    color: 'purple',
    icon: FileText,
    prefix: '3',
    fetchTOC: () => postBasesApi.getSayingsTOC(),
  },
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; hoverBorder: string; tabActive: string; tabBg: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', hoverBorder: 'hover:border-blue-200', tabActive: 'border-blue-600 text-blue-600', tabBg: 'bg-blue-50' },
  green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', hoverBorder: 'hover:border-green-200', tabActive: 'border-green-600 text-green-600', tabBg: 'bg-green-50' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', hoverBorder: 'hover:border-purple-200', tabActive: 'border-purple-600 text-purple-600', tabBg: 'bg-purple-50' },
};

export default function TOCIndexPage() {
  const [activeTab, setActiveTab] = useState<TabType>('orations');
  const [data, setData] = useState<Record<TabType, PostBase[]>>({ orations: [], letters: [], sayings: [] });
  const [loading, setLoading] = useState<Record<TabType, boolean>>({ orations: true, letters: false, sayings: false });
  const [error, setError] = useState<Record<TabType, string | null>>({ orations: null, letters: null, sayings: null });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (tab: TabType) => {
    if (data[tab].length > 0) return; // Already loaded

    setLoading(prev => ({ ...prev, [tab]: true }));
    setError(prev => ({ ...prev, [tab]: null }));

    try {
      const config = TAB_CONFIG[tab];
      const response = await config.fetchTOC();
      setData(prev => ({ ...prev, [tab]: response.data || [] }));
    } catch (err) {
      console.error(`Error fetching ${tab} TOC:`, err);
      setError(prev => ({ ...prev, [tab]: `Failed to load ${tab}. Please try again.` }));
    } finally {
      setLoading(prev => ({ ...prev, [tab]: false }));
    }
  };

  useEffect(() => {
    fetchData('orations');
  }, []);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const config = TAB_CONFIG[activeTab];
  const colors = COLOR_MAP[config.color];
  const items = data[activeTab];

  // Filter items by search term
  const filteredItems = items.filter(item => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return item.posts?.some(post =>
      (post.heading?.toLowerCase().includes(query)) ||
      (post.sermonNumber?.includes(query))
    );
  });

  // Sort items by sermon number
  const sortedItems = [...filteredItems].sort((a, b) => {
    const getNum = (item: PostBase) => {
      const post = item.posts?.[0];
      if (!post?.sermonNumber) return 0;
      const parts = post.sermonNumber.split('.');
      return parseInt(parts.length > 1 ? parts[1] : parts[0], 10) || 0;
    };
    return getNum(a) - getNum(b);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#43896B]/10 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-[#43896B]" />
              <span className="text-[#43896B] font-bold text-xl tracking-wide">Complete Reference</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-6">
              Table of Contents
            </h1>
            <div className="h-1 bg-[#43896B] rounded-full w-24 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access detailed table of contents entries with English and Arabic headings,
              along with historical manuscript images and metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            {(Object.keys(TAB_CONFIG) as TabType[]).map(tab => {
              const tabConfig = TAB_CONFIG[tab];
              const tabColors = COLOR_MAP[tabConfig.color];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                  className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${tabColors.tabActive} border-b-2`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <tabConfig.icon className="w-4 h-4" />
                    <span>{tabConfig.label}</span>
                    {data[tab].length > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? tabColors.tabBg : 'bg-gray-100'}`}>
                        {data[tab].length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${config.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43896B]/30 focus:border-[#43896B] transition-all"
              />
            </div>
          </div>

          {/* Loading */}
          {loading[activeTab] && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24"></div>
              ))}
            </div>
          )}

          {/* Error */}
          {error[activeTab] && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error[activeTab]}</p>
              <button
                onClick={() => { setData(prev => ({ ...prev, [activeTab]: [] })); fetchData(activeTab); }}
                className="bg-[#43896B] text-white px-6 py-2 rounded-lg hover:bg-[#367556] transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content Grid */}
          {!loading[activeTab] && !error[activeTab] && (
            <>
              {sortedItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? `No ${config.label.toLowerCase()} found matching "${searchTerm}"` : `No ${config.label.toLowerCase()} found.`}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sortedItems.map(item => {
                    const post = item.posts?.[0];
                    if (!post) return null;

                    const displayNum = post.sermonNumber
                      ? post.sermonNumber.includes('.')
                        ? post.sermonNumber.split('.').pop()
                        : post.sermonNumber
                      : '?';

                    return (
                      <Link
                        key={item.id}
                        href={`/content/details/${activeTab}/${post.id}`}
                        className={`group rounded-xl p-4 border ${colors.border} ${colors.bg} ${colors.hoverBorder} hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${colors.text} bg-white border ${colors.border} text-sm font-bold shrink-0`}>
                            {displayNum}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 line-clamp-2 leading-snug">
                              {post.heading || 'Untitled'}
                            </p>
                            {post.editions && post.editions.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {post.editions.map(e => e.title).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Count */}
              {sortedItems.length > 0 && (
                <p className="text-sm text-gray-400 text-center mt-6">
                  Showing {sortedItems.length} of {items.length} {config.label.toLowerCase()}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You&apos;ll Find in the TOC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#43896B]/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#43896B]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Headings</h3>
              <p className="text-sm text-gray-600">
                Descriptive headings that capture the essence of each entry
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#43896B]/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#43896B]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">English Text</h3>
              <p className="text-sm text-gray-600">
                Opening lines and key excerpts translated into English
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#43896B]/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-taha text-[#43896B]">ع</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Arabic Text</h3>
              <p className="text-sm text-gray-600">
                Original Arabic text in beautiful Taha font
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#43896B]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#43896B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Manuscripts</h3>
              <p className="text-sm text-gray-600">
                Historical manuscript images and metadata (available for sections 1.1, 1.2, 1.3)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
