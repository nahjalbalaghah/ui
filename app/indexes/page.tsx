import React from 'react'
import { BookOpen, MapPin, Bookmark, ScrollText, Languages, Scale } from 'lucide-react'
import type { Metadata } from 'next'

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
    description: "Locate people, tribes, and geographic regions mentioned in Nahj al-Balaghah",
    content: "This comprehensive index includes references to historical figures, prophets, companions of the Prophet Muhammad (PBUH), and various tribes and locations mentioned throughout Nahj al-Balaghah. It serves as a valuable resource for understanding the historical and geographical context of Imam Ali's (AS) sermons, letters, and sayings."
  },
  {
    icon: Languages,
    title: "Index of Terms",
    description: "Understand key Arabic and Islamic terminology used in the sermons, letters, and sayings of Nahj al-Balaghah",
    content: "Explore the rich vocabulary and terminology used by Imam Ali (AS) in Nahj al-Balaghah. This index covers important Arabic words, Islamic concepts, and technical terms that are essential for a deeper understanding of the text."
  },
  {
    icon: Bookmark,
    title: "Index of Qur'an, Hadith, Poetry, and Proverbs",
    description: "Find scriptural references, poetic verses, and traditional wisdom quoted throughout Nahj al-Balaghah",
    content: "Discover the extensive references to the Holy Qur'an, prophetic traditions (Hadith), Arabic poetry, and traditional proverbs that Imam Ali (AS) incorporates into his eloquent discourse. This index helps readers trace the sources of wisdom that inform Nahj al-Balaghah."
  },
  {
    icon: Scale,
    title: "Index of Religious and Ethical Concepts",
    description: "Explore core values and concepts like justice, piety, and ethics as emphasized by Imam Ali in Nahj al-Balaghah",
    content: "Delve into the fundamental Islamic principles and ethical teachings that form the backbone of Nahj al-Balaghah. This index covers concepts such as justice, piety, leadership, spirituality, and moral conduct as articulated by Imam Ali (AS)."
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
              <span className="text-[#43896B] font-bold text-xl tracking-wide">Comprehensive Indexes</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-black tracking-tight leading-tight mb-6">
              Explore Nahj al-Balaghah <span className='text-[#43896B]'>Indexes</span>
            </h1>
            <div className="h-1 bg-[#43896B] rounded-full w-24 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Navigate through detailed indexes of names, places, terms, and concepts to deepen your understanding of Nahj al-Balaghah's profound wisdom.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:gap-12">
            {indexes.map((index, i) => (
              <div key={index.title} className="bg-white rounded-2xl shadow-lg border border-[#43896B]/10 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#43896B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <index.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#43896B]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-black text-[#43896B] mb-3 sm:mb-4">
                        {index.title}
                      </h2>
                      <p className="text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        {index.description}
                      </p>
                      <div className="prose prose-base sm:prose-lg max-w-none text-gray-700 leading-relaxed">
                        <p>{index.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}