"use client";
import React from 'react';
import Button from '@/app/components/button';
import { FileText, BookOpen, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AboutCardSection = () => {
  const router = useRouter();

  const handleViewNotes = () => {
    router.push('/scholarly-notes');
  };

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/20"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 right-16 w-64 h-64 border border-[#43896B]/20 rounded-full"></div>
        <div className="absolute bottom-16 left-16 w-48 h-48 border-2 border-[#43896B]/15 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-[#43896B]/10 rounded-full"></div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#43896B]/10 border border-white/50 p-8 lg:p-12 text-center hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-[#43896B] rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-[#43896B] mb-6 leading-tight">
            Scholarly Notes & Editions
          </h3>
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Explore detailed notes on the edition and translation of Nahj al-Balaghah,
              providing valuable insights into the scholarly work behind this timeless collection.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Our comprehensive annotations offer deep understanding of the historical context,
              linguistic nuances, and theological significance of Imam Ali's (AS) profound teachings.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-3 bg-[#43896B]/5 px-4 py-2 rounded-full">
              <BookOpen className="w-5 h-5 text-[#43896B]" />
              <span className="text-sm font-medium text-[#43896B]">Authentic Sources</span>
            </div>
            <div className="flex items-center gap-3 bg-[#43896B]/5 px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 text-[#43896B]" />
              <span className="text-sm font-medium text-[#43896B]">Expert Analysis</span>
            </div>
            <div className="flex items-center gap-3 bg-[#43896B]/5 px-4 py-2 rounded-full">
              <FileText className="w-5 h-5 text-[#43896B]" />
              <span className="text-sm font-medium text-[#43896B]">Detailed Notes</span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleViewNotes}
              variant="solid"
              className="text-lg px-8 py-4 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Notes on Edition and Translation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCardSection;