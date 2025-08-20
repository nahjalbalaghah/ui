"use client";
import React, { useState, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2, BookOpen, Users, Star, ArrowRight, Calendar, MapPin, Clock, Disc, ChevronRight, MessageSquare, Mail, ArrowRightCircle } from 'lucide-react'
import HeroMosqueImage from '@/app/assets/images/hero-mosque.jpg'
import TitleImage from '@/app/assets/images/title.png'
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
      arabic: "الحكم",
      label: "Sayings",
      href: "/sayings",
      type: "Saying"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjwvcGF0aD4KPC9zdmc+')] bg-repeat"></div>
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex-grow flex items-center justify-center pb-32 pt-16">
          <div className="max-w-7xl mx-auto text-center w-full">
            <div className="mb-8">
              <div className="flex justify-center items-center mb-4">
                <Image 
                  src={TitleImage} 
                  alt="نهج البلاغة" 
                  className="h-auto w-64 sm:w-72 lg:w-80 max-w-full"
                />
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
            <div className="text-center mb-8">
              <p className="text-base sm:text-lg text-gray-600 mb-2">Compiled By</p>
              <p className="text-xl sm:text-2xl font-bold">
                AL-SHARIF AL-RADI
              </p>
            </div>
            <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
              {contentTypes.map((content, index) => (
                <div
                  key={content.label}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex flex-col items-center"
                >
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#43896B] mb-2 font-[uthman-taha]" style={{ fontFamily: 'uthman-taha, serif', letterSpacing: '0.02em' }}>
                    {content.arabic}
                  </div>
                  <div className="mt-6 text-base sm:text-lg text-gray-600 font-medium mb-4">{content.label}</div>
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
    </div>
  )
}

export default HeroSection