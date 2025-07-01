"use client";
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Heart, BookOpen, Home, Users } from 'lucide-react'
import Image from 'next/image';
import Button from '@/app/components/button';

const CausesSection = () => {
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

    const section = document.getElementById('causes-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const causes = [
    {
      id: 1,
      title: "Educate Rural Kenya",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop&auto=format",
      daysLeft: 193,
      organizer: "Imam Ullah",
      description: "Islam is definitely accommodates olor sit amet, consectetur adipiscing eli...",
      raised: 33000,
      goal: 50000,
      percentage: 66,
      icon: BookOpen
    },
    {
      id: 2,
      title: "Houses For Homeless",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop&auto=format",
      daysLeft: 195,
      organizer: "Imam Ullah",
      description: "Islam is definitely accommodates olor sit amet, consectetur adipiscing eli...",
      raised: 25000,
      goal: 50000,
      percentage: 50,
      icon: Home
    },
    {
      id: 3,
      title: "Give Shelter Homes",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop&auto=format",
      daysLeft: 193,
      organizer: "Imam Ullah",
      description: "Islam is definitely accommodates olor sit amet, consectetur adipiscing eli...",
      raised: 30000,
      goal: 60000,
      percentage: 50,
      icon: Users
    }
  ]

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <section id="causes-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden relative">
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
            <Heart className="w-5 h-5 text-[#43896B]" />
            <span className="text-[#43896B] font-semibold text-sm tracking-wide">
              NEED HELP FOR
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Our <span className='text-gray-900'>Causes</span>
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
            Join hands with us to accomplish all these projects of serving humanity and 
            making this world a better place to live.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {causes.map((cause, index) => {
            const IconComponent = cause.icon
            return (
              <motion.div
                key={cause.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + (index * 0.2) }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <Image src={cause.image} width={100} height={100} alt={cause.title} className='object-cover w-full' />
                <div className="relativebg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-bold text-gray-800">{cause.percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#43896B] transition-colors duration-300">
                    {cause.title}
                  </h3>
                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#43896B]" />
                      <span className="font-medium">{cause.daysLeft} Days Left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#43896B]" />
                      <span className="font-medium">{cause.organizer}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {cause.description}
                  </p>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-[#43896B]">{cause.percentage}%</span>
                    </div>
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isVisible ? { width: `${cause.percentage}%` } : {}}
                        transition={{ duration: 1.5, delay: 1 + (index * 0.2) }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#43896B] to-[#357a5b] rounded-full"
                      />
                      <div className="absolute top-1/2 transform -translate-y-1/2 right-2">
                        <div 
                          className="w-6 h-6 bg-[#43896B] rounded-full shadow-lg flex items-center justify-center"
                          style={{ 
                            right: `${100 - cause.percentage - 2}%`,
                            position: 'absolute'
                          }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Raised:</div>
                      <div className="text-xl font-black text-[#43896B]">
                        {formatCurrency(cause.raised)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Goal:</div>
                      <div className="text-xl font-black text-gray-400">
                        {formatCurrency(cause.goal)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mt-16 flex justify-center"
        >
          <Button icon={<Heart size={16} />}  variant='solid'>View All Causes And Make A Difference</Button>
        </motion.div>
      </div>
    </section>
  )
}

export default CausesSection