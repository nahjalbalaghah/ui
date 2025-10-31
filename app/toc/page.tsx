import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Table of Contents | Nahj al-Balaghah",
  description: "Browse the complete table of contents for Nahj al-Balaghah with headings in English and Arabic, along with historical manuscript references.",
  openGraph: {
    title: "Table of Contents | Nahj al-Balaghah",
    description: "Browse the complete table of contents for Nahj al-Balaghah with headings in English and Arabic, along with historical manuscript references.",
    url: "https://nahj-al-balagha.com/toc",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Table of Contents | Nahj al-Balaghah",
    description: "Browse the complete table of contents for Nahj al-Balaghah with headings in English and Arabic, along with historical manuscript references.",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
};

export default function TOCIndexPage() {
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

      {/* Content Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Orations */}
            <Link 
              href="/orations"
              className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-sm border border-blue-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Orations
                  </h2>
                  <p className="text-sm text-gray-500">Khutbah</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                View the table of contents for all orations (sermons) in Nahj al-Balaghah. 
                Each entry includes the heading and opening lines in English and Arabic.
              </p>
              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Browse Orations</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Letters */}
            <Link 
              href="/letters"
              className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-sm border border-green-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    Letters
                  </h2>
                  <p className="text-sm text-gray-500">Maktoobat</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Explore the table of contents for letters written by Imam Ali (AS). 
                View headings and key excerpts with manuscript references.
              </p>
              <div className="inline-flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                <span>Browse Letters</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Sayings */}
            <Link 
              href="/sayings"
              className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-sm border border-purple-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Sayings
                  </h2>
                  <p className="text-sm text-gray-500">Hikam</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Access the table of contents for short sayings and wisdom. 
                Each saying is presented with English and Arabic text.
              </p>
              <div className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                <span>Browse Sayings</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You'll Find in the TOC
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
