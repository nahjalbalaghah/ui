'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Modal from '@/app/components/modal';

interface ManuscriptImage {
  id: number;
  url: string;
  title: string;
  description: string;
}

interface ImageModalGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  images: ManuscriptImage[];
  initialImageIndex?: number;
}

export default function ImageModalGallery({ 
  isOpen, 
  onClose, 
  images, 
  initialImageIndex = 0 
}: ImageModalGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const nextImage = () => {
    setDirection(1);
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setDirection(-1);
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedImageIndex(initialImageIndex);
    }
  }, [isOpen, initialImageIndex]);

  const currentImage = images[selectedImageIndex];

  if (!isOpen || !currentImage) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && !isFullscreen && (
          <Modal
            isOpen={true}
            onClose={handleClose}
            title="Manuscripts"
          >
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="relative max-w-4xl mx-auto h-96 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.img
                      key={selectedImageIndex}
                      src={currentImage.url}
                      alt={currentImage.title}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 }
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                          nextImage();
                        } else if (swipe > swipeConfidenceThreshold) {
                          prevImage();
                        }
                      }}
                    />
                  </AnimatePresence>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white shadow-lg hover:shadow-xl text-gray-800 rounded-full transition-all duration-200 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white shadow-lg hover:shadow-xl text-gray-800 rounded-full transition-all duration-200 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 p-2 bg-white shadow-lg hover:shadow-xl text-gray-800 rounded-full transition-all duration-200 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <motion.div 
                className="p-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="max-w-4xl mx-auto">
                  <motion.div 
                    className="flex items-center justify-between mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.span 
                      className="text-sm text-gray-500"
                      key={`counter-${selectedImageIndex}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {selectedImageIndex + 1} of {images.length}
                    </motion.span>
                    <div className="flex gap-2">
                      {images.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            setDirection(index > selectedImageIndex ? 1 : -1);
                            setSelectedImageIndex(index);
                          }}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            index === selectedImageIndex ? 'bg-[#43896B]' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-end">
                <motion.button
                  onClick={toggleFullscreen}
                  className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              className="flex-1 flex items-center justify-center p-8 pt-20 pb-32"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={currentImage.url}
                    alt={currentImage.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);

                      if (swipe < -swipeConfidenceThreshold) {
                        nextImage();
                      } else if (swipe > swipeConfidenceThreshold) {
                        prevImage();
                      }
                    }}
                  />
                </AnimatePresence>
                <motion.button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm text-white p-6"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span 
                    className="text-sm text-gray-300"
                    key={`fs-counter-${selectedImageIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedImageIndex + 1} of {images.length}
                  </motion.span>
                  <div className="flex gap-2">
                    {images.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setDirection(index > selectedImageIndex ? 1 : -1);
                          setSelectedImageIndex(index);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                          index === selectedImageIndex ? 'bg-white' : 'bg-gray-500 hover:bg-gray-400'
                        }`}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.4 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}