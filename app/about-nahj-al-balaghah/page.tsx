import React from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "About Nahj al-Balaghah | Nahj al-Balaghah",
  description: "Learn about Nahj al-Balaghah (The Way of Eloquence) - a collection of sermons, letters, and sayings by Imam Ali ibn Abi Talib (AS).",
  openGraph: {
    title: "About Nahj al-Balaghah | Nahj al-Balaghah",
    description: "Learn about Nahj al-Balaghah (The Way of Eloquence) - a collection of sermons, letters, and sayings by Imam Ali ibn Abi Talib (AS).",
    url: "https://nahj-al-balagha.com/about-nahj-al-balaghah",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Nahj al-Balaghah | Nahj al-Balaghah",
    description: "Learn about Nahj al-Balaghah (The Way of Eloquence) - a collection of sermons, letters, and sayings by Imam Ali ibn Abi Talib (AS).",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
}

export default function AboutNahjAlBalaghahPage() {
  const resourceLinks = [
    {
      label: "\"Introduction\" to Nahj al-Balāghah: The Wisdom and Eloquence of ʿAlī, edited by Tahera Qutbuddin",
      href: "/pdfs/TQ-Introduction-to-Nahj-al-Balaghah.pdf"
    },
    {
      label: "\"Nahj al-Balagha\", Qutbuddin, Tahera — Encyclopaedia of Islam, THREE",
      href: "https://referenceworks.brillonline.com/entries/encyclopaedia-of-islam-3/nahj-al-balagha-COM_27422"
    },
    {
      label: "\"Nahdj al-Balāgha\", Mukhtar Djebli — Encyclopaedia of Islam, Second Edition",
      href: "https://referenceworks.brillonline.com/entries/encyclopaedia-of-islam-2/nahdj-al-balagha-SIM_5765"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#43896B]/10 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-[#43896B]" />
              <span className="text-[#43896B] font-bold text-xl tracking-wide">About Nahj al-Balaghah</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-6">
              The <span className='text-[#43896B]'>Way of Eloquence</span>
            </h1>
            <div className="h-1 bg-[#43896B] rounded-full w-24 mx-auto mb-8"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {resourceLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-6 bg-white rounded-xl border-2 border-[#43896B]/20 hover:border-[#43896B]/40 hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-lg text-gray-800 group-hover:text-[#43896B] transition-colors duration-300 pr-4">
                  {link.label}
                </span>
                <ExternalLink className="w-5 h-5 text-[#43896B] flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}