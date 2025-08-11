'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, Quote, Scroll, Calendar, Archive } from 'lucide-react'
import Button from '@/app/components/button'
import Link from 'next/link'

const OrationsLettersSayingsSection = () => {
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

    const section = document.getElementById('orations-letters-sayings-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const collections = [
    {
      icon: MessageSquare,
      title: "Orations",
      items: [
        "Eloquent discourses on faith, justice, and governance by Imam Ali (AS)",
        "Guidance on spiritual and ethical conduct",
        "Addresses on social justice and leadership",
        "Reflections on the nature of the world and the hereafter"
      ],
      period: "Collected 10th Century (by Sharif al-Radi)"
    },
    {
      icon: Mail,
      title: "Letters",
      items: [
        "Correspondence to governors and officials on justice and administration",
        "Letters to family and companions with moral and spiritual advice",
        "Political and diplomatic letters during Imam Ali's caliphate",
        "Testaments and instructions for posterity"
      ],
      period: "Collected 10th Century (by Sharif al-Radi)"
    },
    {
      icon: Quote,
      title: "Sayings",
      items: [
        "Concise maxims and aphorisms on life, knowledge, and virtue",
        "Guidance on humility, patience, and piety",
        "Reflections on the human condition and society",
        "Timeless advice for personal development"
      ],
      period: "Collected 10th Century (by Sharif al-Radi)"
    }
  ]

  return (
    <section id="orations-letters-sayings-section" className="py-24 bg-[#f9fafb] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center gap-3"
          >
            <Scroll className="w-6 h-6 text-[#43896B]" />
            <span className="text-[#43896B] font-bold text-lg tracking-wide">Literary Heritage</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight mt-4"
          >
            <span className="text-[#43896B]">Orations</span>, Letters & Sayings
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
            Explore the eloquence and wisdom of Imam Ali ibn Abi Talib (AS) through the Nahj al-Balaghah—a collection of sermons, letters, and sayings compiled by Sharif al-Radi. These texts offer profound insights into faith, justice, leadership, and the human experience.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
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
              <div className="space-y-3 pl-2 mb-6">
                {collection.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#43896B] mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href={
                      collection.title === 'Orations' ? '/orations' :
                      collection.title === 'Letters' ? '/letters' :
                      collection.title === 'Sayings' ? '/sayings' : '/orations'
                    } 
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Button variant="outlined" className="w-full">
                      Read {collection.title}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outlined" icon={<Archive size={16} />}>
              Browse Literary Collection
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default OrationsLettersSayingsSection