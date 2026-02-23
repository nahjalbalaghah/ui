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
    const [viewMode, setViewMode] = useState<'content' | 'comparison'>('content');
    const [secondManuscript, setSecondManuscript] = useState<Manuscript | null>(null);
    const [secondPage, setSecondPage] = useState(0);

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
                if (response.data.length > 1) {
                    setSecondManuscript(response.data[1]);
                } else {
                    setSecondManuscript(response.data[0]);
                }
                setCurrentPage(0);
                setSecondPage(0);
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
        if (!selectedManuscript) return [];
        return (selectedManuscript.files || []).map(file => ({
            url: getManuscriptImageUrl(file.url),
            manuscript: selectedManuscript,
            file: file
        }));
    }, [selectedManuscript]);

    const secondManuscriptPages = useMemo(() => {
        if (!secondManuscript) return [];
        return (secondManuscript.files || []).map(file => ({
            url: getManuscriptImageUrl(file.url),
            manuscript: secondManuscript,
            file: file
        }));
    }, [secondManuscript]);

    const currentPageData = useMemo(() => {
        if (currentPage < 0 || currentPage >= allPages.length) return null;
        return allPages[currentPage];
    }, [allPages, currentPage]);

    const currentPageUrl = currentPageData?.url || '';
    const secondPageUrl = secondManuscriptPages[secondPage]?.url || '';

    const displayedManuscript = selectedManuscript;

    const handleManuscriptChange = useCallback((manuscript: Manuscript) => {
        setSelectedManuscript(manuscript);
        setCurrentPage(0);
    }, []);

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
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#43896B]/10 rounded-lg">
                                        <Book className="w-5 h-5 text-[#43896B]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Manuscript Study</h3>
                                        <p className="text-sm text-gray-500">Section {content.sermonNumber}</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-gray-300" />
                                <div className="flex bg-gray-200 p-1 rounded-xl">
                                    <button
                                        onClick={() => setViewMode('content')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'content' ? 'bg-white text-[#43896B] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Manuscript & Content
                                    </button>
                                    <button
                                        onClick={() => setViewMode('comparison')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'comparison' ? 'bg-white text-[#43896B] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Compare Two Manuscripts
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
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
                                    {/* Left Column - Manuscript 1 Viewer */}
                                    <div className={`${viewMode === 'content' ? 'w-1/2' : 'flex-1'} border-r border-gray-200 flex flex-col bg-gray-50`}>
                                        <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center bg-linear-to-r from-[#43896B]/5 to-transparent shrink-0">
                                            <div className="flex-1 max-w-[250px]">
                                                <Select
                                                    value={String(selectedManuscript?.id || '')}
                                                    onChange={(value) => {
                                                        const ms = manuscripts.find(m => m.id === parseInt(value));
                                                        if (ms) handleManuscriptChange(ms);
                                                    }}
                                                    options={manuscripts.map(ms => ({
                                                        value: String(ms.id),
                                                        label: getManuscriptDisplayName(ms)
                                                    }))}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={handleZoomOut} disabled={zoom <= 50} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ZoomOut className="w-4 h-4" /></button>
                                                <span className="text-xs font-bold text-gray-500 w-10 text-center">{zoom}%</span>
                                                <button onClick={handleZoomIn} disabled={zoom >= 200} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ZoomIn className="w-4 h-4" /></button>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={handlePrevPage} disabled={currentPage === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                                                <span className="text-xs font-bold text-gray-500">P{currentPage + 1}</span>
                                                <button onClick={handleNextPage} disabled={currentPage === allPages.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-auto p-4 bg-gray-900/5 custom-scrollbar">
                                            {currentPageUrl ? (
                                                <div className="flex items-center justify-center min-h-full">
                                                    <img
                                                        src={currentPageUrl}
                                                        alt="Manuscript 1"
                                                        className="max-w-full h-auto shadow-2xl rounded-lg transition-transform cursor-zoom-in"
                                                        onDoubleClick={() => setZoom(prev => prev > 100 ? 100 : 175)}
                                                        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                                                    />
                                                </div>
                                            ) : <MissingPagePlaceholder pageNumber={currentPage + 1} />}
                                        </div>
                                    </div>

                                    {/* Right Column - Content or Manuscript 2 */}
                                    <div className={`${viewMode === 'content' ? 'w-1/2' : 'flex-1'} flex flex-col bg-white overflow-hidden`}>
                                        {viewMode === 'content' ? (
                                            <div className="flex flex-col h-full">
                                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-[#43896B]" />
                                                        Normalized Content
                                                    </h4>
                                                </div>
                                                <div className="flex-1 overflow-auto p-8 space-y-10 custom-scrollbar">
                                                    {content.title && (
                                                        <div className="mb-8 pb-8 border-b border-gray-100">
                                                            <div className="text-right">
                                                                <p className="text-2xl leading-loose text-gray-900 font-taha italic" dir="rtl">
                                                                    {formatTextWithFootnotes(cleanArabicText(content.title), allFootnotes, true, content.sermonNumber || 'main')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {sortedParagraphs.map((paragraph) => (
                                                        <div key={paragraph.id} className="space-y-6">
                                                            <div className="flex items-center gap-3">
                                                                <span className="px-2 py-0.5 bg-[#43896B]/10 text-[#43896B] rounded-md text-xs font-bold ring-1 ring-[#43896B]/20">
                                                                    {paragraph.number}
                                                                </span>
                                                                <div className="h-px flex-1 bg-gray-100" />
                                                            </div>
                                                            {paragraph.arabic && (
                                                                <div className="text-right">
                                                                    <p className="text-xl leading-loose text-gray-900 font-taha" dir="rtl">
                                                                        {formatTextWithFootnotes(cleanArabicText(paragraph.arabic), allFootnotes, true, paragraph.number)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {paragraph.translations?.find((t: any) => t.type === 'en') && (
                                                                <div className="border-l-4 border-gray-100 pl-6 py-2">
                                                                    <p className="text-lg text-gray-700 font-brill leading-relaxed">
                                                                        {formatTextWithFootnotes(paragraph.translations.find((t: any) => t.type === 'en').text, allFootnotes, false, paragraph.number)}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200">
                                                <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center bg-linear-to-l from-[#43896B]/5 to-transparent shrink-0">
                                                    <div className="flex-1 max-w-[250px]">
                                                        <Select
                                                            value={String(secondManuscript?.id || '')}
                                                            onChange={(value) => {
                                                                const ms = manuscripts.find(m => m.id === parseInt(value));
                                                                if (ms) {
                                                                    setSecondManuscript(ms);
                                                                    setSecondPage(0);
                                                                }
                                                            }}
                                                            options={manuscripts.map(ms => ({
                                                                value: String(ms.id),
                                                                label: getManuscriptDisplayName(ms)
                                                            }))}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button onClick={() => setSecondPage(p => Math.max(0, p - 1))} disabled={secondPage === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                                                        <span className="text-xs font-bold text-gray-500">P{secondPage + 1}</span>
                                                        <button onClick={() => setSecondPage(p => Math.min(secondManuscriptPages.length - 1, p + 1))} disabled={secondPage === secondManuscriptPages.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-auto p-4 bg-gray-900/5 custom-scrollbar">
                                                    {secondPageUrl ? (
                                                        <div className="flex items-center justify-center min-h-full">
                                                            <img
                                                                src={secondPageUrl}
                                                                alt="Manuscript 2"
                                                                className="max-w-full h-auto shadow-2xl rounded-lg transition-transform cursor-zoom-in"
                                                                onDoubleClick={() => setZoom(prev => prev > 100 ? 100 : 175)}
                                                                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                                                            />
                                                        </div>
                                                    ) : <MissingPagePlaceholder pageNumber={secondPage + 1} />}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )
                            }</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
