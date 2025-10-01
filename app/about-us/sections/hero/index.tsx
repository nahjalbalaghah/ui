"use client";
import React, { useState, useEffect } from 'react'
import { BookOpen, Star, Heart, ChevronRight, Calendar, MapPin } from 'lucide-react'
import Button from '@/app/components/button';

const AboutUsHero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const values = [
    { 
      icon: BookOpen, 
      title: "Knowledge", 
      description: "Providing authentic Islamic scholarship rooted in classical tradition and contemporary understanding" 
    },
    { 
      icon: Heart, 
      title: "Community", 
      description: "Fostering a global network of learners united in faith, scholarship, and spiritual development" 
    },
    { 
      icon: Star, 
      title: "Excellence", 
      description: "Maintaining rigorous academic standards while creating an accessible learning environment" 
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjwvcGF0aD4KPC9zdmc+')] bg-repeat"></div>
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <div className="space-y-4 sm:space-y-6 mb-8">
                <h1 className="text-4xl lg:text-6xl font-black leading-tight text-[#43896B] break-words text-balance tracking-tight">
                  About Our Institution
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto">
                  A global center for Islamic scholarship and spiritual education
                </p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
                  <h2 className="text-2xl font-bold text-[#43896B] mb-6">Who We Are</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Established in 2005, we are an internationally recognized institution dedicated to 
                      Islamic education and scholarship. Our focus centers on the teachings of Nahj al-Balaghah, 
                      the profound wisdom of Imam Ali (AS), and comprehensive Quranic studies.
                    </p>
                    <p className="leading-relaxed">
                      We serve a diverse community of over 10,000 students across 45 countries, offering 
                      structured programs in Islamic sciences, jurisprudence, and spiritual development 
                      under the guidance of distinguished scholars.
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
                  Learn More About Us
                </Button>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#43896B] text-center lg:text-left mb-8">
                  Our Values
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsHero