'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Select from '@/app/components/select';
import ManuscriptViewer from '@/app/components/manuscript-viewer';
import ManuscriptMetadataDisplay from '@/app/components/manuscript-metadata';
import { manuscriptsApi, Manuscript, getManuscriptImageUrl } from '@/api/manuscripts';
import { STATIC_MANUSCRIPTS } from '@/data/static-manuscripts';
import { Loader2 } from 'lucide-react';

const ManuscriptsContent = () => {
  const searchParams = useSearchParams();
  const sectionFromUrl = searchParams.get('section');

  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<'all' | 'marashi' | 'shahrastani'>('all');
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

  const filteredManuscripts = manuscripts.filter(m => {
    if (libraryFilter === 'all') return true;
    return m.library?.toLowerCase().includes(libraryFilter);
  });

  const manuscriptOptions = filteredManuscripts.map(m => ({
    value: m.documentId,
    label: m.bookName || `Manuscript - Section ${m.section}`
  }));

  // Update selected manuscript when filter changes if current selection is not in filtered list
  useEffect(() => {
    if (filteredManuscripts.length > 0) {
      const isSelectedInFilter = filteredManuscripts.find(m => m.documentId === selectedManuscript?.documentId);
      if (!isSelectedInFilter) {
        setSelectedManuscript(filteredManuscripts[0]);
      }
    }
  }, [libraryFilter, manuscripts]);

  const getLibraryKey = (manuscript: Manuscript): 'marashi' | 'shahrastani' => {
    if (manuscript.library?.toLowerCase().includes('marashi')) return 'marashi';
    if (manuscript.library?.toLowerCase().includes('shahrastan')) return 'shahrastani';
    return 'marashi'; // fallback
  };

  const selectedLibrary = selectedManuscript ? getLibraryKey(selectedManuscript) : 'marashi';

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
              <label className="text-lg font-semibold text-gray-800 flex-shrink-0">
                Filter & Select:
              </label>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label htmlFor="library-filter" className="sr-only">Filter by Library</label>
                  <Select
                    options={[
                      { value: 'all', label: 'All Manuscripts' },
                      { value: 'marashi', label: 'Marashi Manuscripts' },
                      { value: 'shahrastani', label: 'Shahrastani Manuscripts' }
                    ]}
                    value={libraryFilter}
                    onChange={(val) => setLibraryFilter(val as any)}
                    placeholder="Filter by Library..."
                    className="w-full"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="manuscript-select" className="sr-only">Select Manuscript</label>
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
        </div>
      )}

      <div className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {`${STATIC_MANUSCRIPTS[selectedLibrary].name} - Section ${selectedManuscript.section || sectionFromUrl}`}
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

              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-500">Current Library:</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                  {STATIC_MANUSCRIPTS[selectedLibrary].name}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-800 block mb-1">Sigla</span>
                  <div className="flex gap-4">
                    <span>{STATIC_MANUSCRIPTS[selectedLibrary].siglaEnglish}</span>
                    <span className="font-taha" dir="rtl">{STATIC_MANUSCRIPTS[selectedLibrary].siglaArabic}</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-800 block mb-1">Library</span>
                  <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].library}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">City</span>
                    <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].city}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Country</span>
                    <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].country}</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-800 block mb-1">Date (Hijri/Gregorian)</span>
                  <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].date}</span>
                </div>

                <div>
                  <span className="font-semibold text-gray-800 block mb-1">Catalog no.</span>
                  <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].catalogNumber}</span>
                </div>

                {STATIC_MANUSCRIPTS[selectedLibrary].completeness && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Completeness</span>
                    <p className="text-gray-600 leading-relaxed text-xs">
                      {STATIC_MANUSCRIPTS[selectedLibrary].completeness}
                    </p>
                  </div>
                )}

                {STATIC_MANUSCRIPTS[selectedLibrary].scribe !== 'n/a' && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Scribe</span>
                    <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].scribe}</span>
                  </div>
                )}

                {STATIC_MANUSCRIPTS[selectedLibrary].features && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Features</span>
                    <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].features}</span>
                  </div>
                )}

                {STATIC_MANUSCRIPTS[selectedLibrary].permanentLink && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Permanent Link</span>
                    <a href="#" className="text-[#43896B] hover:underline">
                      {STATIC_MANUSCRIPTS[selectedLibrary].permanentLink === 'create link' ? 'Link' : STATIC_MANUSCRIPTS[selectedLibrary].permanentLink}
                    </a>
                  </div>
                )}

                {STATIC_MANUSCRIPTS[selectedLibrary].orationSequence && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Oration Sequence</span>
                    <span className="text-gray-600">{STATIC_MANUSCRIPTS[selectedLibrary].orationSequence}</span>
                  </div>
                )}

                {STATIC_MANUSCRIPTS[selectedLibrary].format && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Format</span>
                    <p className="text-gray-600 text-xs">
                      {STATIC_MANUSCRIPTS[selectedLibrary].format}
                    </p>
                  </div>
                )}

                {STATIC_MANUSCRIPTS[selectedLibrary].additionalInfo && (
                  <div>
                    <span className="font-semibold text-gray-800 block mb-1">Additional Info</span>
                    <p className="text-gray-600 text-xs italic">
                      {STATIC_MANUSCRIPTS[selectedLibrary].additionalInfo}
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
