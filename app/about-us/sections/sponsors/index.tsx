"use client";
import React from 'react'
import { Heart, ExternalLink } from 'lucide-react'

const SponsorsSection = () => {
  const sponsors = [
    {
      name: "Islamic Heritage Foundation",
      type: "Gold Sponsor",
      description: "Supporting Islamic education and cultural preservation worldwide.",
      logo: "/api/placeholder/120/60",
      website: "#"
    },
    {
      name: "Al-Azhar University",
      type: "Academic Partner",
      description: "Partnering in Islamic scholarship and research initiatives.",
      logo: "/api/placeholder/120/60",
      website: "#"
    },
    {
      name: "Muslim Community Center",
      type: "Community Sponsor",
      description: "Dedicated to community outreach and Islamic education programs.",
      logo: "/api/placeholder/120/60",
      website: "#"
    },
    {
      name: "Quranic Studies Institute",
      type: "Research Partner",
      description: "Collaborating on advanced Islamic research and publications.",
      logo: "/api/placeholder/120/60",
      website: "#"
    },
    {
      name: "Islamic Arts Foundation",
      type: "Cultural Partner",
      description: "Supporting the preservation of Islamic cultural heritage.",
      logo: "/api/placeholder/120/60",
      website: "#"
    },
    {
      name: "Global Islamic Network",
      type: "Media Partner",
      description: "Amplifying Islamic educational content worldwide.",
      logo: "/api/placeholder/120/60",
      website: "#"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-[#43896B]" />
            <h2 className="text-3xl lg:text-5xl font-black text-[#43896B]">
              Our Sponsors & Partners
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are grateful to our sponsors and partners who support our mission to preserve
            and share the wisdom of Nahj al-Balaghah with the global community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.name}
              className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-20 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-[#43896B]">{sponsor.name.split(' ')[0]}</span>
                </div>
                <span className="text-xs font-medium text-[#43896B] bg-[#43896B]/10 px-3 py-1 rounded-full">
                  {sponsor.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{sponsor.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{sponsor.description}</p>
              <a
                href={sponsor.website}
                className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#43896B]/80 font-medium text-sm transition-colors"
              >
                Visit Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
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