'use client'
import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#43896B] to-[#3a7a5c] text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="relative py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="flex items-center gap-4 group">
              <div className="relative transform transition-transform duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/10">
                  <div className="text-center leading-none font-taha">
                    <div className="text-white font-bold text-base mb-1">نهج</div>
                    <div className="text-white font-bold text-base -mt-1">البلاغة</div>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Nahj al-Balaghah</h2>
                <p className="text-sm md:text-base text-white/90 font-light tracking-wide">Way of Eloquence</p>
              </div>
            </div>
            <nav className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20 shadow-lg">
              <Link href="/contact">
                <button className="px-6 md:px-8 py-3 md:py-3.5 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 ease-in-out hover:shadow-md active:scale-95">
                  Contact Us
                </button>
              </Link>
              <div className="w-px h-8 bg-white/30"></div>
              <Link href="/about-us">
                <button className="px-6 md:px-8 py-3 md:py-3.5 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 ease-in-out hover:shadow-md active:scale-95">
                  About Us
                </button>
              </Link>
            </nav>
          </div>
          <div className="my-8 md:my-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="text-center">
            <p className="text-sm md:text-base text-white/80 font-light">
              © {currentYear} Nahj al-Balaghah. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </footer>
  )
}

export default Footer