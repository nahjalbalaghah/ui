'use client';
import React, { useEffect, useState } from 'react';
import { BookOpen, Scroll, Archive } from 'lucide-react';

const ManuscriptsHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#43896B] via-[#5CAF8B] to-[#43896B] overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-full border-2 border-white/30">
                <Scroll className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Historical Manuscripts
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore rare and ancient manuscripts of Nahj al-Balagha from renowned libraries across the Islamic world. 
            Discover the rich history and preservation of this timeless text.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-white/90" />
                <div className="text-3xl md:text-4xl font-bold text-white">6+</div>
              </div>
              <div className="text-sm md:text-base text-white/80">Manuscripts</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Archive className="w-6 h-6 text-white/90" />
                <div className="text-3xl md:text-4xl font-bold text-white">5+</div>
              </div>
              <div className="text-sm md:text-base text-white/80">Libraries</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Scroll className="w-6 h-6 text-white/90" />
                <div className="text-3xl md:text-4xl font-bold text-white">900+</div>
              </div>
              <div className="text-sm md:text-base text-white/80">Years Old</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default ManuscriptsHero;
