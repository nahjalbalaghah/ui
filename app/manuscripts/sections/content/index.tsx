'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Select from '@/app/components/select';
import ManuscriptViewer from '@/app/components/manuscript-viewer';
import ManuscriptMetadataDisplay from '@/app/components/manuscript-metadata';
import { manuscriptsApi, Manuscript, getManuscriptImageUrl } from '@/api/manuscripts';
import { Loader2 } from 'lucide-react';

const ManuscriptsContent = () => {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section');
  
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let response;
        if (sectionFromUrl) {
          response = await manuscriptsApi.getManuscriptsBySection(sectionFromUrl);
        } else {
          // Fetch all manscripts
          response = await manuscriptsApi.getAllManuscripts(1, 100);
        }
        
        if (response.data && response.data.length > 0) {
          setManuscripts(response.data);
          setSelectedManuscript(response.data[0]);
        } else {
          setError('No manuscripts found.');
        }
      } catch (err) {
        console.error('Error fetching manuscripts:', err);
        setError('Failed to load manuscripts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManuscripts();
  }, [sectionFromUrl]);

  const handleManuscriptChange = (value: string) => {
    const manuscript = manuscripts.find(m => m.documentId === value);
    if (manuscript) {
      setSelectedManuscript(manuscript);
    }
  };

  const manuscriptOptions = manuscripts.map(m => ({
    value: m.documentId,
    label: m.bookName || `Manuscript - Section ${m.section}`
  }));

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#43896B] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading manuscripts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            {sectionFromUrl && (
              <p className="text-gray-500 text-sm">
                No manuscripts found for section {sectionFromUrl}.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedManuscript) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">No manuscript selected</p>
        </div>
      </div>
    );
  }

  // Convert manuscript files to pages format
  const manuscriptPages = selectedManuscript.files?.map(file => getManuscriptImageUrl(file.url)) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {sectionFromUrl && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <span className="font-semibold">Viewing manuscripts for section:</span> {sectionFromUrl}
            </p>
          </div>
        </div>
      )}
      
      {manuscripts.length > 1 && (
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label htmlFor="manuscript-select" className="text-lg font-semibold text-gray-800 flex-shrink-0">
                Select Manuscript:
              </label>
              <div className="flex-1 max-w-xl">
                <Select
                  options={manuscriptOptions}
                  value={selectedManuscript.documentId}
                  onChange={handleManuscriptChange}
                  placeholder="Choose a manuscript..."
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {selectedManuscript.bookName || `Manuscript - Section ${selectedManuscript.section}`}
          </h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
            {selectedManuscript.gregorianYear && (
              <>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Date:</span> {selectedManuscript.gregorianYear} CE
                </span>
                <span>•</span>
              </>
            )}
            {selectedManuscript.city && selectedManuscript.country && (
              <span className="flex items-center gap-1">
                <span className="font-semibold">Location:</span> {selectedManuscript.city}, {selectedManuscript.country}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {manuscriptPages.length > 0 ? (
            <ManuscriptViewer
              pages={manuscriptPages}
              bookName={selectedManuscript.bookName || ''}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No images available for this manuscript.</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Manuscript Details</h3>
              <div className="space-y-3 text-sm">
                {selectedManuscript.section && (
                  <div>
                    <span className="font-semibold text-gray-700">Section:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.section}</span>
                  </div>
                )}
                {selectedManuscript.bookName && (
                  <div>
                    <span className="font-semibold text-gray-700">Book Name:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.bookName}</span>
                  </div>
                )}
                {selectedManuscript.siglaEnglish && (
                  <div>
                    <span className="font-semibold text-gray-700">Sigla (English):</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.siglaEnglish}</span>
                  </div>
                )}
                {selectedManuscript.siglaArabic && (
                  <div>
                    <span className="font-semibold text-gray-700">Sigla (Arabic):</span>
                    <span className="ml-2 text-gray-600 font-taha" dir="rtl">{selectedManuscript.siglaArabic}</span>
                  </div>
                )}
                {selectedManuscript.hijriYear && (
                  <div>
                    <span className="font-semibold text-gray-700">Hijri Year:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.hijriYear}</span>
                  </div>
                )}
                {selectedManuscript.gregorianYear && (
                  <div>
                    <span className="font-semibold text-gray-700">Gregorian Year:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.gregorianYear}</span>
                  </div>
                )}
                {selectedManuscript.holdingInstitution && (
                  <div>
                    <span className="font-semibold text-gray-700">Institution:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.holdingInstitution}</span>
                  </div>
                )}
                {selectedManuscript.country && (
                  <div>
                    <span className="font-semibold text-gray-700">Country:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.country}</span>
                  </div>
                )}
                {selectedManuscript.city && (
                  <div>
                    <span className="font-semibold text-gray-700">City:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.city}</span>
                  </div>
                )}
                {selectedManuscript.catalogNumber && (
                  <div>
                    <span className="font-semibold text-gray-700">Catalog Number:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.catalogNumber}</span>
                  </div>
                )}
                {selectedManuscript.specialMerit && (
                  <div>
                    <span className="font-semibold text-gray-700">Special Merit:</span>
                    <p className="mt-1 text-gray-600">{selectedManuscript.specialMerit}</p>
                  </div>
                )}
                {selectedManuscript.rights && (
                  <div>
                    <span className="font-semibold text-gray-700">Rights:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.rights}</span>
                  </div>
                )}
                {selectedManuscript.binding && (
                  <div>
                    <span className="font-semibold text-gray-700">Binding:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.binding}</span>
                  </div>
                )}
                {selectedManuscript.acknowledgments && (
                  <div>
                    <span className="font-semibold text-gray-700">Acknowledgments:</span>
                    <p className="mt-1 text-gray-600">{selectedManuscript.acknowledgments}</p>
                  </div>
                )}
                {selectedManuscript.accessRestriction && (
                  <div>
                    <span className="font-semibold text-gray-700">Access:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.accessRestriction}</span>
                  </div>
                )}
                {selectedManuscript.repository && (
                  <div>
                    <span className="font-semibold text-gray-700">Repository:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.repository}</span>
                  </div>
                )}
                {selectedManuscript.partLocation && (
                  <div>
                    <span className="font-semibold text-gray-700">Part Location:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.partLocation}</span>
                  </div>
                )}
                {selectedManuscript.cityOfOrigin && (
                  <div>
                    <span className="font-semibold text-gray-700">City of Origin:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.cityOfOrigin}</span>
                  </div>
                )}
                {selectedManuscript.countryOfOrigin && (
                  <div>
                    <span className="font-semibold text-gray-700">Country of Origin:</span>
                    <span className="ml-2 text-gray-600">{selectedManuscript.countryOfOrigin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptsContent;
