"use client";
import React from 'react'
import { BookOpen, Mic, ScrollText, Library, Clock } from 'lucide-react'

const OfferingsSection = () => {
  const offerings = [
    {
      icon: BookOpen,
      title: "Text & Translation",
      description: <>A searchable version of Nahj al-Balāghah in the original Arabic and in translation, built on Dr. Tahera Qutbuddin&rsquo;s critical edition and translation (Brill, 2024)—the first direct English rendering from Arabic. The site also includes critical Arabic editions by Qutbuddin (2025), Qays al-Attar (2025), and Hashim Milani (2010), plus a fully vocalized version of the Qutbuddin edition.</>
    },
    {
      icon: Mic,
      title: "Recitations",
      description: <>Professionally produced recitations of the entire Arabic text and its English translation, bringing the orations and letters to life as the spoken masterpieces they were composed to be.</>
    },
    {
      icon: ScrollText,
      title: "Digitized Manuscripts",
      description: <>High-resolution images of <strong className="font-bold text-gray-800">the earliest manuscripts</strong> of Nahj al-Balāghah, including 14 used in Professor Qutbuddin&rsquo;s critical edition, held in libraries across India, Iran, Iraq, Turkey, and Ireland.</>
    },
    {
      icon: Library,
      title: "Scholarly Resources",
      description: <>Indices, a glossary, an introduction, and notes on the edition and translation, alongside a growing database of medieval and modern commentaries, bibliographical entries, and open-access research in English, Arabic, Persian, Urdu, and other languages.</>
    },
    {
      icon: Clock,
      title: "Timeline",
      description: <>A reconstructed timeline of the orations, letters, and sayings of Nahj al-Balāghah, drawn from historical and literary sources, providing context for the text where such evidence is available.</>
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-[#43896B] mb-6">
            What We Offer
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A growing, open-access hub of texts, recitations, manuscripts, and research on Nahj al-Balāghah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((offering) => (
            <div
              key={offering.title}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#43896B]/10 rounded-xl flex items-center justify-center mb-4">
                <offering.icon className="w-6 h-6 text-[#43896B]" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{offering.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{offering.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-[#43896B]/5 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#43896B] mb-4">
              Our Ongoing Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We envision Nahjalbalaghah.org as a <strong className="font-bold text-gray-800">living digital
              archive</strong>—a comprehensive, continually expanding resource that connects tradition and
              technology. By combining scholarly rigor with open access, we aim to make the wisdom of Imam
              Ali available to all who seek knowledge, reflection, and eloquence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OfferingsSection
