'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Select from '@/app/components/select';
import ManuscriptViewer from '@/app/components/manuscript-viewer';
import ManuscriptMetadataDisplay from '@/app/components/manuscript-metadata';
import { 
  manuscriptsApi, 
  Manuscript, 
  getManuscriptImageUrl,
  librariesApi,
  Library,
  convertLibraryItemToManuscriptDetails
} from '@/api/manuscripts';
import { STATIC_MANUSCRIPTS } from '@/data/static-manuscripts';
import { Loader2 } from 'lucide-react';

const ManuscriptsContent = () => {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section');

  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch libraries (manuscript collections) from API
        const librariesResponse = await librariesApi.getAllLibraries(1, 100);
        if (librariesResponse.data && librariesResponse.data.length > 0) {
          setLibraries(librariesResponse.data);
          // Select first library with items, or first library
          const libraryWithItems = librariesResponse.data.find(l => l.library_items.length > 0);
          setSelectedLibrary(libraryWithItems || librariesResponse.data[0]);
        }

        // Fetch manuscripts (section-based images)
        let response;
        if (sectionFromUrl) {
          response = await manuscriptsApi.getManuscriptsBySection(sectionFromUrl);
        } else {
          response = await manuscriptsApi.getAllManuscripts(1, 100);
        }

        if (response.data && response.data.length > 0) {
          setManuscripts(response.data);
          setSelectedManuscript(response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load manuscripts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sectionFromUrl]);

  // Handle library selection change
  const handleLibraryChange = (value: string) => {
    const library = libraries.find(l => l.documentId === value);
    if (library) {
      setSelectedLibrary(library);
    }
  };

  // Handle manuscript/section selection change
  const handleManuscriptChange = (value: string) => {
    const manuscript = manuscripts.find(m => m.documentId === value);
    if (manuscript) {
      setSelectedManuscript(manuscript);
    }
  };

  // Create library options from API data
  const libraryOptions = libraries.map(lib => ({
    value: lib.documentId,
    label: lib.name
  }));

  // Create manuscript options (sections)
  const manuscriptOptions = manuscripts.map(m => ({
    value: m.documentId,
    label: `Section ${m.section}`
  }));

  // Get current library details (either from API or fallback to static)
  const getCurrentLibraryDetails = () => {
    if (selectedLibrary && selectedLibrary.library_items.length > 0) {
      return convertLibraryItemToManuscriptDetails(selectedLibrary);
    }
    // Fallback to static data based on selected library name
    if (selectedLibrary?.name?.toLowerCase().includes("mar'ashi") || 
        selectedLibrary?.name?.toLowerCase().includes("marashi")) {
      return STATIC_MANUSCRIPTS.marashi;
    }
    if (selectedLibrary?.name?.toLowerCase().includes('shahrastan')) {
      return STATIC_MANUSCRIPTS.shahrastani;
    }
    // Default fallback for libraries without items
    return selectedLibrary ? {
      id: selectedLibrary.documentId,
      name: selectedLibrary.name,
      siglaEnglish: '',
      siglaArabic: '',
      library: '',
      city: '',
      country: '',
      date: '',
      catalogNumber: '',
      completeness: '',
      scribe: '',
      dimensions: '',
      originCity: '',
      features: '',
      permanentLink: '',
      orationSequence: '',
      format: '',
      additionalInfo: '',
    } : STATIC_MANUSCRIPTS.marashi;
  };

  const currentLibraryDetails = getCurrentLibraryDetails();

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

      {(manuscripts.length > 0 || libraries.length > 0) && (
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-lg font-semibold text-gray-800 shrink-0">
                Select:
              </label>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {libraries.length > 0 && (
                  <div className="w-full">
                    <label htmlFor="library-select" className="sr-only">Select Library</label>
                    <Select
                      options={libraryOptions}
                      value={selectedLibrary?.documentId || ''}
                      onChange={handleLibraryChange}
                      placeholder="Select a Library..."
                      className="w-full"
                    />
                  </div>
                )}
                {manuscripts.length > 0 && (
                  <div className="w-full">
                    <label htmlFor="manuscript-select" className="sr-only">Select Section</label>
                    <Select
                      options={manuscriptOptions}
                      value={selectedManuscript?.documentId || ''}
                    onChange={handleManuscriptChange}
                    placeholder="Select a Section..."
                    className="w-full"
                  />
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {`${currentLibraryDetails.name}${selectedManuscript?.section ? ` - Section ${selectedManuscript.section}` : sectionFromUrl ? ` - Section ${sectionFromUrl}` : ''}`}
          </h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
            {(selectedManuscript?.gregorianYear || currentLibraryDetails.date) && (
              <>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Date:</span> {selectedManuscript?.gregorianYear || currentLibraryDetails.date}
                </span>
                <span>•</span>
              </>
            )}
            {(selectedManuscript?.city || currentLibraryDetails.city) && (selectedManuscript?.country || currentLibraryDetails.country) && (
              <span className="flex items-center gap-1">
                <span className="font-semibold">Location:</span> {selectedManuscript?.city || currentLibraryDetails.city}, {selectedManuscript?.country || currentLibraryDetails.country}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedManuscript && manuscriptPages.length > 0 ? (
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

              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-500">Current Library:</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                  {currentLibraryDetails.name}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                {(currentLibraryDetails.siglaEnglish || currentLibraryDetails.siglaArabic) && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Sigla</span>
                    <div className="flex gap-4">
                      {currentLibraryDetails.siglaEnglish && <span>{currentLibraryDetails.siglaEnglish}</span>}
                      {currentLibraryDetails.siglaArabic && <span className="font-taha" dir="rtl">{currentLibraryDetails.siglaArabic}</span>}
                    </div>
                  </div>
                )}

                {currentLibraryDetails.library && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Library</span>
                    <span className="text-gray-600">{currentLibraryDetails.library}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {currentLibraryDetails.city && (
                    <div>
                      <span className="font-semibold text-gray-800 block mb-1">City</span>
                      <span className="text-gray-600">{currentLibraryDetails.city}</span>
                    </div>
                  )}
                  {currentLibraryDetails.country && (
                    <div>
                      <span className="font-semibold text-gray-800 block mb-1">Country</span>
                      <span className="text-gray-600">{currentLibraryDetails.country}</span>
                    </div>
                  )}
                </div>

                {currentLibraryDetails.date && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Date (Hijri/Gregorian)</span>
                    <span className="text-gray-600">{currentLibraryDetails.date}</span>
                  </div>
                )}

                {currentLibraryDetails.catalogNumber && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Catalog no.</span>
                    <span className="text-gray-600">{currentLibraryDetails.catalogNumber}</span>
                  </div>
                )}

                {currentLibraryDetails.completeness && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Completeness</span>
                    <p className="text-gray-600 leading-relaxed text-xs">
                      {currentLibraryDetails.completeness}
                    </p>
                  </div>
                )}

                {currentLibraryDetails.scribe && currentLibraryDetails.scribe !== 'n/a' && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Scribe</span>
                    <span className="text-gray-600">{currentLibraryDetails.scribe}</span>
                  </div>
                )}

                {currentLibraryDetails.features && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Features</span>
                    <span className="text-gray-600">{currentLibraryDetails.features}</span>
                  </div>
                )}

                {currentLibraryDetails.permanentLink && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Permanent Link</span>
                    <a href="#" className="text-[#43896B] hover:underline">
                      {currentLibraryDetails.permanentLink === 'create link' ? 'Link' : currentLibraryDetails.permanentLink}
                    </a>
                  </div>
                )}

                {currentLibraryDetails.orationSequence && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Oration Sequence</span>
                    <span className="text-gray-600">{currentLibraryDetails.orationSequence}</span>
                  </div>
                )}

                {currentLibraryDetails.format && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Format</span>
                    <p className="text-gray-600 text-xs">
                      {currentLibraryDetails.format}
                    </p>
                  </div>
                )}

                {currentLibraryDetails.additionalInfo && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Additional Info</span>
                    <p className="text-gray-600 text-xs italic">
                      {currentLibraryDetails.additionalInfo}
                    </p>
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
