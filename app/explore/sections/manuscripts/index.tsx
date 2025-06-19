'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Globe, Layers, Archive, Map, Star, Calendar, Library } from 'lucide-react'
import Button from '@/app/components/button'

const ManuscriptsSection = () => {
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

    const section = document.getElementById('manuscripts-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const collections = [
    {
      icon: Layers,
      title: "Bodleian Library Foundations",
      items: [
        "MS. Bodl. Or. 322 - Early Qur'an manuscript (1601)",
        "17th century Arabic studies revival",
        "John Wrothe's diplomatic gift"
      ],
      period: "Early 17th Century"
    },
    {
      icon: Archive,
      title: "Laud & Pococke Collections",
      items: [
        "MS. Pococke 400 - Kalilah wa-Dinnah (14th c.)",
        "MS. Pococke 375 - al-Idrisi's Book of Roger",
        "MS. Greaves 42 - Partial Book of Roger"
      ],
      period: "1630s-1650s"
    },
    {
      icon: Map,
      title: "Huntington Collection",
      items: [
        "MS. Huntington 212 - al-Şüf's Book of Fixed Stars (12th c.)",
        "MS. Huntington 264 - Military arts for Saladin's treasury",
        "Robert Huntington's Middle Eastern acquisitions"
      ],
      period: "Late 17th Century"
    },
    {
      icon: Library,
      title: "Marsh Collection",
      items: [
        "MS. Marsh 144 - Illustrated Book of Fixed Stars",
        "MS. Marsh 294 - al-Sjifāqsi's Portolan Atlas (16th c.)",
        "1714 bequest of Archbishop Narcissus Marsh"
      ],
      period: "Early 18th Century"
    },
    {
      icon: Star,
      title: "Notable Individual Manuscripts",
      items: [
        "MS. Bodl. Or. 793 - Safavid era Qur'an (ex-Tipū Sultān)",
        "MS. Bodl. Or. 133 - Kitāb al-Bulhān (15th c. Baghdad)",
        "MS. Arab. c. 90 - Book of Curiosities (recent acquisition)"
      ],
      period: "Various Periods"
    }
  ]

  return (
    <section id="manuscripts-section" className="py-24 bg-[#f9fafb] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center gap-3"
          >
            <BookOpen className="w-6 h-6 text-[#43896B]" />
            <span className="text-[#43896B] font-bold text-lg tracking-wide">Historical Treasures</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight mt-4"
          >
            Islamic <span className="text-[#43896B]">Manuscripts & Maps</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: "120px" } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-[#43896B] rounded-full mx-auto mt-6"
          ></motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16 max-w-4xl mx-auto text-center"
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            Since the Bodleian Library's opening in 1602, its collections have grown to include extraordinary Islamic manuscripts
            and maps, beginning with an early Qur'an manuscript gifted by diplomat John Wrothe. These treasures reflect centuries
            of scholarly exchange between Europe and the Islamic world.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + (index * 0.1) }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#43896B]/10 rounded-xl flex items-center justify-center">
                  <collection.icon className="w-6 h-6 text-[#43896B]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{collection.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{collection.period}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 pl-2">
                {collection.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#43896B] mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outlined" icon={<Globe size={16} />}>
              Explore Digital Collections
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ManuscriptsSection