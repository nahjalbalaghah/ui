'use client'
import React from 'react'
import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#43896B] to-[#3a7a5c] text-white overflow-hidden">
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center flex flex-col items-center lg:flex-row lg:justify-between">
            <div className="flex items-center justify-center gap-3 mb-6 lg:mb-0">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
                  <div className="text-center leading-none font-taha">
                    <div className="text-white font-bold text-xs mb-0.5">نهج</div>
                    <div className="text-white font-bold text-xs -mt-0.5">البلاغة</div>
                  </div>
                </div>
              </div>
              <div className='text-left' >
                <h2 className="text-lg font-bold text-white">Nahj al-Balaghah</h2>
                <p className="text-sm text-white/80">Way of Eloquence</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/contact">
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-colors">
                  Contact Us
                </button>
              </Link>
              <Link href="/about-us">
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-colors">
                  About Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer