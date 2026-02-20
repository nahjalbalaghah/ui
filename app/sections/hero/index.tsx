"use client";
import React, { useState, useEffect } from 'react'
import { ArrowRightCircle } from 'lucide-react'
import ArabicTitleImage from '@/app/assets/images/arabic-title.png'
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/button';
import { orationsApi, lettersApi, sayingsApi, radisApi } from '@/api';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(10)
  const [duration] = useState(38)
  const [currentSurah] = useState("Surah Fatiha")
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({
    orations: 0,
    letters: 0,
    sayings: 0,
    radis: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    fetchCounts()
    const interval = setInterval(() => {
      if (isPlaying && currentTime < duration) {
        setCurrentTime(prev => prev + 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration])

  const fetchCounts = async () => {
    try {
      setIsLoading(true)
      const [orationsResponse, lettersResponse, sayingsResponse, radisResponse] = await Promise.all([
        orationsApi.getOrations(1, 1), // Get just one item to get total count
        lettersApi.getLetters(1, 1),
        sayingsApi.getSayings(1, 1),
        radisApi.getRadisIntroductions(1, 1)
      ])

      setCounts({
        orations: orationsResponse.meta.pagination.total,
        letters: lettersResponse.meta.pagination.total,
        sayings: sayingsResponse.meta.pagination.total,
        radis: radisResponse.meta.pagination.total
      })
    } catch (error) {
      console.error('Error fetching counts:', error)
      // Fallback counts if API fails
      setCounts({
        orations: 241,
        letters: 79,
        sayings: 479,
        radis: 9
      })
    } finally {
      setIsLoading(false)
    }
  }

  const progress = (currentTime / duration) * 100

  const introCard = {
    arabic: "المقدمة",
    label: "Introduction",
    href: "/radis",
    type: "Introduction"
  }

  const conclusionCard = {
    arabic: "الخاتمة",
    label: "Conclusion",
    href: "/conclusions",
    type: "Conclusion"
  }

  const contentTypes = [
    {
      arabic: "الخطب",
      label: "Orations",
      href: "/orations",
      type: "Oration"
    },
    {
      arabic: "الكتب",
      label: "Letters",
      href: "/letters",
      type: "Letter"
    },
    {
      arabic: "الحِكَم",
      label: "Sayings",
      href: "/sayings",
      type: "Saying"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjwvcGF0aD4KPC9zdmc+')] bg-repeat"></div>
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="grow flex items-center justify-center pt-16">
          <div className="max-w-7xl mx-auto text-center w-full">
            <div className="mb-8">
              <div className="flex justify-center items-center mb-4">
                <Image
                  src={ArabicTitleImage}
                  alt="نهج البلاغة"
                  className="h-auto w-[400px] sm:w-[500px] lg:w-[600px] max-w-full"
                />
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <h1 className="text-4xl lg:text-6xl font-black leading-tight text-[#43896B] wrap-break-word text-balance tracking-tight" >
                The Way of Eloquence:
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Selections from the Words of the Commander of the Faithful ʿAlī ibn Abī Ṭālib, God's blessings on him
              </p>
            </div>
            <div className="text-center mb-8">
              <p className="text-base sm:text-lg text-gray-600 mb-2">Compiled by</p>
              <p className="text-xl sm:text-2xl font-bold">
                al-Sharīf al-Raḍī
              </p>
            </div>
            <div className="mt-16 max-w-4xl mx-auto px-4">
              <Link href={introCard.href} className="block group">
                <div className="relative bg-linear-to-br from-[#43896B]/5 via-white to-[#43896B]/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border-2 border-[#43896B]/20 hover:border-[#43896B]/40 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-2 cursor-pointer overflow-hidden">
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#43896B] mb-2 leading-tight">
                        {introCard.label}
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#43896B] font-[uthman-taha] mb-2 leading-tight" style={{ fontFamily: 'uthman-taha, serif', letterSpacing: '0.05em' }}>
                        {introCard.arabic}
                      </div>
                    </div>
                    <div className="ml-6 sm:ml-8 shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#43896B]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-4 sm:p-5 shadow-lg group-hover:shadow-xl group-hover:bg-[#43896B] transition-all duration-500">
                          <ArrowRightCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#43896B] group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-500" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
              {contentTypes.map((content, index) => (
                <Link href={content.href} key={content.label} className="block group">
                  <div className="relative bg-linear-to-br from-white via-[#43896B]/5 to-white backdrop-blur-xl rounded-3xl p-4 sm:p-6 border-2 border-[#43896B]/15 hover:border-[#43896B]/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 cursor-pointer overflow-visible h-full flex flex-col">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-linear-to-r from-transparent via-[#43896B] to-transparent rounded-full"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#43896B]/10 rounded-full blur-2xl group-hover:bg-[#43896B]/20 transition-all duration-500 transform translate-x-10 -translate-y-10"></div>
                    <div className="relative flex flex-col items-center text-center grow pt-4">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#43896B] mb-2 lg:mb-5 group-hover:scale-110 transition-transform duration-500 px-2 min-h-12 flex items-center justify-center" style={{ lineHeight: '1.2' }}>
                        {content.label}
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#43896B] mb-2 font-[uthman-taha] group-hover:scale-110 transition-transform duration-500 px-2 min-h-12 flex items-center justify-center" style={{ fontFamily: 'uthman-taha, serif', letterSpacing: '0.05em', lineHeight: '1.2' }}>
                        {content.arabic}
                      </div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#43896B]/40 to-transparent rounded-full mb-4"></div>
                      <div className="mt-auto">
                        <div className="relative inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-[#43896B] text-[#43896B] font-bold rounded-full shadow-lg group-hover:bg-[#43896B] group-hover:text-white transition-all duration-500 overflow-hidden">
                          <div className="absolute inset-0 bg-linear-to-r from-[#43896B]/0 via-[#43896B]/10 to-[#43896B]/0 group-hover:via-[#43896B]/20 transition-all duration-500"></div>
                          <span className="relative z-10 text-sm sm:text-base">Read</span>
                          <ArrowRightCircle className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-500" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 max-w-4xl mx-auto px-4 mb-16">
              <Link href={conclusionCard.href} className="block group">
                <div className="relative bg-linear-to-br from-[#43896B]/5 via-white to-[#43896B]/10 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border-2 border-[#43896B]/20 hover:border-[#43896B]/40 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-2 cursor-pointer overflow-hidden">
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#43896B] mb-2 lg:mb-5 leading-tight">
                        {conclusionCard.label}
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#43896B] font-[uthman-taha] mb-2 leading-tight" style={{ fontFamily: 'uthman-taha, serif', letterSpacing: '0.05em' }}>
                        {conclusionCard.arabic}
                      </div>
                    </div>
                    <div className="ml-6 sm:ml-8 flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#43896B]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-4 sm:p-5 shadow-lg group-hover:shadow-xl group-hover:bg-[#43896B] transition-all duration-500">
                          <ArrowRightCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#43896B] group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-500" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection