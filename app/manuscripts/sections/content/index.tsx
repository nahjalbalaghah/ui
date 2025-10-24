'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Select from '@/app/components/select';
import ManuscriptViewer from '@/app/components/manuscript-viewer';
import ManuscriptMetadataDisplay from '@/app/components/manuscript-metadata';
import { manuscripts, getManuscriptOptions, getManuscriptById, ManuscriptMetadata } from '@/app/data/manuscripts';

const ManuscriptsContent = () => {
  const searchParams = useSearchParams();
  const manuscriptIdFromUrl = searchParams.get('id');
  
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<string>(
    manuscriptIdFromUrl || manuscripts[0].id
  );
  const [selectedManuscript, setSelectedManuscript] = useState<ManuscriptMetadata>(
    getManuscriptById(manuscriptIdFromUrl || manuscripts[0].id) || manuscripts[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const manuscriptOptions = getManuscriptOptions();

  useEffect(() => {
    if (manuscriptIdFromUrl && manuscriptIdFromUrl !== selectedManuscriptId) {
      setSelectedManuscriptId(manuscriptIdFromUrl);
    }
  }, [manuscriptIdFromUrl]);

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
    </div>
  );
};

export default ManuscriptsContent;
