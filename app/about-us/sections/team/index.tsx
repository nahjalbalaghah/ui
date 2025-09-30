"use client";
import React from 'react'
import { User, Mail, Linkedin } from 'lucide-react'

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Dr. Ahmed Hassan",
      role: "Founder & Director",
      bio: "PhD in Islamic Studies with over 20 years of experience in Islamic scholarship and education.",
      image: "/api/placeholder/150/150",
      email: "ahmed.hassan@example.com",
      linkedin: "#"
    },
    {
      name: "Dr. Fatima Al-Zahra",
      role: "Chief Scholar",
      bio: "Expert in Nahj al-Balaghah studies with numerous publications on Islamic philosophy and theology.",
      image: "/api/placeholder/150/150",
      email: "fatima.alzahra@example.com",
      linkedin: "#"
    },
    {
      name: "Dr. Omar Ibn Khattab",
      role: "Research Director",
      bio: "Specializes in Islamic manuscripts and historical texts, leading our research initiatives.",
      image: "/api/placeholder/150/150",
      email: "omar.khattab@example.com",
      linkedin: "#"
    },
    {
      name: "Dr. Aisha Bint Abu Bakr",
      role: "Education Coordinator",
      bio: "Dedicated to making Islamic education accessible through innovative teaching methods.",
      image: "/api/placeholder/150/150",
      email: "aisha.bakr@example.com",
      linkedin: "#"
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-[#43896B] mb-6">
            Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated scholars and professionals who work tirelessly to preserve and share
            the wisdom of Nahj al-Balaghah with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="w-24 h-24 bg-[#43896B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-[#43896B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-[#43896B] font-medium mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
              <div className="flex justify-center gap-3">
                <a
                  href={`mailto:${member.email}`}
                  className="w-8 h-8 bg-[#43896B]/10 rounded-full flex items-center justify-center hover:bg-[#43896B] hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={member.linkedin}
                  className="w-8 h-8 bg-[#43896B]/10 rounded-full flex items-center justify-center hover:bg-[#43896B] hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection