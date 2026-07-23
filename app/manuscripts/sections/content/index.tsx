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
  manuscriptMatchesLibrary,
} from '@/api/manuscripts';
import { STATIC_MANUSCRIPTS } from '@/data/static-manuscripts';
import { Loader2, BookOpen, GitCompare, Layout, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import ContentDescription from '@/app/components/content/content-description';
import { Post, orationsApi, lettersApi, sayingsApi } from '@/api/posts';

const ManuscriptsContent = () => {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section');

  const [allManuscripts, setAllManuscripts] = useState<Manuscript[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [selectedType, setSelectedType] = useState<'oration' | 'letter' | 'saying' | 'introduction' | 'conclusion'>('oration');
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urlSection, setUrlSection] = useState<string | null>(null);

  // New states for Parallel Reading and Comparison
  const [viewMode, setViewMode] = useState<'single' | 'reading' | 'comparison'>('single');
  const [normalizedContent, setNormalizedContent] = useState<Post | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [secondManuscript, setSecondManuscript] = useState<Manuscript | null>(null);
  const [secondLibrary, setSecondLibrary] = useState<Library | null>(null);
  const [compareCount, setCompareCount] = useState<2 | 3>(2);
  const [thirdManuscript, setThirdManuscript] = useState<Manuscript | null>(null);
  const [thirdLibrary, setThirdLibrary] = useState<Library | null>(null);

  // Helper function to extract section number for display
  const getSectionDisplayNumber = useCallback((section: string): string => {
    const parts = section.split('.');
    return parts.length > 1 ? parts[1] : section;
  }, []);

  const getTypeFromSection = useCallback((section: string): 'oration' | 'letter' | 'saying' | 'introduction' | null => {
    if (section.startsWith('1')) return 'oration';
    if (section.startsWith('2')) return 'letter';
    if (section.startsWith('3')) return 'saying';
    if (section.startsWith('0')) return 'introduction';
    return null;
  }, []);

  // Initialize from URL if present
  useEffect(() => {
    if (sectionFromUrl) {
      const type = getTypeFromSection(sectionFromUrl);
      if (type) setSelectedType(type);
      setUrlSection(sectionFromUrl);
      setSelectedNumber(getSectionDisplayNumber(sectionFromUrl));
    }
  }, [sectionFromUrl, getSectionDisplayNumber, getTypeFromSection]);

  // Fetch normalized content when in reading mode or when selection changes
  useEffect(() => {
    const fetchNormalizedContent = async () => {
      if (viewMode !== 'reading' || !selectedNumber) {
        setNormalizedContent(null);
        return;
      }

      try {
        setIsContentLoading(true);
        const sectionNum = selectedType === 'oration' ? `1.${selectedNumber}` :
          selectedType === 'letter' ? `2.${selectedNumber}` :
            selectedType === 'saying' ? `3.${selectedNumber}` :
              selectedType === 'introduction' ? `0.${selectedNumber}` :
                selectedType === 'conclusion' ? `0.${selectedNumber}` : '';

        if (!sectionNum) return;

        let post = null;
        if (selectedType === 'oration') post = await orationsApi.getOrationBySermonNumber(sectionNum);
        else if (selectedType === 'letter') post = await lettersApi.getLetterBySermonNumber(sectionNum);
        else if (selectedType === 'saying') post = await sayingsApi.getSayingBySermonNumber(sectionNum);

        setNormalizedContent(post);
      } catch (err) {
        console.error('Error fetching normalized content:', err);
      } finally {
        setIsContentLoading(false);
      }
    };

    fetchNormalizedContent();
  }, [viewMode, selectedNumber, selectedType]);

  // Helper function to determine if a manuscript belongs to a library
  // Since the library relation isn't populated in the API, we infer from file names
  const manuscriptBelongsToLibrary = useCallback((manuscript: Manuscript, library: Library): boolean => {
    return manuscriptMatchesLibrary(manuscript, library);
  }, []);

  // Filter manuscripts based on selected type AND library
  const filteredByLibraryAndType = useMemo(() => {
    if (!selectedLibrary) return [];

    return allManuscripts.filter(m => {
      const type = getTypeFromSection(m.section);
      const isTypeMatch = selectedType === 'introduction' || selectedType === 'conclusion'
        ? m.section.startsWith('0')
        : type === selectedType;
      const isLibraryMatch = manuscriptBelongsToLibrary(m, selectedLibrary);
      return isTypeMatch && isLibraryMatch;
    });
  }, [allManuscripts, selectedType, selectedLibrary, manuscriptBelongsToLibrary, getTypeFromSection]);

  // Filter for second manuscript in comparison mode
  const secondFilteredByLibraryAndType = useMemo(() => {
    if (!secondLibrary) return [];

    return allManuscripts.filter(m => {
      const type = getTypeFromSection(m.section);
      const isTypeMatch = selectedType === 'introduction' || selectedType === 'conclusion'
        ? m.section.startsWith('0')
        : type === selectedType;
      const isLibraryMatch = manuscriptBelongsToLibrary(m, secondLibrary);
      return isTypeMatch && isLibraryMatch;
    });
  }, [allManuscripts, selectedType, secondLibrary, manuscriptBelongsToLibrary, getTypeFromSection]);

  const thirdFilteredByLibraryAndType = useMemo(() => {
    if (!thirdLibrary) return [];

    return allManuscripts.filter(m => {
      const type = getTypeFromSection(m.section);
      const isTypeMatch = selectedType === 'introduction' || selectedType === 'conclusion'
        ? m.section.startsWith('0')
        : type === selectedType;
      const isLibraryMatch = manuscriptBelongsToLibrary(m, thirdLibrary);
      return isTypeMatch && isLibraryMatch;
    });
  }, [allManuscripts, selectedType, thirdLibrary, manuscriptBelongsToLibrary, getTypeFromSection]);

  // Sort and get available numbers for the selected type and library
  const availableSections = useMemo(() => {
    return [...filteredByLibraryAndType].sort((a, b) => {
      const numA = parseInt(getSectionDisplayNumber(a.section), 10);
      const numB = parseInt(getSectionDisplayNumber(b.section), 10);
      return numA - numB;
    });
  }, [filteredByLibraryAndType, getSectionDisplayNumber]);

  const secondAvailableSections = useMemo(() => {
    return [...secondFilteredByLibraryAndType].sort((a, b) => {
      const numA = parseInt(getSectionDisplayNumber(a.section), 10);
      const numB = parseInt(getSectionDisplayNumber(b.section), 10);
      return numA - numB;
    });
  }, [secondFilteredByLibraryAndType, getSectionDisplayNumber]);

  const thirdAvailableSections = useMemo(() => {
    return [...thirdFilteredByLibraryAndType].sort((a, b) => {
      const numA = parseInt(getSectionDisplayNumber(a.section), 10);
      const numB = parseInt(getSectionDisplayNumber(b.section), 10);
      return numA - numB;
    });
  }, [thirdFilteredByLibraryAndType, getSectionDisplayNumber]);

  const comparisonNumbers = useMemo(() => {
    const nums1 = availableSections.map(m => getSectionDisplayNumber(m.section));
    const nums2 = secondAvailableSections.map(m => getSectionDisplayNumber(m.section));
    const nums3 = thirdAvailableSections.map(m => getSectionDisplayNumber(m.section));

    const union = new Set<string>([...nums1, ...nums2, ...(compareCount === 3 ? nums3 : [])]);
    const commonSet = new Set<string>(nums1);
    for (const n of Array.from(commonSet)) {
      if (!nums2.includes(n)) commonSet.delete(n);
    }
    if (compareCount === 3) {
      for (const n of Array.from(commonSet)) {
        if (!nums3.includes(n)) commonSet.delete(n);
      }
    }

    const toSorted = (values: string[]) =>
      [...values].sort((a, b) => (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0));

    return {
      union: toSorted(Array.from(union)),
      common: toSorted(Array.from(commonSet)),
    };
  }, [availableSections, compareCount, getSectionDisplayNumber, secondAvailableSections, thirdAvailableSections]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch first page of libraries and manuscripts
        const [librariesResponse, firstPageManuscripts] = await Promise.all([
          librariesApi.getAllLibraries(1, 100),
          manuscriptsApi.getAllManuscripts(1, 100)
        ]);

        const fetchedLibraries = librariesResponse.data || [];
        setLibraries(fetchedLibraries);

        let allFetchedManuscripts = firstPageManuscripts.data || [];
        const totalPages = firstPageManuscripts.meta.pagination.pageCount;

        // If there are more pages, fetch them recursively/in loop
        if (totalPages > 1) {
          const remainingPages = [];
          for (let p = 2; p <= totalPages; p++) {
            remainingPages.push(manuscriptsApi.getAllManuscripts(p, 100));
          }
          const additionalResponses = await Promise.all(remainingPages);
          additionalResponses.forEach(response => {
            if (response.data) {
              allFetchedManuscripts = [...allFetchedManuscripts, ...response.data];
            }
          });
        }

        setAllManuscripts(allFetchedManuscripts);

        if (fetchedLibraries.length > 0) {
          // Try to find a library that has manuscript images available
          const libraryWithManuscripts = fetchedLibraries.find(lib => {
            const libName = lib.name.toLowerCase();
            return allFetchedManuscripts.some(m => {
              if (m.files && m.files.length > 0) {
                const fileNames = m.files.map(f => f.name.toLowerCase()).join(' ');
                if (libName.includes('mar') && libName.includes('ashi')) {
                  return fileNames.includes("mar'ashi") || fileNames.includes("marashi") || fileNames.includes("mar_ashi");
                }
                const significantPart = libName.split(' ')[0];
                if (significantPart.length > 3) {
                  return fileNames.includes(significantPart);
                }
              }
              return false;
            });
          });

          const libraryWithItems = fetchedLibraries.find(l => l.library_items.length > 0);
          const first = libraryWithManuscripts || libraryWithItems || fetchedLibraries[0];
          const second = fetchedLibraries.find(l => l.documentId !== first.documentId) || first;
          const third = fetchedLibraries.find(l => l.documentId !== first.documentId && l.documentId !== second.documentId) || second;
          setSelectedLibrary(first);
          setSecondLibrary(second);
          setThirdLibrary(third);
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
      } else if (!urlSection && viewMode !== 'comparison') {
        // Only default to the first one if not from URL
        manuscriptToSelect = availableSections[0];
        const newNumber = getSectionDisplayNumber(manuscriptToSelect.section);
        setSelectedNumber(newNumber);
        setSelectedManuscript(manuscriptToSelect);
      } else {
        // In comparison mode the selected number may only exist in one of
        // the other libraries. Keep the number and leave this column empty.
        setSelectedManuscript(null);
      }
    } else {
      setSelectedManuscript(null);
    }
    // We use dependencies that clearly change when the selection should update
  }, [availableSections, selectedNumber, selectedLibrary, getSectionDisplayNumber, urlSection, viewMode]);

  // Handle second manuscript selection
  useEffect(() => {
    if (viewMode === 'comparison' && secondAvailableSections.length > 0) {
      let manuscriptToSelect = null;

      if (selectedNumber) {
        manuscriptToSelect = secondAvailableSections.find(m =>
          getSectionDisplayNumber(m.section) === selectedNumber
        );
      }

      if (manuscriptToSelect) {
        setSecondManuscript(manuscriptToSelect);
      } else if (selectedNumber) {
        setSecondManuscript(null);
      }
    } else if (viewMode !== 'comparison') {
      setSecondManuscript(null);
    }
  }, [secondAvailableSections, selectedNumber, secondLibrary, getSectionDisplayNumber, viewMode]);

  useEffect(() => {
    if (viewMode === 'comparison' && compareCount === 3 && thirdAvailableSections.length > 0) {
      let manuscriptToSelect = null;

      if (selectedNumber) {
        manuscriptToSelect = thirdAvailableSections.find(m =>
          getSectionDisplayNumber(m.section) === selectedNumber
        );
      }

      if (manuscriptToSelect) {
        setThirdManuscript(manuscriptToSelect);
      } else if (selectedNumber) {
        setThirdManuscript(null);
      }
      return;
    }

    setThirdManuscript(null);
  }, [compareCount, getSectionDisplayNumber, selectedNumber, thirdAvailableSections, thirdLibrary, viewMode]);

  useEffect(() => {
    if (viewMode !== 'comparison') return;
    const allowed = comparisonNumbers.union;
    if (allowed.length === 0) return;
    if (!selectedNumber || !allowed.includes(selectedNumber)) {
      setSelectedNumber(allowed[0]);
    }
  }, [comparisonNumbers.union, selectedNumber, viewMode]);

  const handleLibraryChange = (value: string) => {
    const library = libraries.find(l => l.documentId === value);
    if (library) setSelectedLibrary(library);
    setUrlSection(null);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as 'oration' | 'letter' | 'saying' | 'introduction' | 'conclusion');
    setSelectedNumber('');
    setUrlSection(null);
  };

  const handleNumberChange = (value: string) => {
    setSelectedNumber(value);
  };

  const handleSecondLibraryChange = (value: string) => {
    const library = libraries.find(l => l.documentId === value);
    if (library) setSecondLibrary(library);
  };

  const handleThirdLibraryChange = (value: string) => {
    const library = libraries.find(l => l.documentId === value);
    if (library) setThirdLibrary(library);
  };

  const libraryOptions = libraries.map(lib => ({
    value: lib.documentId,
    label: lib.name
  }));

  const typeOptions = [
    { value: 'oration', label: 'Orations' },
    { value: 'letter', label: 'Letters' },
    { value: 'saying', label: 'Sayings' },
    { value: 'introduction', label: 'Introduction' },
    { value: 'conclusion', label: 'Conclusion' }
  ];

  const numberOptions = useMemo(() => {
    const uniqueNumbers = viewMode === 'comparison'
      ? (comparisonNumbers.union.length > 0 ? comparisonNumbers.union : [])
      : Array.from(new Set(availableSections.map(m => getSectionDisplayNumber(m.section))));
    return uniqueNumbers.map(num => ({ value: num, label: num }));
  }, [availableSections, comparisonNumbers.union, getSectionDisplayNumber, viewMode]);

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
  const secondManuscriptPages = secondManuscript?.files?.map(file => getManuscriptImageUrl(file.url)) || [];
  const thirdManuscriptPages = thirdManuscript?.files?.map(file => getManuscriptImageUrl(file.url)) || [];
  const contentTypeLabel = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('single')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'single' ? 'bg-white text-[#43896B] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Layout className="w-4 h-4" />
            Single View
          </button>
          <button
            onClick={() => setViewMode('reading')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'reading' ? 'bg-white text-[#43896B] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Parallel Reading
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'comparison' ? 'bg-white text-[#43896B] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <GitCompare className="w-4 h-4" />
            Comparison
          </button>
        </div>

        {viewMode === 'comparison' && (
          <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#43896B]" />
            {compareCount === 3 ? 'Comparing three manuscripts side-by-side' : 'Comparing two manuscripts side-by-side'}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div
            className={`grid grid-cols-1 ${viewMode === 'comparison'
              ? (compareCount === 3 ? 'md:grid-cols-2 lg:grid-cols-6' : 'md:grid-cols-2 lg:grid-cols-5')
              : 'md:grid-cols-2 lg:grid-cols-3'
              } gap-6`}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {viewMode === 'comparison' ? 'Manuscript 1' : 'Manuscript'}
              </label>
              <Select options={libraryOptions} value={selectedLibrary?.documentId || ''} onChange={handleLibraryChange} placeholder="Select Manuscript..." className="w-full" />
            </div>
            {viewMode === 'comparison' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Manuscript 2</label>
                <Select options={libraryOptions} value={secondLibrary?.documentId || ''} onChange={handleSecondLibraryChange} placeholder="Select Manuscript..." className="w-full" />
              </div>
            )}
            {viewMode === 'comparison' && compareCount === 3 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Manuscript 3</label>
                <Select options={libraryOptions} value={thirdLibrary?.documentId || ''} onChange={handleThirdLibraryChange} placeholder="Select Manuscript..." className="w-full" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <Select options={typeOptions} value={selectedType} onChange={handleTypeChange} placeholder="Select Type..." className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number
              </label>
              <div className="flex gap-2">
                <Select options={numberOptions} value={selectedNumber} onChange={handleNumberChange} placeholder="No." className="flex-1" />
              </div>
            </div>
            {viewMode === 'comparison' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Compare</label>
                <Select
                  options={[
                    { value: '2', label: '2 manuscripts' },
                    { value: '3', label: '3 manuscripts' },
                  ]}
                  value={String(compareCount)}
                  onChange={(v) => setCompareCount((v === '3' ? 3 : 2))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {viewMode === 'comparison'
              ? `Comparing: ${selectedLibrary?.name || 'Manuscript 1'}${secondLibrary ? ` & ${secondLibrary.name}` : ''}${compareCount === 3 && thirdLibrary ? ` & ${thirdLibrary.name}` : ''} — ${contentTypeLabel} ${selectedNumber}`
              : (selectedManuscript ? `${currentLibraryDetails.name} - ${contentTypeLabel} ${selectedNumber}` : `${currentLibraryDetails.name} - ${contentTypeLabel}`)
            }
          </h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
            {viewMode !== 'comparison' && (
              <>
                {(selectedManuscript?.gregorianYear || currentLibraryDetails.date) && (
                  <span className="flex items-center gap-1"><span className="font-semibold">Date:</span> {selectedManuscript?.gregorianYear || currentLibraryDetails.date}</span>
                )}
                {(selectedManuscript?.city || currentLibraryDetails.city) && (
                  <span className="flex items-center gap-1"><span className="font-semibold">Location:</span> {selectedManuscript?.city || currentLibraryDetails.city}, {selectedManuscript?.country || currentLibraryDetails.country}</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'comparison' ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${compareCount === 3 ? '2xl:grid-cols-3' : ''} gap-6`}>
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-700">
              {selectedLibrary?.name || (selectedManuscript ? getManuscriptDisplayName(selectedManuscript) : 'Manuscript 1')}
            </div>
            {availableSections.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <div className="mb-4 text-gray-300"><ImageIcon className="w-16 h-16 mx-auto" /></div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No {contentTypeLabel} Available</h3>
                <p className="text-gray-500">Manuscript images for <span className="font-medium">{selectedLibrary?.name || 'this library'}</span> are pending.</p>
              </div>
            ) : selectedManuscript && manuscriptPages.length > 0 ? (
              <ManuscriptViewer pages={manuscriptPages} bookName={selectedManuscript.bookName || ''} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-gray-600">{selectedNumber ? `No manuscript for ${contentTypeLabel} ${selectedNumber} in this library.` : 'Select a number to compare.'}</p>
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-gray-700">
              {secondLibrary?.name || (secondManuscript ? getManuscriptDisplayName(secondManuscript) : 'Manuscript 2')}
            </div>
            {secondAvailableSections.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <div className="mb-4 text-gray-300"><ImageIcon className="w-16 h-16 mx-auto" /></div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No {contentTypeLabel} Available</h3>
                <p className="text-gray-500">Manuscript images for <span className="font-medium">{secondLibrary?.name}</span> are pending.</p>
              </div>
            ) : secondManuscript && secondManuscriptPages.length > 0 ? (
              <ManuscriptViewer pages={secondManuscriptPages} bookName={secondManuscript.bookName || ''} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-gray-600">{selectedNumber ? `No manuscript for ${contentTypeLabel} ${selectedNumber} in this library.` : 'Select a number to compare.'}</p>
              </div>
            )}
          </div>

          {compareCount === 3 && (
            <div>
              <div className="mb-3 text-sm font-semibold text-gray-700">
                {thirdLibrary?.name || (thirdManuscript ? getManuscriptDisplayName(thirdManuscript) : 'Manuscript 3')}
              </div>
              {thirdAvailableSections.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                  <div className="mb-4 text-gray-300"><ImageIcon className="w-16 h-16 mx-auto" /></div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No {contentTypeLabel} Available</h3>
                  <p className="text-gray-500">Manuscript images for <span className="font-medium">{thirdLibrary?.name}</span> are pending.</p>
                </div>
              ) : thirdManuscript && thirdManuscriptPages.length > 0 ? (
                <ManuscriptViewer pages={thirdManuscriptPages} bookName={thirdManuscript.bookName || ''} />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                  <p className="text-gray-600">{selectedNumber ? `No manuscript for ${contentTypeLabel} ${selectedNumber} in this library.` : 'Select a number to compare.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${viewMode === 'single' ? (selectedManuscript ? 'lg:grid-cols-3' : 'lg:grid-cols-1') : 'lg:grid-cols-2'} gap-6`}>
          <div className={`${viewMode === 'single' && selectedManuscript ? 'lg:col-span-2' : ''}`}>
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

          <div className="flex flex-col gap-6">
            {viewMode === 'single' && selectedManuscript && (
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
          )}

          {viewMode === 'reading' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full max-h-[800px]">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#43896B]" />
                  Normalized Content (Critical Edition)
                </h3>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                {isContentLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-8 h-8 text-[#43896B] animate-spin mb-4" />
                    <p className="text-gray-500">Fetching {contentTypeLabel} content...</p>
                  </div>
                ) : normalizedContent ? (
                  <div className="p-0">
                    {selectedType === 'oration' || selectedType === 'letter' || selectedType === 'saying' ? (
                      <ContentDescription
                        content={normalizedContent}
                        contentType={selectedType === 'oration' ? 'orations' : selectedType === 'letter' ? 'letters' : 'sayings'}
                      />
                    ) : (
                      <div className="p-12 text-center text-gray-500">
                        Normalized content is currently available only for Orations, Letters, and Sayings.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    No normalized content found for {contentTypeLabel} {selectedNumber}.
                  </div>
                )}
              </div>
            </div>
          )}

          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get library/manuscript name
const getManuscriptDisplayName = (ms: Manuscript): string => {
  if (ms.bookName) return ms.bookName;
  if (typeof ms.library === 'string') return ms.library;
  if (Array.isArray(ms.library) && ms.library[0]?.name) return ms.library[0].name;
  if (ms.library && 'name' in ms.library) return ms.library.name;
  if (ms.libraries?.[0]?.name) return ms.libraries[0].name;
  const firstFileName = ms.files?.[0]?.name?.toLowerCase() || '';
  if (firstFileName.includes("mar'ashi") || firstFileName.includes("marashi") || firstFileName.includes("qum_mar")) return "Mar'ashi MS";
  if (firstFileName.includes("shahrastan")) return "Shahrastani MS";
  if (firstFileName.includes("rampur")) return "Rampur Raza MS";
  return `Manuscript ${ms.id}`;
};

export default ManuscriptsContent;
