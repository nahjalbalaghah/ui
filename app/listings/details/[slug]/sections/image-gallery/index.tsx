'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Eye } from 'lucide-react';
import Button from '@/app/components/button';

interface ManuscriptImage {
  id: number;
  url: string;
  title: string;
  description: string;
}

interface ManuscriptImageGalleryProps {
  images: ManuscriptImage[];
  onImageClick: (index: number) => void;
  onViewGallery: () => void;
}

export default function ManuscriptImageGallery({ 
  images, 
  onImageClick, 
  onViewGallery 
}: ManuscriptImageGalleryProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div 
        className="flex items-center justify-between mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h3 
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Manuscript Images
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            icon={<Eye className="w-4 h-4" />}
            onClick={onViewGallery}
          >
            View Gallery
          </Button>
        </motion.div>
      </motion.div>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            variants={itemVariants}
            className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-100"
            onClick={() => onImageClick(index)}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
          >
            <motion.img
              src={image.url}
              alt={image.title}
              className="w-full h-48 object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            />
            <motion.div 
              className="absolute inset-0 bg-black flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ 
                opacity: 0.4,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.2, delay: 0.1 }
                }}
              >
                <Eye className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, delay: index * 0.1 + 0.3 }
              }}
            >
              <motion.p 
                className="text-white text-sm font-medium truncate"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { duration: 0.4, delay: index * 0.1 + 0.5 }
                }}
              >
                {image.title}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}