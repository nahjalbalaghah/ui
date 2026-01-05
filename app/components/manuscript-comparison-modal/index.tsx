'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Loader2, FileText, Book, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { manuscriptsApi, Manuscript, getManuscriptImageUrl } from '@/api/manuscripts';
import { type Post } from '@/api/posts';
import { formatTextWithFootnotes } from '@/app/utils/text-formatting';
import Select from '../select';

interface ManuscriptComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: Post | RadisContent;
    contentType: 'orations' | 'letters' | 'sayings' | 'radis' | 'conclusion';
}

// Simplified content type for Radis introductions
interface RadisContent {
    id: number;
    number: string;
    arabic: string;
    translation: string;
    heading?: string;
    sermonNumber?: string;
    paragraphs?: any[];
    title?: string;
    translations?: any[];
    footnotes?: any[];
}

const MissingPagePlaceholder: React.FC<{ pageNumber: number; className?: string }> = ({ pageNumber, className = '' }) => (
    <div className={`flex items-center justify-center bg-gray-100 min-h-[400px] rounded-lg ${className}`}>
        <div className="text-center p-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Page Missing</h3>
            <p className="text-gray-500">This page is missing from this manuscript.</p>
            <p className="text-sm text-gray-400 mt-2">Page {pageNumber}</p>
        </div>
    </div>
);

export default function ManuscriptComparisonModal({
    isOpen,
    onClose,
    content,
    contentType
}: ManuscriptComparisonModalProps) {
    const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
    const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [zoom, setZoom] = useState(100);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isImageFullscreen, setIsImageFullscreen] = useState(false);

    // Get the section number, handling both Post (sermonNumber) and RadisContent (number)
    const getSectionNumber = () => {
        if (contentType === 'radis' && 'number' in content) {
            return `0.${content.number}`; // Radis uses prefix 0 for section
        }
        return (content as Post).sermonNumber || null;
    };

    const sectionNumber = getSectionNumber();

    useEffect(() => {
        if (isOpen && sectionNumber) {
            fetchManuscripts();
        }
    }, [isOpen, sectionNumber]);

    const fetchManuscripts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await manuscriptsApi.getManuscriptsBySection(sectionNumber!);
            if (response.data && response.data.length > 0) {
                setManuscripts(response.data);
                setSelectedManuscript(response.data[0]);
                setCurrentPage(0);
            } else {
                setError('No manuscripts found for this section.');
            }
        } catch (err) {
            console.error('Error fetching manuscripts:', err);
            setError('Failed to load manuscripts. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    const handleZoomIn = () => {
        setZoom(prev => Math.min(200, prev + 25));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(50, prev - 25));
    };

    const toggleImageFullscreen = () => {
        setIsImageFullscreen(!isImageFullscreen);
    };

    const allPages = useMemo(() => {
        return manuscripts.flatMap(manuscript =>
            (manuscript.files || []).map(file => ({
                url: getManuscriptImageUrl(file.url),
                manuscript: manuscript,
                file: file
            }))
        );
    }, [manuscripts]);

    const currentPageData = useMemo(() => {
        if (currentPage < 0 || currentPage >= allPages.length) return null;
        return allPages[currentPage];
    }, [allPages, currentPage]);

    const currentPageUrl = currentPageData?.url || '';

    const displayedManuscript = currentPageData?.manuscript || selectedManuscript;

    const handleManuscriptChange = useCallback((manuscript: Manuscript) => {
        const firstPageIndex = allPages.findIndex(p => p.manuscript.id === manuscript.id);
        setSelectedManuscript(manuscript);
        if (firstPageIndex >= 0) {
            setCurrentPage(firstPageIndex);
        }
    }, [allPages]);

    const handlePrevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(allPages.length - 1, prev + 1));
    }, [allPages.length]);

    const handlePageClick = useCallback((index: number) => {
        setCurrentPage(index);
    }, []);

    const cleanArabicText = (text: string): string => {
        if (!text) return '';
        return text
            .replace(/<center>|<\/center>/gi, '')
            .replace(/<span[^>]*>|<\/span>/gi, '')
            .replace(/&nbsp;/gi, ' ')
            .trim();
    };

    // Helper function to get library/manuscript name
    const getManuscriptDisplayName = useCallback((ms: Manuscript): string => {
        if (ms.bookName) return ms.bookName;
        if (ms.library) return ms.library;
        // Try to infer from file names
        const firstFileName = ms.files?.[0]?.name?.toLowerCase() || '';
        if (firstFileName.includes("mar'ashi") || firstFileName.includes("marashi") || firstFileName.includes("qum_mar")) return "Mar'ashi MS";
        if (firstFileName.includes("shahrastan")) return "Shahrastani MS";
        if (firstFileName.includes("rampur")) return "Rampur Raza MS";
        return `Manuscript ${ms.id}`;
    }, []);

    // Sort paragraphs by number
    const sortedParagraphs = [...(content.paragraphs || [])].sort((a, b) => {
        const parseNumber = (num: string) => {
            return num.split('.').map(n => parseInt(n, 10));
        };
        const aNumbers = parseNumber(a.number);
        const bNumbers = parseNumber(b.number);
        for (let i = 0; i < Math.max(aNumbers.length, bNumbers.length); i++) {
            const aNum = aNumbers[i] || 0;
            const bNum = bNumbers[i] || 0;
            if (aNum !== bNum) {
                return aNum - bNum;
            }
        }
        return 0;
    });

    const allFootnotes = [
        ...(content.footnotes || []),
        ...((content.paragraphs || []).flatMap((p: any) => p.footnotes || []))
    ];

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2, ease: "easeOut" }
        }
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 50,
            transition: { duration: 0.2, ease: "easeOut" }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <motion.div
                        className="relative bg-white rounded-2xl shadow-2xl w-[95vw] h-[90vh] overflow-hidden flex flex-col"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#43896B]/10 rounded-lg">
                                    <Book className="w-5 h-5 text-[#43896B]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Compare Manuscripts</h3>
                                    <p className="text-sm text-gray-500">
                                        {content.heading}
                                        {!loading && manuscripts.length > 0 && (
                                            <span className="ml-2 text-[#43896B]">
                                                • {manuscripts.length} manuscript{manuscripts.length > 1 ? 's' : ''} available
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex overflow-hidden">
                            {loading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#43896B] mx-auto mb-3" />
                                        <p className="text-gray-600">Loading manuscripts...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center max-w-md">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">{error}</p>
                                        <button
                                            onClick={fetchManuscripts}
                                            className="px-4 py-2 bg-[#43896B] text-white rounded-lg hover:bg-[#367556] transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Fullscreen Image Overlay */}
                                    {isImageFullscreen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
                                            {/* Fullscreen Controls */}
                                            <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border-b border-white/20 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleZoomOut}
                                                        disabled={zoom <= 50}
                                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <ZoomOut className="w-4 h-4 text-white" />
                                                    </button>
                                                    <span className="text-sm font-medium text-white min-w-[50px] text-center">{zoom}%</span>
                                                    <button
                                                        onClick={handleZoomIn}
                                                        disabled={zoom >= 200}
                                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <ZoomIn className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={handlePrevPage}
                                                        disabled={currentPage === 0}
                                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-white text-sm font-medium"
                                                        aria-label="Previous page"
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                        <span>Previous</span>
                                                    </button>
                                                    <button
                                                        onClick={handleNextPage}
                                                        disabled={currentPage === allPages.length - 1}
                                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-white text-sm font-medium"
                                                        aria-label="Next page"
                                                    >
                                                        <span>Next</span>
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm text-white">
                                                        Page {currentPage + 1} of {allPages.length}
                                                    </div>
                                                    <button
                                                        onClick={toggleImageFullscreen}
                                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                        aria-label="Exit fullscreen"
                                                    >
                                                        <Minimize2 className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Fullscreen Image */}
                                            <div className="flex-1 overflow-auto p-4">
                                                {allPages.length > 0 ? (
                                                    currentPageUrl ? (
                                                        <div className="flex items-center justify-center min-h-full">
                                                            <img
                                                                key={`fullscreen-${currentPage}-${currentPageUrl}`}
                                                                src={currentPageUrl}
                                                                alt={`Manuscript page ${currentPage + 1}`}
                                                                className="max-w-full h-auto shadow-2xl rounded-lg transition-transform duration-300"
                                                                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <MissingPagePlaceholder pageNumber={currentPage + 1} className="text-white" />
                                                    )
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-white">
                                                        <p>No images available</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Fullscreen Page Navigation */}
                                            <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border-t border-white/20 flex items-center justify-center">
                                                <div className="flex gap-1 flex-wrap justify-center">
                                                    {allPages.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handlePageClick(idx)}
                                                            className={`w-2 h-2 rounded-full transition-colors ${currentPage === idx ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Left Column - Manuscript Viewer */}
                                    <div className="w-1/2 border-r border-gray-200 flex flex-col bg-gray-50">
                                        {/* Manuscript Selector */}
                                        {manuscripts.length > 0 && (
                                            <div className="px-4 py-3 border-b border-gray-200 bg-white">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Manuscript:</label>
                                                <Select
                                                    value={String(displayedManuscript?.id || '')}
                                                    onChange={(value) => {
                                                        const ms = manuscripts.find(m => m.id === parseInt(value));
                                                        if (ms) handleManuscriptChange(ms);
                                                    }}
                                                    options={manuscripts.map(ms => ({
                                                        value: String(ms.id),
                                                        label: `${getManuscriptDisplayName(ms)} ${ms.gregorianYear ? `- ${ms.gregorianYear}` : ''}`
                                                    }))}
                                                />
                                            </div>
                                        )}

                                        {/* Zoom Controls */}
                                        <div className="px-4 py-2 border-b border-gray-200 bg-white flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handleZoomOut}
                                                    disabled={zoom <= 50}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <ZoomOut className="w-4 h-4" />
                                                </button>
                                                <span className="text-sm font-medium text-gray-600 min-w-[50px] text-center">{zoom}%</span>
                                                <button
                                                    onClick={handleZoomIn}
                                                    disabled={zoom >= 200}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <ZoomIn className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={handlePrevPage}
                                                    disabled={currentPage === 0}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-700 text-sm font-medium"
                                                    aria-label="Previous page"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                    <span>Previous</span>
                                                </button>
                                                <button
                                                    onClick={handleNextPage}
                                                    disabled={currentPage === allPages.length - 1}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-700 text-sm font-medium"
                                                    aria-label="Next page"
                                                >
                                                    <span>Next</span>
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm text-gray-500">
                                                    Page {currentPage + 1} of {allPages.length}
                                                </div>
                                                <button
                                                    onClick={toggleImageFullscreen}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    aria-label={isImageFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
                                                >
                                                    {isImageFullscreen ? (
                                                        <Minimize2 className="w-4 h-4 text-gray-700" />
                                                    ) : (
                                                        <Maximize2 className="w-4 h-4 text-gray-700" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Manuscript Image */}
                                        <div className="flex-1 overflow-auto p-4">
                                            {allPages.length > 0 ? (
                                                currentPageUrl ? (
                                                    <div className="flex items-center justify-center min-h-full">
                                                        <img
                                                            key={`page-${currentPage}-${currentPageUrl}`}
                                                            src={currentPageUrl}
                                                            alt={`Manuscript page ${currentPage + 1}`}
                                                            className="max-w-full h-auto shadow-lg rounded-lg transition-transform duration-300"
                                                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <MissingPagePlaceholder pageNumber={currentPage + 1} />
                                                )
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    <p>No images available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Page Navigation */}
                                        <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-center justify-center">
                                            <div className="flex gap-1 flex-wrap justify-center">
                                                {allPages.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handlePageClick(idx)}
                                                        className={`w-2 h-2 rounded-full transition-colors ${currentPage === idx ? 'bg-[#43896B]' : 'bg-gray-300 hover:bg-gray-400'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Content */}
                                    <div className="w-1/2 flex flex-col bg-white">
                                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                            <h4 className="font-semibold text-gray-900">Content</h4>
                                            <p className="text-sm text-gray-500">Section {content.sermonNumber}</p>
                                        </div>
                                        <div className="flex-1 overflow-auto p-6">
                                            {/* Main title */}
                                            {content.title && (
                                                <div className="mb-6 pb-6 border-b border-gray-100">
                                                    <div className="text-right mb-4">
                                                        <p className="text-lg leading-relaxed text-gray-900 font-taha" dir="rtl">
                                                            {formatTextWithFootnotes(cleanArabicText(content.title), allFootnotes, true, content.sermonNumber || 'main')}
                                                        </p>
                                                    </div>
                                                    {content.translations?.find((t: { type: string; text: string }) => t.type === 'en') && (
                                                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                                            <p className="text-gray-700 font-brill leading-relaxed">
                                                                {formatTextWithFootnotes(
                                                                    content.translations!.find((t: { type: string; text: string }) => t.type === 'en')!.text,
                                                                    allFootnotes,
                                                                    false,
                                                                    sectionNumber || 'main'
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Paragraphs */}
                                            {sortedParagraphs.map((paragraph) => {
                                                const englishTranslation = paragraph.translations?.find((t: { type: string; text: string }) => t.type === 'en');
                                                return (
                                                    <div key={paragraph.id} className="mb-6 pb-6 border-b border-gray-100 last:border-b-0">
                                                        {paragraph.number && (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-[#43896B] bg-[#43896B]/10 rounded-full mb-2">
                                                                {paragraph.number}
                                                            </span>
                                                        )}
                                                        {paragraph.arabic && (
                                                            <div className="text-right mb-3">
                                                                <p className="text-lg leading-loose text-gray-900 font-taha" dir="rtl">
                                                                    {formatTextWithFootnotes(cleanArabicText(paragraph.arabic), allFootnotes, true, paragraph.number)}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {englishTranslation && (
                                                            <div className="bg-gray-50 rounded-lg p-4">
                                                                <p className="text-gray-700 font-brill leading-relaxed">
                                                                    {formatTextWithFootnotes(englishTranslation.text, allFootnotes, false, paragraph.number)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {sortedParagraphs.length === 0 && !content.title && (
                                                <div className="text-center py-12 text-gray-400">
                                                    <p>No content available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
