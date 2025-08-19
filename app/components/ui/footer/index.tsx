'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Youtube, 
  Star,
  ChevronUp,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear();



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const latestBlogs = [
    {
      title: "Ulama Khutbaat On Islam",
      date: "Jan 10, 2023",
      image: "/api/placeholder/60/60"
    },
    {
      title: "Ulama Sermons with Audio",
      date: "Jan 05, 2023", 
      image: "/api/placeholder/60/60"
    },
    {
      title: "Quran, Life Guide Book",
      date: "Jan 06, 2023",
      image: "/api/placeholder/60/60"
    }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-[#43896B] to-[#3a7a5c] text-white overflow-hidden">
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
                    <div className="text-center leading-none font-taha">
                      <div className="text-white font-bold text-xs mb-0.5">نهج</div>
                      <div className="text-white font-bold text-xs -mt-0.5">البلاغة</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Nahj al-Balaghah</h2>
                  <p className="text-sm text-white/80">Way of Eloquence</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Dedicated to spreading the timeless wisdom of Islamic teachings through authentic sermons, scholarly discussions, and community engagement.
              </p>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-sm">Jamia Mosque, New Orleans USA</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-xl font-bold mb-6">Contact Info</h3>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">info@example.com</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">1800-123-456-7</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">19-J David Road H Block, America</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">1800-123-456-7</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/20 py-6 pb-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.p 
              className="text-white/80 text-sm text-center sm:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
                Nahj al-Balaghah © Copyright {currentYear} - All Rights Reserved
            </motion.p>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer