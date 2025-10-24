"use client";
import React from 'react';
import { BookOpen, Star, Heart } from 'lucide-react';

const BannerSection = () => {

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[#43896B]"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/25 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-white/20 rounded-full"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Discover{' '}
            <span className="font-taha text-5xl lg:text-7xl block mt-2 text-yellow-200">
              نهج البلاغة
            </span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-2">
              Nahj al-Balaghah is a collection of sermons, letters, and sayings of Imam Ali (AS),
            </p>
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
              compiled by Syed al-Sharif al-Radi. It represents one of the most important works
              in Islamic literature, offering profound wisdom and timeless guidance.
            </p>
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;