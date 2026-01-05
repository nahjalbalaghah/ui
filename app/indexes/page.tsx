import React from 'react'
import { BookOpen, MapPin, Bookmark, ScrollText, Languages, Scale, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/app/components/button'

export const metadata: Metadata = {
  title: "Indexes | Nahj al-Balaghah",
  description: "Browse comprehensive indexes of Nahj al-Balaghah including names, places, terms, and religious concepts. Find references to people, locations, and key Islamic terminology.",
  openGraph: {
    title: "Indexes | Nahj al-Balaghah",
    description: "Browse comprehensive indexes of Nahj al-Balaghah including names, places, terms, and religious concepts.",
    url: "https://nahj-al-balagha.com/indexes",
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
    title: "Indexes | Nahj al-Balaghah",
    description: "Browse comprehensive indexes of Nahj al-Balaghah including names, places, terms, and religious concepts.",
    images: [
      {
        url: "/globe.svg",
        alt: "Nahj al-Balaghah Logo"
      }
    ]
  }
}

const indexes = [
  {
    icon: MapPin,
    title: "Index of Names and Places",
    description: "",
    href: "/indexes/names-places"
  },
  {
    icon: Languages,
    title: "Index of Terms",
    description: "Explore the rich vocabulary and terminology used by Imam Ali (AS) in Nahj al-Balaghah. This index covers important Arabic words, Islamic concepts, and technical terms.",
    href: "/indexes/terms"
  },
  {
    icon: Bookmark,
    title: "Index of Qur'an, Hadith, Poetry, and Proverbs",
    description: "Discover the extensive references to the Holy Qur'an, prophetic traditions (Hadith), Arabic poetry, and traditional proverbs that Imam Ali (AS) incorporates into his eloquent discourse.",
    href: "/indexes/quran-hadith"
  },
  {
    icon: Scale,
    title: "Index of Religious and Ethical Concepts",
    description: "Delve into the fundamental Islamic principles and ethical teachings that form the backbone of Nahj al-Balaghah. This index covers concepts such as justice, piety, leadership, and spirituality.",
    href: "/indexes/religious-concepts"
  }
]

export default function IndexesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-[#43896B]/10 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ScrollText className="w-8 h-8 text-[#43896B]" />
              <span className="text-[#43896B] font-bold text-xl tracking-wide">Indexes</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-6">
              <span className='text-[#43896B]'>Indexes</span>
            </h1>
            <div className="h-1 bg-[#43896B] rounded-full w-24 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The following indexes draw from the indexes in Tahera Qutbuddin's <em>Nahj al-Balāghah: The Wisdom and Eloquence of ʿAlī</em> (Boston: Brill, 2024).
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {indexes.map((index, i) => (
              <Link 
                key={index.title} 
                href={index.href}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 group block"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#43896B]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <index.icon className="w-6 h-6 text-[#43896B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#43896B] transition-colors duration-300">
                        {index.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {index.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button variant='outlined' className="w-full group-hover:bg-[#43896B] group-hover:text-white group-hover:border-[#43896B] transition-all duration-300">
                      <span className="flex items-center justify-center gap-2">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}