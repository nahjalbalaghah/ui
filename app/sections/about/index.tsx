'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Users, BookOpen, Heart, Clock, MapPin, Award, Sparkles, Scroll, Lightbulb } from 'lucide-react'
import Button from '@/app/components/button'
import Image from 'next/image'
import AboutImage from '@/app/assets/images/about.svg'

const AboutSection = () => {
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

    const section = document.getElementById('about-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Scroll,
      title: "Authentic Compilation",
      description: "Original sermons, letters, and sayings of Imam Ali (AS) compiled by Sharif al-Radi"
    },
    {
      icon: Lightbulb,
      title: "Timeless Wisdom",
      description: "Profound insights on life, governance, and spirituality from Nahj al-Balagha"
    },
    {
      icon: Heart,
      title: "Spiritual Guidance",
      description: "Path to self-purification and divine connection through the teachings of Imam Ali (AS)"
    },
    {
      icon: Award,
      title: "Literary Excellence",
      description: "A masterpiece of Arabic literature and eloquence, revered by scholars for centuries"
    }
  ]

  return (
    <section id="about-section" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              <div className="relative">
                <Image
                  src={AboutImage}
                  alt="Nahj al-Balagha"
                  className="w-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#43896B] rounded-xl flex items-center justify-center">
                      <Scroll className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">1000+</div>
                      <div className="text-sm text-gray-600">Years Old</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#43896B] rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">241</div>
                      <div className="text-sm text-gray-600">Sermons</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <Sparkles className="w-6 h-6 text-[#43896B]" />
                <span className="text-[#43896B] font-bold text-lg tracking-wide">Peak of Eloquence</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight"
              >
                About <span className='text-[#43896B]'>Nahj al-Balagha</span>
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={isVisible ? { width: "120px" } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-1 bg-[#43896B] rounded-full"
              ></motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                Nahj al-Balagha, meaning <span className="font-semibold text-[#43896B]">"Peak of Eloquence"</span>, is a collection of sermons, letters, and sayings attributed to Imam Ali ibn Abi Talib (AS). Compiled by Sharif al-Radi in the 10th century, it stands as one of the most revered texts in Islamic literature.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                This masterpiece contains profound wisdom on governance, spirituality, ethics, and human nature. Its eloquent Arabic prose and deep philosophical insights continue to inspire millions of readers across the world, transcending religious and cultural boundaries.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#43896B]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-5 h-5 text-[#43896B]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant='solid' icon={<BookOpen size={16} />} >Explore Teachings</Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-24 grid grid-cols-3 md:grid-cols-3 gap-8"
        >
          {[
            { icon: Scroll, label: "Sermons", value: "241" },
            { icon: Heart, label: "Letters", value: "79" },
            { icon: Lightbulb, label: "Sayings", value: "489" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 + (index * 0.2) }}
              className="text-center group"
            >
              <div className={`w-20 h-20 bg-gradient-to-r bg-[#43896B] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection