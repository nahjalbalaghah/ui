'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, MapPin, Bookmark, ScrollText, Languages, Scale, FileText, Info } from 'lucide-react'
import Button from '@/app/components/button'
import Link from 'next/link'

const MainCardsSection = () => {
  const cards = [
    {
      icon: FileText,
      title: "Manuscripts",
      description: "Explore rare manuscripts of Nahj al-Balaghah from renowned libraries across the world",
      href: "/manuscripts",
      buttonText: "Explore Manuscripts"
    },
    {
      icon: BookOpen,
      title: "Indexes",
      description: "Browse comprehensive indexes including names, places, terms, and religious concepts from Nahj al-Balaghah",
      href: "/indexes",
      buttonText: "Browse Indexes"
    },
    {
      icon: Info,
      title: "About Nahj al-Balaghah",
      description: "Learn about the history, significance, and compilation of Nahj al-Balaghah, The Way of Eloquence",
      href: "/about-nahj-al-balaghah",
      buttonText: "Learn More"
    }
  ]

  return (
    <section id="main-cards-section" className="pt-10 pb-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <ScrollText className="w-6 h-6 text-[#43896B]" />
                <span className="text-[#43896B] font-bold text-lg tracking-wide">Explore Nahj al-Balaghah</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight"
              >
                <span className='text-[#43896B]'>Resources</span>
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "120px" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-1 bg-[#43896B] rounded-full"
              ></motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {cards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + (i * 0.1) }}
                >
                  <Link href={card.href}>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 group h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-[#43896B]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <card.icon className="w-6 h-6 text-[#43896B]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">{card.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{card.description}</p>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button variant='outlined' className="w-full">
                              {card.buttonText}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MainCardsSection