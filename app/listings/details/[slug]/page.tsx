'use client';
import React, { useState } from 'react';
import ManuscriptHeader from './sections/header';
import ManuscriptImageGallery from './sections/image-gallery';
import ManuscriptDescription from './sections/description';
import ManuscriptDetailsSidebar from './sections/sidebar';
import ImageModalGallery from './sections/modal-gallery';
import { manuscriptData } from '@/app/data';

export default function ManuscriptDetailsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageModal = (index: any) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    console.log('Download manuscript');
  };

  const handleShare = () => {
    console.log('Share manuscript');
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ManuscriptHeader
          manuscript={manuscriptData}
          onBack={handleBack}
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <ManuscriptImageGallery
              images={manuscriptData.images}
              onImageClick={openImageModal}
              onViewGallery={() => openImageModal(0)}
            />
            <ManuscriptDescription
              description={manuscriptData.fullDescription}
            />
          </div>
          <div className="lg:w-1/3">
            <ManuscriptDetailsSidebar
              details={{
                date: manuscriptData.date,
                location: manuscriptData.location,
                language: manuscriptData.language,
                folios: manuscriptData.folios,
                dimensions: manuscriptData.dimensions,
                script: manuscriptData.script,
                collection: manuscriptData.collection,
                project: manuscriptData.project
              }}
            />
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