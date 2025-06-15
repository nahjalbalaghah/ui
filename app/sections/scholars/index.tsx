"use client";
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Twitter, Facebook, Linkedin, Youtube, Heart } from 'lucide-react'
import Button from '@/app/components/button';

const IslamicScholarsSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('scholars-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const scholars = [
    {
      id: 1,
      name: "Bilal Hatim",
      title: "Founder & COO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
      socialLinks: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        youtube: "#"
      }
    },
    {
      id: 2,
      name: "Ali Hammam",
      title: "Islamic Scholar",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
      socialLinks: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        youtube: "#"
      }
    },
    {
      id: 3,
      name: "Nasira Sheikh",
      title: "Volunteer",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format",
      socialLinks: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        youtube: "#"
      }
    }
  ]

  return (
    <section id="scholars-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 left-20 w-64 h-64 rounded-full bg-[#43896B]"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-[#43896B]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-[#43896B]" />
            <span className="text-[#43896B] font-semibold text-sm tracking-wide">
              MEET THE EXPERTS
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Islamic <span className='text-gray-900'>Scholars</span>
          </h1>
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible ? { width: "200px" } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="relative"
            >
              <div className="h-1 rounded-full bg-[#43896B]"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#43896B]"></div>
              <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#43896B]"></div>
              <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#43896B]"></div>
            </motion.div>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Meet our dedicated team of Islamic scholars and experts who guide our mission 
            with their profound knowledge and unwavering commitment to serving humanity.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {scholars.map((scholar, index) => (
            <motion.div
              key={scholar.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 + (index * 0.2) }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
                  <img 
                    src={scholar.image} 
                    alt={scholar.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="p-8 text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#43896B] transition-colors duration-300">
                    {scholar.name}
                  </h3>
                  <div className="flex justify-center mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: "60px" } : {}}
                      transition={{ duration: 1, delay: 1 + (index * 0.2) }}
                      className="h-0.5 bg-[#43896B] rounded-full"
                    />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">
                    {scholar.title}
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <motion.a
                    href={scholar.socialLinks.twitter}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-100 hover:bg-[#43896B] rounded-full flex items-center justify-center transition-all duration-300 group/social"
                  >
                    <Twitter className="w-4 h-4 text-gray-600 group-hover/social:text-white transition-colors duration-300" />
                  </motion.a>
                  <motion.a
                    href={scholar.socialLinks.facebook}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-100 hover:bg-[#43896B] rounded-full flex items-center justify-center transition-all duration-300 group/social"
                  >
                    <Facebook className="w-4 h-4 text-gray-600 group-hover/social:text-white transition-colors duration-300" />
                  </motion.a>
                  <motion.a
                    href={scholar.socialLinks.linkedin}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-100 hover:bg-[#43896B] rounded-full flex items-center justify-center transition-all duration-300 group/social"
                  >
                    <Linkedin className="w-4 h-4 text-gray-600 group-hover/social:text-white transition-colors duration-300" />
                  </motion.a>
                  <motion.a
                    href={scholar.socialLinks.youtube}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-100 hover:bg-[#43896B] rounded-full flex items-center justify-center transition-all duration-300 group/social"
                  >
                    <Youtube className="w-4 h-4 text-gray-600 group-hover/social:text-white transition-colors duration-300" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex justify-center'
          >
            <Button variant='solid' icon={<Heart size={16} />} >Meet All Our Scholars</Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default IslamicScholarsSection