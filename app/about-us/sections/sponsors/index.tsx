"use client";
import React from 'react'
import { Heart, ExternalLink } from 'lucide-react'

const SponsorsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h2 className="text-3xl lg:text-5xl font-black text-[#43896B]">
              Our Sponsor
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are grateful to our sponsor, whose support helps us preserve and share
            the wisdom of Nahj al-Balāghah with the global community.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-[#43896B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#43896B]" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Shia Research Institute, Toronto</h3>
            <a
              href="https://shiaresearch.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#43896B]/80 font-medium text-sm transition-colors"
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-[#43896B]/5 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#43896B] mb-4">
              Become a Sponsor
            </h3>
            <p className="text-gray-600 mb-6">
              Support our mission to preserve Islamic heritage and make Nahj al-Balaghah accessible
              to seekers of knowledge worldwide. Your partnership helps us continue this important work.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#43896B] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#43896B]/90 transition-colors"
            >
              Contact Us
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SponsorsSection