'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MapPin, Clock, Phone, Mail, Search, ChevronDown, Home, Calendar, Headphones, GraduationCap, FileText, MessageCircle, DollarSign, Facebook, Twitter, Youtube, Star, List } from 'lucide-react'
import Link from 'next/link'
import Input from '../../input'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    {
      name: 'Home',
      icon: Home,
      href: '/',
      hasDropdown: false
    },
    {
      name: 'About',
      icon: List,
      href: '/about-us',
      hasDropdown: false
    },
    {
      name: 'Explore',
      icon: Search,
      href: '/explore',
      hasDropdown: false
    },
    {
      name: 'Contact',
      icon: MessageCircle,
      href: '/contact',
      hasDropdown: false
    }
  ]

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  const closeDropdown = () => {
    setActiveDropdown(null)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <header className="relative">
      <div className="bg-gradient-to-r from-[#43896B] via-[#4a9473] to-[#43896B] text-white py-3.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8">
            <motion.div 
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Star className="w-4 h-4 text-[#E8B873]" />
              <span className="text-sm font-medium">A Treasury of Imam Ali’s Wisdom</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="w-4 h-4 text-[#E8B873]" />
              <span className="text-sm font-medium">240+ Sermons, Letters & Sayings</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/explore" className="text-xs font-medium opacity-90 hover:underline">Explore</Link>
              <Link href="/contact" className="text-xs font-medium opacity-90 hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>
      <motion.div 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl' 
            : 'bg-white'
        }`}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <motion.div 
                className="flex items-center gap-3 cursor-pointer group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-[#43896B] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-lg">البلاغة</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8B873] rounded-full flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                <div className="group-hover:translate-x-1 transition-transform duration-300">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#43896B] to-[#4a9473] bg-clip-text text-transparent">
                    Nahj al-Balagha
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">The Path of Timeless Eloquence</p>
                </div>
              </motion.div>
            </Link>
            <nav className="hidden lg:flex items-center space-x-2">
              {menuItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <motion.button
                      className="cursor-pointer flex items-center gap-2 text-gray-700 hover:text-[#43896B] transition-all duration-300 px-4 py-2.5 font-medium rounded-xl hover:bg-[#43896B]/5 group"
                      onClick={() => handleDropdownToggle(item.name)}
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <item.icon className="w-4 h-4 group-hover:text-[#E8B873] transition-colors duration-200" />
                      {item.name}
                      <motion.div
                        animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>
                  ) : (
                    <Link href={item.href}>
                      <motion.div
                        className="cursor-pointer flex items-center gap-2 text-gray-700 hover:text-[#43896B] transition-all duration-300 px-4 py-2.5 font-medium rounded-xl hover:bg-[#43896B]/5 group"
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <item.icon className="w-4 h-4 group-hover:text-[#E8B873] transition-colors duration-200" />
                        {item.name}
                      </motion.div>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <motion.div 
                whileFocus={{ scale: 1.02, borderColor: "#43896B" }}
                whileHover={{ scale: 1.02 }}
                className='hidden lg:block'
              >
               <Input placeholder='Search sermons...' icon={<Search size={16} />} />
              </motion.div>
              <motion.button
                className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200 hover:border-[#43896B]/30"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <X className="w-6 h-6 text-[#43896B]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu className="w-6 h-6 text-[#43896B]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-3">
                <motion.div 
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 mb-6 shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sermons, scholars..."
                    className="bg-transparent outline-none text-sm flex-1 placeholder-gray-500"
                  />
                </motion.div>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {item.hasDropdown ? (
                      <button
                        className="flex items-center justify-between w-full text-left px-5 py-4 hover:bg-gradient-to-r hover:from-[#43896B]/5 hover:to-[#E8B873]/5 transition-all duration-300"
                        onClick={() => handleDropdownToggle(item.name)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#43896B]/10 to-[#E8B873]/10 rounded-xl flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-[#43896B]" />
                          </div>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </motion.div>
                      </button>
                    ) : (
                      <Link href={item.href} onClick={closeMenu}>
                        <div className="flex items-center justify-between w-full text-left px-5 py-4 hover:bg-gradient-to-r hover:from-[#43896B]/5 hover:to-[#E8B873]/5 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#43896B]/10 to-[#E8B873]/10 rounded-xl flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-[#43896B]" />
                            </div>
                            <span className="font-semibold text-gray-800">{item.name}</span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                ))}
                <motion.button 
                  className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#E8B873] to-[#d4a961] hover:from-[#d4a961] hover:to-[#E8B873] text-white px-6 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 mt-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Make Donation</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {activeDropdown && (
          <motion.div 
            className="hidden lg:block fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" 
            onClick={closeDropdown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </header>
  )
}

export default Header