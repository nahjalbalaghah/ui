"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Star, Heart, Globe, Award, ChevronRight, Search, Quote, ScrollText } from 'lucide-react';
import HeroMosqueImage from '@/app/assets/images/hero-mosque.jpg';
import Image from 'next/image';
import Button from '@/app/components/button';

const ExploreHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: ScrollText, label: "Sermons", value: "241" },
    { icon: Quote, label: "Letters", value: "79" },
    { icon: BookOpen, label: "Sayings", value: "480" },
    { icon: Globe, label: "Translations", value: "30+" }
  ];

  const features = [
    { 
      icon: Search, 
      title: "Comprehensive Nahj al-Balagha Search", 
      description: "Find wisdom by topic, keyword, or phrase across the entire Nahj al-Balagha collection" 
    },
    { 
      icon: BookOpen, 
      title: "Detailed Commentary", 
      description: "Access scholarly explanations and historical context for each passage of Nahj al-Balagha" 
    },
    { 
      icon: Users, 
      title: "Community Insights", 
      description: "Discover how others interpret and apply the teachings of Imam Ali (AS)" 
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image 
          className="w-full h-full object-cover"
          src={HeroMosqueImage}
          alt='hero-mosque'
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/85 to-[#43896B]/20"></div>
      </div>
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjwvcGF0aD4KPC9zdmc+')] bg-repeat"></div>
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <div className="space-y-4 sm:space-y-6 mb-8">
                <h1 className="text-4xl lg:text-6xl font-black leading-tight text-[#43896B] break-words text-balance tracking-tight">
                  Explore Nahj al-Balagha
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto">
                  Dive into the timeless wisdom of Imam Ali (AS) through sermons, letters, and sayings
                </p>
              </div>
              <div className='flex justify-center' >
                <Button variant='solid' icon={<Search size={24} />}>
                    Start Exploring
                </Button>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
                  <h2 className="text-2xl font-bold text-[#43896B] mb-6">About Nahj al-Balagha</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Nahj al-Balagha (Peak of Eloquence) is a collection of 241 sermons, 79 letters, and 480 sayings attributed to Imam Ali ibn Abi Talib (AS), compiled by Sharif al-Radi in the 10th century.
                    </p>
                    <p className="leading-relaxed">
                      This monumental work represents the pinnacle of Islamic eloquence and wisdom, covering theology, philosophy, governance, ethics, and spirituality, and has inspired generations of scholars and seekers.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ScrollText size={16} className="text-[#43896B]" />
                      <span>3 Main Sections</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen size={16} className="text-[#43896B]" />
                      <span>Centuries of Scholarship</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#43896B] text-center lg:text-left mb-8">
                  Key Features
                </h2>
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#43896B] rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 sm:bottom-8 left-4 right-4 z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-[#43896B]/95 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/20 text-center">
            <p className="text-white font-medium text-sm sm:text-base">
              <span className="font-bold">"Knowledge is better than wealth:</span> Knowledge guards you, while you have to guard wealth." — Imam Ali (AS)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreHero;