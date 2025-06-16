"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Droplets, Zap, Settings, ArrowRight, Sparkles } from 'lucide-react'
import Input from '@/app/components/input'
import Button from '@/app/components/button'

const DonationSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [customAmount, setCustomAmount] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('donation-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const donationAmounts = [50, 100, 150, 200]
  
  const causes = [
    {
      icon: Users,
      text: "One Tube-well For African Village near Mesoori."
    },
    {
      icon: Droplets,
      text: "Filtration Plant For Drinking Water."
    },
    {
      icon: Zap,
      text: "Extraction & Sanitation Power Generator."
    },
    {
      icon: Settings,
      text: "Maintenance of Filtration Plants and Fixation."
    }
  ]

  const raised = 33000
  const goal = 50000
  const percentage = (raised / goal) * 100

  return (
    <section id="donation-section" className="py-24 bg-white to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Community helping"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#43896B] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#43896B]/90 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#43896B] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#43896B]/90 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
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
                <span className="text-[#43896B] font-bold text-lg tracking-wide">Help Our Cause</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl lg:text-5xl font-black text-gray-800 tracking-tight leading-tight"
              >
                Make Your <span className='text-[#43896B]' >Donation</span>
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
              className="space-y-4"
            >
              <div className="grid grid-cols-4 gap-3">
                {donationAmounts.map((amount, index) => (
                  <motion.button
                    key={amount}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 + (index * 0.1) }}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount('')
                    }}
                    className={`px-4 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                      selectedAmount === amount
                        ? 'bg-[#43896B] text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#43896B] hover:bg-[#43896B]/5'
                    }`}
                  >
                    ${amount}
                  </motion.button>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(0)
                  }}
                />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-3"
            >
              {causes.map((cause, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 + (index * 0.1) }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-[#43896B]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <cause.icon className="w-4 h-4 text-[#43896B]" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{cause.text}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-800">Educate Rural Kenya</h3>
                <span className="text-sm font-bold text-[#43896B] bg-[#43896B]/10 px-3 py-1 rounded-full">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isVisible ? { width: `${percentage}%` } : {}}
                  transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#43896B] to-[#3A7A5B] rounded-full shadow-sm"
                ></motion.div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-600">Raised: </span>
                  <span className="font-bold text-[#43896B]">${raised.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Goal: </span>
                  <span className="font-bold text-gray-800">${goal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button icon={<Heart size={16} />} variant='solid' >Donate Now</Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DonationSection