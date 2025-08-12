'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, Heart, Award, Sparkles, Globe, Target, TrendingUp, Shield } from 'lucide-react'
import Button from '@/app/components/button'
import Image from 'next/image'
import AboutImage from '@/app/assets/images/about.svg'

const ImpactCommunitySection = () => {
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

    const section = document.getElementById('impact-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving students and scholars across 45+ countries worldwide"
    },
    {
      icon: Target,
      title: "Focused Mission",
      description: "Dedicated to authentic Islamic education and spiritual growth"
    },
    {
      icon: TrendingUp,
      title: "Growing Impact",
      description: "Continuously expanding our educational programs and resources"
    },
    {
      icon: Shield,
      title: "Trusted Source",
      description: "Recognized authority in Islamic scholarship and teachings"
    }
  ]

  return (
    <section id="impact-section" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <Sparkles className="w-6 h-6 text-[#43896B]" />
                <span className="text-[#43896B] font-bold text-lg tracking-wide">Making a Difference</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight"
              >
                Our <span className='text-[#43896B]'>Impact & Community</span>
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={isVisible ? { width: "120px" } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-1 bg-[#43896B] rounded-full"
              ></motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                Since our founding, we have built a <span className="font-semibold text-[#43896B]">thriving global community</span> of learners, scholars, and spiritual seekers. Our educational programs and resources have touched the lives of thousands across continents, fostering understanding and spiritual growth.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Through innovative online platforms, traditional scholarship programs, and community outreach initiatives, we continue to bridge the gap between ancient wisdom and modern learning, creating lasting impact in communities worldwide.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl hover:bg-white/80 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#43896B]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-5 h-5 text-[#43896B]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              <div className="relative">
                <Image
                  src={AboutImage}
                  alt="Our Community Impact"
                  className="w-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute top-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#43896B] rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">10K+</div>
                      <div className="text-sm text-gray-600">Active Students</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#43896B] rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">45+</div>
                      <div className="text-sm text-gray-600">Countries</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ImpactCommunitySection