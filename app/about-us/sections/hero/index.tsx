"use client";
import React, { useState, useEffect } from 'react'
import { BookOpen, Users, Star, Heart, Globe, Award, ChevronRight, Calendar, MapPin } from 'lucide-react'
import HeroMosqueImage from '@/app/assets/images/hero-mosque.jpg'
import Image from 'next/image';
import Button from '@/app/components/button';

const AboutUsHero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { icon: Calendar, label: "Established", value: "2005" },
    { icon: Users, label: "Community", value: "10K+" },
    { icon: Globe, label: "Countries", value: "45+" },
    { icon: Award, label: "Recognition", value: "15+" }
  ]

  const values = [
    { 
      icon: BookOpen, 
      title: "Knowledge", 
      description: "Preserving and sharing Islamic wisdom through authentic scholarship" 
    },
    { 
      icon: Heart, 
      title: "Community", 
      description: "Building bridges of understanding and fostering spiritual growth" 
    },
    { 
      icon: Star, 
      title: "Excellence", 
      description: "Committed to the highest standards in Islamic education and guidance" 
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image 
          className="w-full h-full object-cover"
          src={HeroMosqueImage}
          alt='hero-mosque'
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
                  Our Story & Mission
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto">
                  Dedicated to preserving Islamic heritage and fostering spiritual enlightenment
                </p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
                  <h2 className="text-2xl font-bold text-[#43896B] mb-6">Our Journey</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Founded in 2005, our organization began as a humble initiative to make the profound 
                      teachings of Nahj al-Balagha accessible to seekers of wisdom worldwide. What started 
                      as a small gathering of devoted scholars has grown into a global community.
                    </p>
                    <p className="leading-relaxed">
                      Today, we serve thousands of students across 45 countries, providing authentic 
                      Islamic education and spiritual guidance rooted in the timeless wisdom of 
                      Imam Ali (AS) and the teachings of the Holy Quran.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="text-[#43896B]" />
                      <span>Based in Qom, Iran</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-[#43896B]" />
                      <span>Since {currentYear - 20}</span>
                    </div>
                  </div>
                </div>
                <Button variant='solid' icon={<ChevronRight size={24} />}>
                  Read Our Full Story
                </Button>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#43896B] text-center lg:text-left mb-8">
                  Our Core Values
                </h2>
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#43896B] rounded-xl flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-center"
                >
                  <div className="w-12 h-12 bg-[#43896B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 sm:bottom-8 left-4 right-4 z-50 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-[#43896B]/95 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/20 text-center">
            <p className="text-white font-medium text-sm sm:text-base">
              <span className="font-bold">"Our Mission:</span> To illuminate hearts and minds through the timeless wisdom of Islamic teachings, 
              fostering a global community united in faith, knowledge, and spiritual growth."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsHero