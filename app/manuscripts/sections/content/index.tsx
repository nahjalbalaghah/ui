'use client';
import React, { useState, useEffect } from 'react';
import Select from '@/app/components/select';
import ManuscriptViewer from '@/app/components/manuscript-viewer';
import ManuscriptMetadataDisplay from '@/app/components/manuscript-metadata';
import { manuscripts, getManuscriptOptions, getManuscriptById, ManuscriptMetadata } from '@/app/data/manuscripts';

const ManuscriptsContent = () => {
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>(manuscripts[0].id);
  const [selectedManuscript, setSelectedManuscript] = useState<ManuscriptMetadata>(manuscripts[0]);
  const [isLoading, setIsLoading] = useState(false);

  const manuscriptOptions = getManuscriptOptions();

  useEffect(() => {
    setIsLoading(true);
    const manuscript = getManuscriptById(selectedManuscriptId);
    if (manuscript) {
      setTimeout(() => {
        setSelectedManuscript(manuscript);
        setIsLoading(false);
      }, 300);
    }
  }, [selectedManuscriptId]);

  const handleManuscriptChange = (value: string) => {
    setSelectedManuscriptId(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label htmlFor="manuscript-select" className="text-lg font-semibold text-gray-800 flex-shrink-0">
              Select Manuscript:
            </label>
            <div className="flex-1 max-w-xl">
              <Select
                options={manuscriptOptions}
                value={selectedManuscriptId}
                onChange={handleManuscriptChange}
                placeholder="Choose a manuscript..."
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#E2E3E9]">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {selectedManuscript.bookName}
            </h2>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="font-semibold">Date:</span> {selectedManuscript.gregorianYear} CE
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="font-semibold">Location:</span> {selectedManuscript.city}, {selectedManuscript.country}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ManuscriptViewer
              pages={selectedManuscript.pages}
              bookName={selectedManuscript.bookName}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ManuscriptMetadataDisplay metadata={selectedManuscript} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 bg-gradient-to-br from-[#F5F6FA] to-white rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          About This Collection
        </h3>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="leading-relaxed mb-4">
            These manuscripts represent some of the most significant historical copies of Nahj al-Balagha, 
            preserved in prestigious libraries across the Islamic world. Each manuscript offers unique insights 
            into the transmission and preservation of Imam Ali's (AS) teachings throughout history.
          </p>
          <p className="leading-relaxed">
            The manuscripts featured here date from the 5th/11th century to the 7th/13th century, 
            showcasing various calligraphic styles, regional variations, and scholarly annotations that 
            have enriched our understanding of this timeless text.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptsContent;
