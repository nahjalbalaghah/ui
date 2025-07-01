'use client';
import React, { useState } from 'react';
import ManuscriptDescription from './sections/description';
import ImageModalGallery from './sections/modal-gallery';
import { manuscriptData } from '@/app/data';
import { Eye } from 'lucide-react';
import Button from '@/app/components/button';

export default function ManuscriptDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageModal = (index: any) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true)
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className='w-full' >
            <ManuscriptDescription
              title={manuscriptData.title}
              subtitle={manuscriptData.subtitle}
              arabicText={manuscriptData.arabicText}
              urduTranslation={manuscriptData.urduTranslation}
              description={manuscriptData.fullDescription}
            />
           <div className='mt-5' > 
            <Button
              icon={<Eye className="w-4 h-4" />}
              onClick={() => openImageModal(0)}
              >
              View Manuscripts
            </Button>
           </div>
          </div>
        </div>
      </div>
      <ImageModalGallery
        isOpen={isModalOpen}
        onClose={closeModal}
        images={manuscriptData.images}
        initialImageIndex={selectedImageIndex}
      />
    </div>
  );
}