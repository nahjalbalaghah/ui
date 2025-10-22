'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Download } from 'lucide-react'
import Link from 'next/link'
import Button from '@/app/components/button'

const AboutNahjSection = () => {
  return (
    <section id="about-nahj-section" className="py-24 bg-gradient-to-br from-[#43896B]/5 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#43896B]/10 overflow-hidden"
        >
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-8 h-8 text-[#43896B]" />
                  <h2 className="text-3xl lg:text-4xl font-black text-[#43896B] tracking-tight">
                    About Nahj al-Balaghah
                  </h2>
                </div>
                <div className="h-1 bg-[#43896B] rounded-full w-24 mb-6"></div>
              </div>
              <Link 
                href="/pdfs/TQ-Introduction-to-Nahj-al-Balaghah.pdf" 
                target="_blank"
                className="flex-shrink-0 ml-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant='outlined' icon={<Download size={20} />}>
                    Download PDF
                  </Button>
                </motion.div>
              </Link>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                <strong>Nahj al-Balaghah</strong> (نَهْجُ البَلَاغَة, "The Peak of Eloquence") is a collection of sermons, letters, and sayings attributed to Imam Ali ibn Abi Talib (AS), the cousin and son-in-law of Prophet Muhammad (PBUH), and the fourth caliph in Sunni Islam and the first Imam in Shia Islam.
              </p>
              <p>
                Compiled in the 10th century CE by Sharif al-Radi, a renowned Shia scholar, this work is celebrated as one of the most significant pieces of Arabic literature and Islamic thought. It addresses themes of governance, justice, spirituality, ethics, and human nature with profound eloquence and wisdom.
              </p>
              <div className="bg-gradient-to-r from-[#43896B]/10 to-transparent p-6 rounded-xl my-8 border border-[#43896B]/20">
                <h3 className="text-xl font-bold text-[#43896B] mb-3">Key Themes</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Divine Unity and Faith:</strong> Reflections on the nature of God, creation, and the purpose of life</li>
                  <li><strong>Justice and Governance:</strong> Principles of just leadership and ethical administration</li>
                  <li><strong>Morality and Ethics:</strong> Guidance on virtue, patience, humility, and piety</li>
                  <li><strong>Knowledge and Wisdom:</strong> The value of learning, contemplation, and spiritual growth</li>
                  <li><strong>Social Responsibility:</strong> The importance of compassion, charity, and community welfare</li>
                </ul>
              </div>
              <p>
                The text is divided into three main sections: <strong>Khutab</strong> (Sermons/Orations), <strong>Maktubat</strong> (Letters), and <strong>Hikam</strong> (Short Sayings). Each section offers unique insights into Imam Ali's teachings and his approach to leadership, spirituality, and daily life.
              </p>
              <p>
                Nahj al-Balaghah has been studied by scholars across the Islamic world and beyond, transcending sectarian boundaries. Its eloquent Arabic prose is considered a masterpiece of classical literature, second only to the Quran in linguistic beauty and depth.
              </p>
              <div className="bg-gradient-to-r from-[#43896B]/10 to-transparent p-6 rounded-xl my-8 border border-[#43896B]/20">
                <h3 className="text-xl font-bold text-[#43896B] mb-3">Historical Significance</h3>
                <p className="text-gray-700 mb-0">
                  Throughout history, Nahj al-Balaghah has influenced Islamic jurisprudence, philosophy, mysticism, and political thought. It serves as a guide for Muslims seeking to understand the principles of righteous living, just governance, and spiritual enlightenment. Commentaries on this work have been written by scholars from various schools of thought, demonstrating its universal appeal and enduring relevance.
                </p>
              </div>
              <p className="text-lg font-semibold mb-0">
                This digital platform provides easy access to the complete text, enabling readers to explore, search, and reflect upon the timeless wisdom contained within Nahj al-Balaghah.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutNahjSection
