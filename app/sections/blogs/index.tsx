"use client";
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, MapPin, BookOpen, Users, Eye } from 'lucide-react'
import Image from 'next/image'
import Button from '@/app/components/button';

const BlogEventsSection = () => {
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

    const section = document.getElementById('blog-events-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const blogPosts = [
    {
      id: 1,
      title: "Is Islam Old Philosophy?",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format",
      date: "Jan 8, 2023",
      author: "Imam Ullah",
      description: "Islam is definitely accommodates olor sit amet, consectetur adipiscing eli...",
      category: "Philosophy",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Ulama Sermons with Audio",
      image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=300&fit=crop&auto=format",
      date: "Jan 5, 2023",
      author: "Imam Ullah",
      description: "Islam is definitely accommodates olor sit amet, consectetur adipiscing eli...",
      category: "Sermons",
      readTime: "15 min listen"
    }
  ]

  const events = [
    {
      id: 1,
      title: "World Scholars Meetup",
      date: "28",
      month: "Nov",
      location: "Park Lane, London",
      time: "9:30 am to 1:15 pm",
      attendees: 120,
      category: "Conference"
    },
    {
      id: 2,
      title: "Modern Islam Challenges",
      date: "24",
      month: "Dec",
      location: "Park Lane, London",
      time: "9:30 am to 1:15 pm",
      attendees: 85,
      category: "Discussion"
    },
    {
      id: 3,
      title: "Islamic Teachings",
      date: "25",
      month: "Dec",
      location: "Park Lane, London",
      time: "9:30 am to 1:15 pm",
      attendees: 150,
      category: "Education"
    }
  ]

  return (
    <section id="blog-events-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden relative">
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
              EVENT & BLOG
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Our <span className='text-gray-900'>Blog & Events</span>
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
            Stay informed with our latest insights and join our upcoming events to be part of 
            our growing community of knowledge seekers.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-[#43896B]" />
              Latest Blog Posts
            </h2>
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 + (index * 0.2) }}
                  whileHover={{ x: 10, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col lg:flex-row items-center"
                >
                  <div className="w-full lg:w-40 p-6 lg:px-0 pb-0 lg:pt-0 lg:pl-6 h-full flex-shrink-0">
                    <Image
                      src={post.image} 
                      alt={post.title}
                      width={100}
                      height={100}
                      className="w-full h-36 object-cover rounded-3xl"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-4 flex-wrap mb-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-[#43896B]" />
                        <span className="font-medium">{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-[#43896B]" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#43896B]" />
                        <span className="font-medium">{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-[#43896B] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="bg-[#43896B]/10 text-[#43896B] px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                      <button className="text-[#43896B] font-semibold text-sm hover:underline flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[#43896B]" />
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 + (index * 0.2) }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 flex items-center gap-6"
                >
                  <div className="text-center flex-shrink-0">
                    <div className="bg-gradient-to-br from-[#43896B] to-[#357a5b] text-white rounded-2xl p-4 shadow-lg">
                      <div className="text-3xl font-black">{event.date}</div>
                      <div className="text-sm font-semibold opacity-90">{event.month}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#43896B] transition-colors duration-300">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#43896B]" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#43896B]" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#43896B]" />
                        <span className="font-medium">{event.attendees} Attendees</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="bg-[#43896B]/10 text-[#43896B] px-3 py-1 rounded-full text-xs font-semibold">
                        {event.category}
                      </span>
                      <button className="text-[#43896B] font-semibold text-sm hover:underline">
                        Event Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mt-16 flex justify-center"
        >
          <Button icon={<BookOpen size={16} />} variant='solid' >
            Explore All Content & Events
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogEventsSection