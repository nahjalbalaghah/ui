'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Bell, Calendar, MapPin } from 'lucide-react'

const TimingsSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('timings-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getCurrentDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const prayerTimes = [
    {
      name: "FAJR",
      begins: "4:46 AM",
      iqamah: "4:55 AM",
      highlight: false
    },
    {
      name: "ZUHR",
      begins: "1:02 PM",
      iqamah: "1:30 PM",
      highlight: false
    },
    {
      name: "ASR",
      begins: "6:32 PM",
      iqamah: "7:00 PM",
      highlight: false
    },
    {
      name: "MAGRIB",
      begins: "9:18 PM",
      iqamah: "9:20 PM",
      highlight: false
    },
    {
      name: "ISHA",
      begins: "10:34 PM",
      iqamah: "10:50 PM",
      highlight: false
    },
    {
      name: "JUMMAH",
      start: "12:30 PM",
      iqamah: "1:30 PM",
      highlight: true
    }
  ]

  return (
    <section id="timings-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-60 left-10 w-96 h-96 rounded-full bg-[#43896B]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#43896B]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full mb-6">
            <Bell className="w-5 h-5 text-[#43896B]" />
            <span className="text-[#43896B] font-semibold text-sm tracking-wide">
              ASSOCIATED MOSQUE
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Prayer <span className='text-[#43896B]'>Timings</span>
          </h1>
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible ? { width: "200px" } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="h-1 rounded-full bg-[#43896B]"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#43896B]" />
              <span className="font-medium">{getCurrentDate()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#43896B]" />
              <span className="font-medium">Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#43896B]" />
              <span className="font-bold text-xl text-[#43896B]">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
        >
          {prayerTimes.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative p-8 rounded-3xl transition-all duration-500 ${
                prayer.highlight 
                  ? 'text-white shadow-2xl transform scale-105 bg-gradient-to-br from-[#43896B] to-[#357a5b]' 
                  : 'bg-white text-gray-800 shadow-lg hover:shadow-2xl border border-gray-100'
              }`}
            >
              {prayer.highlight && (
                <div className="absolute -inset-1 rounded-3xl opacity-30 bg-gradient-to-br from-[#43896B] to-[#2d6b4f]"></div>
              )}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-black tracking-wide ${
                    prayer.highlight ? 'text-white' : 'text-gray-900'
                  }`}>
                    {prayer.name}
                  </h3>
                  {prayer.highlight && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="group/time">
                    <div className={`text-sm font-semibold mb-2 tracking-wide ${
                      prayer.highlight ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {prayer.name === 'JUMMAH' ? 'START TIME' : 'BEGINS'}
                    </div>
                    <div className={`text-2xl font-black tracking-tight ${
                      prayer.highlight ? 'text-white' : 'text-[#43896B]'
                    }`}>
                      {prayer.name === 'JUMMAH' ? prayer.start : prayer.begins}
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20"></div>
                  <div className="group/time">
                    <div className={`text-sm font-semibold mb-2 tracking-wide ${
                      prayer.highlight ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      IQAMAH
                    </div>
                    <div className={`text-2xl font-black tracking-tight ${
                      prayer.highlight ? 'text-white' : 'text-gray-900'
                    }`}>
                      {prayer.iqamah}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl opacity-5 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border">
            <div className="w-2 h-2 rounded-full animate-pulse bg-[#43896B]"></div>
            <span className="text-gray-600 font-medium">
              Timings calculated for Lahore, Pakistan • Updates automatically
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TimingsSection