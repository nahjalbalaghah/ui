'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star, Sparkles } from 'lucide-react'
import { testimonials } from '@/app/data'

const TestimonialSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('testimonial-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: any) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section id="testimonial-section" className="py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Sparkles className="w-6 h-6 text-[#43896B]" />
            <span className="text-[#43896B] font-bold text-lg tracking-wide">Some Good Words</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl lg:text-5xl font-black text-black tracking-tight leading-tight mb-4"
          >
            Clients <span className='text-[#43896B]'>Testimonial</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: "120px" } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-[#43896B] rounded-full mx-auto"
          ></motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative h-80 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 max-w-4xl w-full mx-4 relative">
                  <div className="absolute -top-4 left-8">
                    <div className="w-12 h-12 bg-[#43896B] rounded-full flex items-center justify-center shadow-lg">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex gap-1">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#43896B] text-[#43896B]" />
                        ))}
                      </div>
                      <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed italic">
                        "{testimonials[currentIndex].content}"
                      </blockquote>
                    </div>
                    <div className="flex lg:flex-col items-center lg:items-center gap-4 lg:gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-[#43896B]/20 shadow-lg">
                          <img
                            src={testimonials[currentIndex].image}
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#43896B] rounded-full flex items-center justify-center shadow-lg">
                          <Quote className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="text-center lg:text-center">
                        <h4 className="font-bold text-xl text-gray-800">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-[#43896B] font-medium">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 flex items-center justify-center text-[#43896B] hover:bg-[#43896B] hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 flex items-center justify-center text-[#43896B] hover:bg-[#43896B] hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#43896B] shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-[#43896B] rounded-full"
                style={{ display: isAutoPlaying ? 'block' : 'none' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialSection