"use client";
import React, { useState, useEffect } from 'react'
import { BookOpen, Star, Heart, ChevronRight } from 'lucide-react'
import Button from '@/app/components/button';

const AboutUsHero = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const values = [
    {
      icon: BookOpen,
      title: "Academic Rigor",
      description: "Grounded in scholarship, ensuring texts, translations, and analyses meet the highest academic standards"
    },
    {
      icon: Heart,
      title: "Broad & Inclusive",
      description: "Serving academics, researchers, students, and people of faith who wish to engage with Imam Ali's wisdom"
    },
    {
      icon: Star,
      title: "A Growing Hub",
      description: "Hosting texts, translations, manuscripts, audio recordings, and research for academic and public engagement"
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMjUgMTVIMTVMMjAgNVoiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iY3VycmVudENvbG9yIi8+CjwvcGF0aD4KPC9zdmc+')] bg-repeat"></div>
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex-grow flex items-center justify-center py-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <div className="space-y-4 sm:space-y-6 mb-8">
                <h1 className="text-4xl lg:text-6xl font-black leading-tight text-[#43896B] break-words text-balance tracking-tight">
                  About Nahjalbalaghah.org
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-3xl mx-auto">
                  An open-access digital platform for the study of Nahj al-Balāghah
                </p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
                  <h2 className="text-2xl font-bold text-[#43896B] mb-6">Who We Are</h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      <strong className="font-bold text-gray-800">Nahjalbalaghah.org</strong> is a non-profit
                      digital humanities project dedicated to making Nahj al-Balāghah—the celebrated
                      collection of sermons, letters, and sayings attributed to{" "}
                      <strong className="font-bold text-gray-800">Imam Ali ibn Abi Talib (d. 661)</strong>
                      —accessible to readers, students, and scholars around the world.
                    </p>
                    <p className="leading-relaxed">
                      Compiled by <strong className="font-bold text-gray-800">al-Sharif al-Radi (d. 1015)</strong>,
                      Nahj al-Balāghah is revered for its eloquence, depth of thought, and enduring influence
                      on Islamic philosophy, theology, literature, and ethics. Despite its global significance,
                      reliable English-language resources on the text have long been limited. This project
                      seeks to bridge that gap.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#43896B] text-center lg:text-left mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed text-center lg:text-left mb-4">
                  Our mission is to provide an open-access, English-language digital platform for the
                  study and appreciation of Nahj al-Balāghah—combining scholarship, technology, and
                  accessibility.
                </p>
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#43896B] rounded-xl flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsHero