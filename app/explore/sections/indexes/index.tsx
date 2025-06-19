'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, MapPin, Bookmark, ScrollText, Quote, Languages, Scale, Club } from 'lucide-react'
import Button from '@/app/components/button'

const IndexesSection = () => {
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

    const section = document.getElementById('indexes-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const indexes = [
    {
      icon: MapPin,
      title: "Index of Names and Places",
      description: "Locate people, tribes, and geographic regions mentioned in Nahj al-Balaghah"
    },
    {
      icon: Languages,
      title: "Index of Terms",
      description: "Understand key Arabic and Islamic terminology used in the sermons and letters"
    },
    {
      icon: Bookmark,
      title: "Index of Qur'an, Hadith, Poetry, and Proverbs",
      description: "Find scriptural references, poetic verses, and traditional wisdom quoted throughout the text"
    },
    {
      icon: Scale,
      title: "Index of Religious and Ethical Concepts",
      description: "Explore core values and concepts like justice, piety, and ethics as emphasized by Imam Ali"
    }
  ]

  return (
    <section id="indexes-section" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-16 items-center">
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
                <ScrollText className="w-6 h-6 text-[#43896B]" />
                <span className="text-[#43896B] font-bold text-lg tracking-wide">Deeper Exploration</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight"
              >
                Indexes for <span className='text-[#43896B]'>Study & Research</span>
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
                Explore categorized indexes to navigate <span className="font-semibold text-[#43896B]">Nahj al-Balaghah</span> with greater clarity and focus. Our comprehensive indexes help scholars, students, and researchers find exactly what they're looking for.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're studying specific concepts, tracing references, or analyzing historical contexts, these tools will enhance your understanding of Imam Ali's timeless wisdom.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-1 gap-6 mt-8"
            >
              {indexes.map((index, i) => (
                <motion.div
                  key={index.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + (i * 0.1) }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#43896B]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <index.icon className="w-6 h-6 text-[#43896B]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{index.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{index.description}</p>
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
                <Button variant='solid' icon={<BookOpen size={16} />}>Browse All Indexes</Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default IndexesSection