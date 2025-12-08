'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Loader2, FileText, Book } from 'lucide-react';
import { manuscriptsApi, Manuscript, getManuscriptImageUrl } from '@/api/manuscripts';
import { type Post } from '@/api/posts';
import { formatTextWithFootnotes } from '@/app/utils/text-formatting';

interface ManuscriptComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: Post;
    contentType: 'orations' | 'letters' | 'sayings';
}

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

    useEffect(() => {
        if (isOpen && content.sermonNumber) {
            fetchManuscripts();
        }
    }, [isOpen, content.sermonNumber]);

    const fetchManuscripts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await manuscriptsApi.getManuscriptsBySection(content.sermonNumber!);
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

    const handleManuscriptChange = (manuscript: Manuscript) => {
        setSelectedManuscript(manuscript);
        setCurrentPage(0);
    };

    // Get all pages from the selected manuscript
    const pages = selectedManuscript?.files?.map(file => getManuscriptImageUrl(file.url)) || [];

    // Clean Arabic text
    const cleanArabicText = (text: string): string => {
        if (!text) return '';
        return text
            .replace(/<center>|<\/center>/gi, '')
            .replace(/<span[^>]*>|<\/span>/gi, '')
            .replace(/&nbsp;/gi, ' ')
            .trim();
    };

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
        ...content.paragraphs.flatMap(p => p.footnotes || [])
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
                                    <p className="text-sm text-gray-500">{content.heading}</p>
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
                                    {/* Left Column - Manuscript Viewer */}
                                    <div className="w-1/2 border-r border-gray-200 flex flex-col bg-gray-50">
                                        {/* Manuscript Selector */}
                                        {manuscripts.length > 1 && (
                                            <div className="px-4 py-3 border-b border-gray-200 bg-white">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Manuscript:</label>
                                                <select
                                                    value={selectedManuscript?.id || ''}
                                                    onChange={(e) => {
                                                        const ms = manuscripts.find(m => m.id === parseInt(e.target.value));
                                                        if (ms) handleManuscriptChange(ms);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#43896B] focus:border-[#43896B]"
                                                >
                                                    {manuscripts.map(ms => (
                                                        <option key={ms.id} value={ms.id}>
                                                            {ms.bookName || `Manuscript ${ms.id}`} - {ms.gregorianYear || 'Unknown date'}
                                                        </option>
                                                    ))}
                                                </select>
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
                                            <div className="text-sm text-gray-500">
                                                Page {currentPage + 1} of {pages.length}
                                            </div>
                                        </div>

                                        {/* Manuscript Image */}
                                        <div className="flex-1 overflow-auto p-4">
                                            {pages.length > 0 ? (
                                                <div className="flex items-center justify-center min-h-full">
                                                    <img
                                                        src={pages[currentPage]}
                                                        alt={`Manuscript page ${currentPage + 1}`}
                                                        className="max-w-full h-auto shadow-lg rounded-lg transition-transform duration-300"
                                                        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    <p>No images available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Page Navigation */}
                                        <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-center justify-center">
                                            <div className="flex gap-1 flex-wrap justify-center">
                                                {pages.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentPage(idx)}
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
                                                    {content.translations?.find(t => t.type === 'en') && (
                                                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                                            <p className="text-gray-700 font-brill leading-relaxed">
                                                                {formatTextWithFootnotes(
                                                                    content.translations.find(t => t.type === 'en')!.text,
                                                                    allFootnotes,
                                                                    false,
                                                                    content.sermonNumber || 'main'
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Paragraphs */}
                                            {sortedParagraphs.map((paragraph) => {
                                                const englishTranslation = paragraph.translations?.find(t => t.type === 'en');
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
