"use client";
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, User, Moon, Heart, MapPin } from 'lucide-react'

const PillarsSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('pillars-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const pillars = [
    {
      name: "Shahadah",
      subtitle: "(Faith)",
      icon: Users,
      description: "Declaration of faith in Allah and Prophet Muhammad"
    },
    {
      name: "Salah",
      subtitle: "(Prayer)",
      icon: User,
      description: "Five daily prayers connecting the believer to Allah"
    },
    {
      name: "Sawm",
      subtitle: "(Fasting)",
      icon: Moon,
      description: "Fasting during the holy month of Ramadan"
    },
    {
      name: "Zakat",
      subtitle: "(Almsgiving)",
      icon: Heart,
      description: "Giving to charity and helping those in need"
    },
    {
      name: "Hajj",
      subtitle: "(Pilgrimage)",
      icon: MapPin,
      description: "Pilgrimage to Mecca for those who are able"
    }
  ]

  return (
    <section id="pillars-section" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#43896B]"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-[#43896B]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#43896B]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-[#43896B]"></div>
            <span className="text-[#43896B] font-semibold text-sm tracking-wide">
              ABOUT ESSENTIAL
            </span>
            <div className="w-2 h-2 rounded-full bg-[#43896B]"></div>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Pillars of <span className='text-[#43896B]'>Islam</span>
          </h1>
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible ? { width: "300px" } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="relative"
            >
              <div className="h-1 rounded-full bg-[#43896B]"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#43896B]"></div>
              <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#43896B]"></div>
              <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#43896B]"></div>
            </motion.div>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            The Five Pillars of Islam are the foundation of Muslim faith and practice, 
            representing the core obligations that shape a Muslim's relationship with Allah.
          </p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#43896B] to-transparent opacity-30"></div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4"
          >
            {pillars.map((pillar, index) => {
              const IconComponent = pillar.icon
              return (
                <motion.div
                  key={pillar.name}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 + (index * 0.15) }}
                  whileHover={{ y: -10, scale: 1.05, transition: { duration: 0.3 } }}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* Pillar Circle */}
                  <div className="relative mb-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className="w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-[#43896B] to-[#357a5b] shadow-2xl flex items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-2 rounded-full border-2 border-white/20 border-dashed"></div>
                      <IconComponent className="w-12 h-12 lg:w-14 lg:h-14 text-white" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                    </motion.div>
                    <div className="absolute inset-0 rounded-full border-2 border-[#43896B] opacity-0 group-hover:opacity-100 animate-ping"></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl lg:text-3xl font-black text-white tracking-wide">
                      {pillar.name}
                    </h3>
                    <p className="text-[#43896B] font-bold text-lg tracking-wide">
                      {pillar.subtitle}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
                      {pillar.description}
                    </p>
                  </div>
                  {index < pillars.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-8 mb-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-[#43896B] animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-[#43896B] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#43896B] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-3 h-3 rounded-full bg-[#43896B] animate-pulse"></div>
            <span className="text-white font-medium text-sm lg:text-lg">
              Foundation of Faith • Unity in Practice
            </span>
            <div className="w-3 h-3 rounded-full bg-[#43896B] animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PillarsSection