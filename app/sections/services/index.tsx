"use client";
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, Users, Globe, Heart, Scroll, Lightbulb, MessageCircle, Download, Play } from 'lucide-react'
import Image from 'next/image';

const ServicesSection = () => {
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

    const section = document.getElementById('services-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      id: 1,
      icon: BookOpen,
      title: "Digital Nahj al-Balaghah Library",
      description: "Access the complete collection of sermons, letters, and sayings in multiple formats",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces",
      gradient: "from-[#43896B] to-[#43896B]/80"
    },
    {
      id: 2,
      icon: Search,
      title: "Advanced Text Search",
      description: "Find specific teachings by topic, theme, or keyword across Nahj al-Balaghah",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      gradient: "from-[#43896B] to-[#43896B]/80"
    },
    {
      id: 3,
      icon: Globe,
      title: "Multi-Language Translations",
      description: "Read Nahj al-Balaghah in Arabic, English, Urdu, Persian, and more languages",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      gradient: "from-[#43896B] to-[#43896B]/80"
    },
    {
      id: 4,
      icon: Lightbulb,
      title: "Scholarly Commentary",
      description: "Access classical and modern commentaries on Nahj al-Balaghah",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      gradient: "from-[#43896B] to-[#43896B]/80"
    },
    {
      id: 5,
      icon: MessageCircle,
      title: "Community Discussions",
      description: "Join discussions and share insights on the teachings of Imam Ali (AS)",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
      gradient: "from-[#43896B] to-[#43896B]/80"
    }
  ]

  return (
    <section id="services-section" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#43896B] rounded-full"></div>
              <div className="w-2 h-2 bg-[#43896B]/60 rounded-full"></div>
              <div className="w-2 h-2 bg-[#43896B] rounded-full"></div>
            </div>
            <span className="text-[#43896B] font-bold text-lg tracking-wide">What We Offer</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#43896B] rounded-full"></div>
              <div className="w-2 h-2 bg-[#43896B]/60 rounded-full"></div>
              <div className="w-2 h-2 bg-[#43896B] rounded-full"></div>
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl lg:text-6xl font-black text-gray-800 tracking-tight leading-tight mb-6"
          >
            Our Services
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: "120px" } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-[#43896B] rounded-full mx-auto"
          ></motion.div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
              className="group relative h-full flex"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 flex flex-col w-full">
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-80 group-hover:opacity-70 transition-opacity duration-500`}></div>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isVisible ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                    className="absolute top-6 left-6 w-16 h-16 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl border border-white/50 group-hover:scale-110 transition-transform duration-300"
                  >
                    <service.icon className="w-8 h-8 text-gray-700" />
                  </motion.div>
                </div>
                <div className="p-6 space-y-4 flex flex-col flex-grow">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + (index * 0.1) }}
                    className="text-xl font-bold text-gray-800 group-hover:text-[#43896B] transition-colors duration-300"
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                    className="text-gray-600 leading-relaxed text-sm flex-grow"
                  >
                    {service.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 + (index * 0.1) }}
                    className="flex items-center gap-2 text-[#43896B] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 mt-auto"
                  >
                    <span className="text-sm font-semibold">Learn More</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection