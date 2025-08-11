"use client";
import React, { useState, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, BookOpen, Users, Star, ArrowRight, Calendar, MapPin, Clock, Disc, ChevronRight, MessageSquare, Mail, ArrowRightCircle } from 'lucide-react'
import HeroMosqueImage from '@/app/assets/images/hero-mosque.jpg'
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/components/button';
import { orationsApi, lettersApi, sayingsApi } from '@/api';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(10)
  const [duration] = useState(38)
  const [currentSurah] = useState("Surah Fatiha")
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({
    orations: 0,
    letters: 0,
    sayings: 0
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
      const [orationsResponse, lettersResponse, sayingsResponse] = await Promise.all([
        orationsApi.getOrations(1, 1), // Get just one item to get total count
        lettersApi.getLetters(1, 1),
        sayingsApi.getSayings(1, 1)
      ])

      setCounts({
        orations: orationsResponse.meta.pagination.total,
        letters: lettersResponse.meta.pagination.total,
        sayings: sayingsResponse.meta.pagination.total
      })
    } catch (error) {
      console.error('Error fetching counts:', error)
      // Fallback counts if API fails
      setCounts({
        orations: 241,
        letters: 79,
        sayings: 479
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / duration) * 100

  const contentTypes = [
    { 
      icon: MessageSquare, 
      label: "Orations", 
      value: isLoading ? "Loading..." : counts.orations.toString(),
      href: "/orations",
      type: "Oration"
    },
    { 
      icon: Mail, 
      label: "Letters", 
      value: isLoading ? "Loading..." : counts.letters.toString(),
      href: "/letters",
      type: "Letter"
    },
    { 
      icon: BookOpen, 
      label: "Sayings", 
      value: isLoading ? "Loading..." : counts.sayings.toString(),
      href: "/sayings",
      type: "Saying"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image 
          className="w-full h-full object-cover "
          src={HeroMosqueImage}
          alt='hero-mosque'
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-[#43896B]/10"></div>
      </div>
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjwvcGF0aD4KPC9zdmc+')] bg-repeat"></div>
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex-grow flex items-center justify-center pb-32 pt-16">
          <div className="max-w-7xl mx-auto text-center w-full">
            <div className="mb-8 space-y-3">
              <div className="text-3xl font-taha sm:text-4xl lg:text-5xl xl:text-6xl font-black text-black mb-4 tracking-wider leading-relaxed" >
              نهج البلاغة  
              </div>
              <p className="text-sm sm:text-base text-gray-600 italic font-medium">
                A Parallel English-Arabic Text
              </p>
            </div>
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <h1 className="text-4xl lg:text-6xl font-black leading-tight text-[#43896B] break-words text-balance tracking-tight" >
               The Wisdom and Eloquence of Ali
              </h1>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-5xl mx-auto mb-8 sm:mb-12 px-4">
              Embark on a spiritual journey through the timeless wisdom of Nahj al-Balaghah. 
              Learn from renowned scholars and discover the profound teachings that guide millions.
            </p>
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-base sm:text-lg text-gray-600 mb-2">Compiled By</p>
              <p className="text-xl sm:text-2xl font-bold">
                AL-SHARĪF AL-RADĪ
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
              {contentTypes.map((content, index) => (
                <div
                  key={content.label}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-[#43896B] rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <content.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{content.value}</div>
                  <div className="text-base sm:text-lg text-gray-600 font-medium mb-4">{content.label}</div>
                  <Link href={content.href}>
                    <Button icon={ <ArrowRightCircle size={16} />} className="w-full bg-[#43896B] hover:bg-[#5BA67C] text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                      Read {content.type}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="fixed bottom-4 sm:bottom-8 left-4 right-4 z-[999999] pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#43896B] rounded-xl flex items-center justify-center flex-shrink-0">
                <Disc color='#ffffff' size={20}  />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate">{currentSurah}</h3>
                <p className="text-xs sm:text-sm text-gray-600">(Tilawat & Translation)</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 sm:p-3 bg-[#43896B] hover:bg-[#5BA67C] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                  )}
                </button>
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-gray-500 font-mono w-10 text-left">{formatTime(currentTime)}</span>
              <div className="relative h-1.5 bg-gray-200 rounded-full flex-grow">
                <div
                  className="absolute left-0 top-0 h-full bg-[#43896B] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#43896B] rounded-full shadow-lg transition-all duration-300"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
              <span className="text-xs text-gray-500 font-mono w-10 text-right">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default HeroSection