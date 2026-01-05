'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  convertLibraryItemToManuscriptDetails,
  getContentTypeFromSection
} from '@/api/manuscripts';
import { STATIC_MANUSCRIPTS } from '@/data/static-manuscripts';
import { Loader2 } from 'lucide-react';

const ManuscriptsContent = () => {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section');

  const [allManuscripts, setAllManuscripts] = useState<Manuscript[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [selectedType, setSelectedType] = useState<'oration' | 'letter' | 'saying'>('oration');
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urlSection, setUrlSection] = useState<string | null>(null);

  // Helper function to extract section number for display
  const getSectionDisplayNumber = useCallback((section: string): string => {
    const parts = section.split('.');
    return parts.length > 1 ? parts[1] : section;
  }, []);

  // Initialize from URL if present
  useEffect(() => {
    if (sectionFromUrl) {
      const type = getContentTypeFromSection(sectionFromUrl);
      if (type) setSelectedType(type);
      setUrlSection(sectionFromUrl);
      setSelectedNumber(getSectionDisplayNumber(sectionFromUrl));
    }
  }, [sectionFromUrl, getSectionDisplayNumber]);

  // Helper function to determine if a manuscript belongs to a library
  // Since the library relation isn't populated in the API, we infer from file names
  const manuscriptBelongsToLibrary = useCallback((manuscript: Manuscript, library: Library): boolean => {
    // Check if the manuscript has a direct library relation (for future when API populates this)
    if (manuscript.library && manuscript.library === library.name) {
      return true;
    }
    
    // Infer library from file names
    // File names contain patterns like "Qum_Mar'ashi Library 3827" or "Shahrastani"
    const libraryName = library.name.toLowerCase();
    
    // Check if any file name contains a reference to this library
    if (manuscript.files && manuscript.files.length > 0) {
      const fileNamesJoined = manuscript.files.map(f => f.name.toLowerCase()).join(' ');
      
      // Mar'ashi variations: marashi, mar'ashi, marʿashi
      if (libraryName.includes('mar') && libraryName.includes('ashi')) {
        return fileNamesJoined.includes("mar'ashi") || 
               fileNamesJoined.includes("marashi") || 
               fileNamesJoined.includes("mar_ashi");
      }
      
      // Shahrastani variations
      if (libraryName.includes('shahrastan')) {
        return fileNamesJoined.includes('shahrastan');
      }
      
      // Generic check for other libraries - match significant part of library name
      const significantPart = libraryName.split(' ')[0];
      if (significantPart.length > 3) {
        return fileNamesJoined.includes(significantPart);
      }
    }
    
    return false;
  }, []);

  // Filter manuscripts based on selected type AND library
  const filteredByLibraryAndType = useMemo(() => {
    if (!selectedLibrary) return [];
    
    return allManuscripts.filter(m => {
      const type = getContentTypeFromSection(m.section);
      const isTypeMatch = type === selectedType;

      // Check if manuscript belongs to the selected library
      const isLibraryMatch = manuscriptBelongsToLibrary(m, selectedLibrary);

      return isTypeMatch && isLibraryMatch;
    });
  }, [allManuscripts, selectedType, selectedLibrary, manuscriptBelongsToLibrary]);

  // Sort and get available numbers for the selected type and library
  const availableSections = useMemo(() => {
    return [...filteredByLibraryAndType].sort((a, b) => {
      const numA = parseInt(getSectionDisplayNumber(a.section), 10);
      const numB = parseInt(getSectionDisplayNumber(b.section), 10);
      return numA - numB;
    });
  }, [filteredByLibraryAndType, getSectionDisplayNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch libraries and manuscripts in parallel
        const [librariesResponse, manuscriptsResponse] = await Promise.all([
          librariesApi.getAllLibraries(1, 100),
          manuscriptsApi.getAllManuscripts(1, 400)
        ]);
        
        const fetchedManuscripts = manuscriptsResponse.data || [];
        setAllManuscripts(fetchedManuscripts);

        if (librariesResponse.data && librariesResponse.data.length > 0) {
          setLibraries(librariesResponse.data);
          
          // Try to find a library that has manuscript images available
          // Currently, Mar'ashi is the only library with uploaded images
          // We detect this by checking file names for library patterns
          const libraryWithManuscripts = librariesResponse.data.find(lib => {
            const libName = lib.name.toLowerCase();
            return fetchedManuscripts.some(m => {
              if (m.files && m.files.length > 0) {
                const fileNames = m.files.map(f => f.name.toLowerCase()).join(' ');
                // Check for Mar'ashi variations
                if (libName.includes('mar') && libName.includes('ashi')) {
                  return fileNames.includes("mar'ashi") || fileNames.includes("marashi") || fileNames.includes("mar_ashi");
                }
                // Check for other library patterns
                const significantPart = libName.split(' ')[0];
                if (significantPart.length > 3) {
                  return fileNames.includes(significantPart);
                }
              }
              return false;
            });
          });
          
          // Prefer library with manuscripts, then library with items, then first library
          const libraryWithItems = librariesResponse.data.find(l => l.library_items.length > 0);
          setSelectedLibrary(libraryWithManuscripts || libraryWithItems || librariesResponse.data[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load manuscripts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separate effect for logic that might trigger re-renders to avoid dependency issues
  useEffect(() => {
    if (availableSections.length > 0) {
      let manuscriptToSelect = null;

      if (selectedNumber) {
        // Try to find manuscript that matches the selected number (already filtered by library)
        manuscriptToSelect = availableSections.find(m =>
          getSectionDisplayNumber(m.section) === selectedNumber
        );
      }

      // If we have a selection from selectedNumber, use it
      if (manuscriptToSelect) {
        setSelectedManuscript(manuscriptToSelect);
      } else if (!urlSection) {
        // Only default to the first one if not from URL
        manuscriptToSelect = availableSections[0];
        const newNumber = getSectionDisplayNumber(manuscriptToSelect.section);
        setSelectedNumber(newNumber);
        setSelectedManuscript(manuscriptToSelect);
      } else {
        // URL section not valid, don't select anything
        setSelectedManuscript(null);
      }
    } else {
      setSelectedManuscript(null);
    }
    // We use dependencies that clearly change when the selection should update
  }, [availableSections, selectedNumber, selectedLibrary, getSectionDisplayNumber, urlSection]);

  const handleLibraryChange = (value: string) => {
    const library = libraries.find(l => l.documentId === value);
    if (library) setSelectedLibrary(library);
    setUrlSection(null);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'oration' | 'letter' | 'saying');
    setSelectedNumber('');
    setUrlSection(null);
  };

  const handleNumberChange = (value: string) => {
    setSelectedNumber(value);
  };

  const libraryOptions = libraries.map(lib => ({
    value: lib.documentId,
    label: lib.name
  }));

  const typeOptions = [
    { value: 'oration', label: 'Orations' },
    { value: 'letter', label: 'Letters' },
    { value: 'saying', label: 'Sayings' }
  ];

  const numberOptions = useMemo(() => {
    const uniqueNumbers = Array.from(new Set(availableSections.map(m => getSectionDisplayNumber(m.section))));
    return uniqueNumbers.map(num => ({ value: num, label: num }));
  }, [availableSections, getSectionDisplayNumber]);

  const getCurrentLibraryDetails = () => {
    if (selectedLibrary && selectedLibrary.library_items.length > 0) {
      return convertLibraryItemToManuscriptDetails(selectedLibrary);
    }
    const name = selectedLibrary?.name?.toLowerCase() || '';
    if (name.includes("mar'ashi") || name.includes("marashi")) return STATIC_MANUSCRIPTS.marashi;
    if (name.includes('shahrastan')) return STATIC_MANUSCRIPTS.shahrastani;

    return selectedLibrary ? {
      id: selectedLibrary.documentId,
      name: selectedLibrary.name,
      siglaEnglish: '', siglaArabic: '', library: '', city: '', country: '',
      date: '', catalogNumber: '', completeness: '', scribe: '', dimensions: '',
      originCity: '', features: '', permanentLink: '', orationSequence: '',
      format: '', additionalInfo: '',
    } : {
      id: '',
      name: 'Select Manuscript',
      siglaEnglish: '', siglaArabic: '', library: '', city: '', country: '',
      date: '', catalogNumber: '', completeness: '', scribe: '', dimensions: '',
      originCity: '', features: '', permanentLink: '', orationSequence: '',
      format: '', additionalInfo: '',
    };
  };

  const currentLibraryDetails = getCurrentLibraryDetails();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#43896B] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading manuscripts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const manuscriptPages = selectedManuscript?.files?.map(file => getManuscriptImageUrl(file.url)) || [];
  const contentTypeLabel = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Manuscript</label>
              <Select options={libraryOptions} value={selectedLibrary?.documentId || ''} onChange={handleLibraryChange} placeholder="Select Manuscript..." className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <Select options={typeOptions} value={selectedType} onChange={handleTypeChange} placeholder="Select Type..." className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number</label>
              <Select options={numberOptions} value={selectedNumber} onChange={handleNumberChange} placeholder="Select Number..." className="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedManuscript ? `${currentLibraryDetails.name} - ${contentTypeLabel} ${selectedNumber}` : `${currentLibraryDetails.name} - ${contentTypeLabel}`}</h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
            {(selectedManuscript?.gregorianYear || currentLibraryDetails.date) && (
              <span className="flex items-center gap-1"><span className="font-semibold">Date:</span> {selectedManuscript?.gregorianYear || currentLibraryDetails.date}</span>
            )}
            {(selectedManuscript?.city || currentLibraryDetails.city) && (
              <span className="flex items-center gap-1"><span className="font-semibold">Location:</span> {selectedManuscript?.city || currentLibraryDetails.city}, {selectedManuscript?.country || currentLibraryDetails.country}</span>
            )}
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${selectedManuscript ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        <div className={`${selectedManuscript ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
          {availableSections.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
              <div className="mb-4"><svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No {contentTypeLabel} Available</h3>
              <p className="text-gray-500 max-w-md">Manuscript images for <span className="font-medium">{selectedLibrary?.name || 'this library'}</span> are currently being digitized and will be available soon.</p>
            </div>
          ) : selectedManuscript && manuscriptPages.length > 0 ? (
            <ManuscriptViewer pages={manuscriptPages} bookName={selectedManuscript.bookName || ''} />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center"><p className="text-gray-600">No manuscript available for this selection.</p></div>
          )}
        </div>
        {selectedManuscript && (
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Manuscript Details</h3>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-500">Current Library:</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{currentLibraryDetails.name}</span>
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
                  {currentLibraryDetails.library && (<div><span className="font-semibold text-gray-800 block mb-1">Library</span><span className="text-gray-600">{currentLibraryDetails.library}</span></div>)}
                  <div className="grid grid-cols-2 gap-4">
                    {currentLibraryDetails.city && (<div><span className="font-semibold text-gray-800 block mb-1">City</span><span className="text-gray-600">{currentLibraryDetails.city}</span></div>)}
                    {currentLibraryDetails.country && (<div><span className="font-semibold text-gray-800 block mb-1">Country</span><span className="text-gray-600">{currentLibraryDetails.country}</span></div>)}
                  </div>
                  {currentLibraryDetails.date && (<div><span className="font-semibold text-gray-800 block mb-1">Date (Hijri/Gregorian)</span><span className="text-gray-600">{currentLibraryDetails.date}</span></div>)}
                  {currentLibraryDetails.catalogNumber && (<div><span className="font-semibold text-gray-800 block mb-1">Catalog no.</span><span className="text-gray-600">{currentLibraryDetails.catalogNumber}</span></div>)}
                  {currentLibraryDetails.completeness && (<div><span className="font-semibold text-gray-800 block mb-1">Completeness</span><p className="text-gray-600 leading-relaxed text-xs">{currentLibraryDetails.completeness}</p></div>)}
                  {currentLibraryDetails.scribe && currentLibraryDetails.scribe !== 'n/a' && (<div><span className="font-semibold text-gray-800 block mb-1">Scribe</span><span className="text-gray-600">{currentLibraryDetails.scribe}</span></div>)}
                  {currentLibraryDetails.features && (<div><span className="font-semibold text-gray-800 block mb-1">Features</span><span className="text-gray-600">{currentLibraryDetails.features}</span></div>)}
                  {currentLibraryDetails.permanentLink && (<div><span className="font-semibold text-gray-800 block mb-1">Permanent Link</span><a href="#" className="text-[#43896B] hover:underline">{currentLibraryDetails.permanentLink === 'create link' ? 'Link' : currentLibraryDetails.permanentLink}</a></div>)}
                  {currentLibraryDetails.orationSequence && (<div><span className="font-semibold text-gray-800 block mb-1">Oration Sequence</span><span className="text-gray-600">{currentLibraryDetails.orationSequence}</span></div>)}
                  {currentLibraryDetails.format && (<div><span className="font-semibold text-gray-800 block mb-1">Format</span><p className="text-gray-600 text-xs">{currentLibraryDetails.format}</p></div>)}
                  {currentLibraryDetails.additionalInfo && (<div><span className="font-semibold text-gray-800 block mb-1">Additional Info</span><p className="text-gray-600 text-xs italic">{currentLibraryDetails.additionalInfo}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManuscriptsContent;
