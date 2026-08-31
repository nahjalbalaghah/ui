"use client";
import React from 'react'
import { User } from 'lucide-react'

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Professor Tahera Qutbuddin",
      role: "Project Principal",
      bio: "AlBabtain Laudian Professor of Arabic, University of Oxford; editor and translator of Nahj al-Balāghah: The Eloquence and Wisdom of ʿAlī (Brill, 2024)."
    },
    {
      name: "Syed Kazim Hussain",
      role: "Web Developer",
      bio: "Graduate of the Islamic Seminary of Qum (2020) and independent software development consultant."
    },
    {
      name: "Reza Hemyari",
      role: "Research Manager",
      bio: "Ph.D. candidate, Department of Middle Eastern Studies, University of Chicago."
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
            Meet the dedicated scholars and professionals who work to preserve and share
            the wisdom of Nahj al-Balāghah with the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="w-24 h-24 bg-[#43896B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-[#43896B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-[#43896B] font-bold mb-4">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection