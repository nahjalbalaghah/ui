'use client'
import React, { useState, useEffect } from 'react'
import { Menu, X, MapPin, Clock, Phone, Mail, Search, ChevronDown, Home, Calendar, Headphones, GraduationCap, FileText, MessageCircle, Facebook, Twitter, Youtube, Star, List } from 'lucide-react'
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
      <div className={`sticky top-0 z-50 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl' 
            : 'bg-white'
        }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <div className="w-18 h-16 bg-[#43896B] rounded-2xl flex items-center justify-center shadow-lg border border-[#43896B]/20">
                    <div className="text-center leading-none font-taha">
                      <div className="text-white font-bold text-lg mb-0.5">نهج</div>
                      <div className="text-white font-bold text-base -mt-1">البلاغة</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#43896B] leading-tight">
                    Nahj al-Balaghah
                  </h1>
                  <p className="text-sm text-gray-600 font-medium mt-0.5">
                    Way of Eloquence
                  </p>
                </div>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center space-x-2">
              {menuItems.map((item, index) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <button
                      className="cursor-pointer flex items-center gap-2 text-gray-700 px-4 py-2.5 font-medium rounded-xl"
                      onClick={() => handleDropdownToggle(item.name)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                      <div>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                  ) : (
                    <Link href={item.href}>
                      <div
                        className="cursor-pointer flex items-center gap-2 text-gray-700 px-4 py-2.5 font-medium rounded-xl"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <div className='hidden lg:block'>
               <Input placeholder='Search sermons...' icon={<Search size={16} />} />
              </div>
              <button
                className="lg:hidden p-2.5 rounded-xl border border-gray-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <div>
                    <X className="w-6 h-6 text-[#43896B]" />
                  </div>
                ) : (
                  <div>
                    <Menu className="w-6 h-6 text-[#43896B]" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
            <div className="lg:hidden bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-3">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 mb-6 shadow-sm border border-gray-200">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sermons, scholars..."
                    className="bg-transparent outline-none text-sm flex-1 placeholder-gray-500"
                  />
                </div>
                {menuItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {item.hasDropdown ? (
                      <button
                        className="flex items-center justify-between w-full text-left px-5 py-4"
                        onClick={() => handleDropdownToggle(item.name)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#43896B]/10 to-[#E8B873]/10 rounded-xl flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-[#43896B]" />
                          </div>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                        </div>
                        <div>
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </div>
                      </button>
                    ) : (
                      <Link href={item.href} onClick={closeMenu}>
                        <div className="flex items-center justify-between w-full text-left px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#43896B]/10 to-[#E8B873]/10 rounded-xl flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-[#43896B]" />
                            </div>
                            <span className="font-semibold text-gray-800">{item.name}</span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        {activeDropdown && (
          <div className="hidden lg:block fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={closeDropdown} />
        )}
      </div>
    </header>
  )
}

export default Header