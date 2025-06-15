'use client'
import React, { useState } from 'react'
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
  Send,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribing:', { name, email })
    setName('')
    setEmail('')
  }

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
      <div className="relative border-b border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                Subscribe, For Weekly Updates
              </h3>
              <p className="text-white/80 text-lg">
                Stay connected with our latest sermons and Islamic teachings
              </p>
            </motion.div>
            <motion.form
              onSubmit={handleSubscribe}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto min-w-[400px]"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address *"
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 justify-center whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                SIGNUP NOW
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">البلاغة</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-[#43896B]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Nahj al-Balagha</h2>
                  <p className="text-sm text-white/80">The Path of Eloquence</p>
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
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-xl font-bold mb-6">Latest Blogs</h3>
              <div className="space-y-4">
                {latestBlogs.map((blog, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 bg-white/30 rounded-md"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-white transition-colors duration-200 mb-1">
                        {blog.title}
                      </h4>
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{blog.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-xl font-bold mb-6">Subscribe Newsletter</h3>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Subscribe
                </motion.button>
              </form>
              <div className="mt-6">
                <p className="text-white/80 text-sm mb-2">
                  <Link href="#" className="hover:text-white transition-colors duration-200 underline">
                    Claim your form
                  </Link> to manage and email your new subscribers!
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm font-medium mb-4">Follow Us:</p>
                <div className="flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
                  >
                    <Facebook className="w-4 h-4 text-white" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
                  >
                    <Youtube className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
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
                Nahj al-Balagha © Copyright {currentYear} - All Rights Reserved
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