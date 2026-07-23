'use client';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Loader2, FileText, Book, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { librariesApi, Library, manuscriptsApi, Manuscript, getManuscriptImageUrl, manuscriptMatchesLibrary } from '@/api/manuscripts';
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

type ZoomPanHandle = {
    zoomIn: (clientX?: number, clientY?: number) => void;
    zoomOut: (clientX?: number, clientY?: number) => void;
    reset: () => void;
};

type ZoomPanImageProps = {
    src: string;
    alt: string;
    onZoomChange: (percent: number) => void;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const INITIAL_FIT_BOOST = 1.03;

const ZoomPanImage = React.forwardRef<ZoomPanHandle, ZoomPanImageProps>(({ src, alt, onZoomChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const pointersRef = useRef(new Map<number, { x: number; y: number }>());
    const dragRef = useRef<{ active: boolean; startX: number; startY: number; startTx: number; startTy: number; moved: boolean }>({
        active: false,
        startX: 0,
        startY: 0,
        startTx: 0,
        startTy: 0,
        moved: false
    });
    const pinchRef = useRef<{
        active: boolean;
        startDistance: number;
        startScale: number;
        startTx: number;
        startTy: number;
    }>({
        active: false,
        startDistance: 0,
        startScale: 1,
        startTx: 0,
        startTy: 0
    });

    const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
    const [imageSize, setImageSize] = useState<{ w: number; h: number } | null>(null);
    const [baseScale, setBaseScale] = useState(1);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const totalScale = useMemo(() => baseScale * scale, [baseScale, scale]);

    const updateContainerSize = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setContainerSize({ w: Math.max(1, rect.width), h: Math.max(1, rect.height) });
    }, []);

    useEffect(() => {
        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);
        return () => window.removeEventListener('resize', updateContainerSize);
    }, [updateContainerSize]);

    useEffect(() => {
        setImageSize(null);
        setBaseScale(1);
        setScale(1);
        setTranslate({ x: 0, y: 0 });
        const img = imgRef.current;
        if (!img || !img.complete) return;
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (w > 0 && h > 0) {
            setImageSize({ w, h });
        }
    }, [src]);

    const centerImage = useCallback((nextBaseScale: number, nextScale: number) => {
        if (!imageSize) return;
        const nextTotal = nextBaseScale * nextScale;
        const x = (containerSize.w - imageSize.w * nextTotal) / 2;
        const y = (containerSize.h - imageSize.h * nextTotal) / 2;
        setTranslate({ x, y });
    }, [containerSize.h, containerSize.w, imageSize]);

    useEffect(() => {
        if (!imageSize) return;
        const fitWidth = containerSize.w / imageSize.w;
        const fitHeight = containerSize.h / imageSize.h;
        const nextBase = (isFinite(fitWidth) && fitWidth > 0 && isFinite(fitHeight) && fitHeight > 0)
            ? clamp(Math.max(fitWidth, fitHeight) * INITIAL_FIT_BOOST, 0.01, 5)
            : 1;
        setBaseScale(nextBase);
        setScale(1);
        centerImage(nextBase, 1);
        onZoomChange(Math.round(nextBase * 100));
    }, [centerImage, containerSize.h, containerSize.w, imageSize, onZoomChange, src]);

    const setScaleAroundPoint = useCallback((clientX: number, clientY: number, nextScale: number) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = clamp(clientX - rect.left, 0, rect.width);
        const py = clamp(clientY - rect.top, 0, rect.height);

        const startTotal = totalScale;
        const nextTotal = baseScale * nextScale;
        const contentX = (px - translate.x) / startTotal;
        const contentY = (py - translate.y) / startTotal;
        const nextTx = px - contentX * nextTotal;
        const nextTy = py - contentY * nextTotal;

        setScale(nextScale);
        setTranslate({ x: nextTx, y: nextTy });
        onZoomChange(Math.round(nextTotal * 100));
    }, [baseScale, onZoomChange, totalScale, translate.x, translate.y]);

    const zoomIn = useCallback((clientX?: number, clientY?: number) => {
        const next = clamp(scale * 1.25, 1, 8);
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setScaleAroundPoint(clientX ?? rect.left + rect.width / 2, clientY ?? rect.top + rect.height / 2, next);
    }, [scale, setScaleAroundPoint]);

    const zoomOut = useCallback((clientX?: number, clientY?: number) => {
        const next = clamp(scale / 1.25, 1, 8);
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setScaleAroundPoint(clientX ?? rect.left + rect.width / 2, clientY ?? rect.top + rect.height / 2, next);
    }, [scale, setScaleAroundPoint]);

    const reset = useCallback(() => {
        setScale(1);
        onZoomChange(Math.round(baseScale * 100));
        centerImage(baseScale, 1);
    }, [baseScale, centerImage, onZoomChange]);

    React.useImperativeHandle(ref, () => ({ zoomIn, zoomOut, reset }), [reset, zoomIn, zoomOut]);

    const onWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const factor = Math.exp(-e.deltaY * 0.002);
        const next = clamp(scale * factor, 1, 8);
        setScaleAroundPoint(e.clientX, e.clientY, next);
    }, [scale, setScaleAroundPoint]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (e.button === 1) return;
        const el = containerRef.current;
        if (!el) return;
        el.setPointerCapture(e.pointerId);
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pointersRef.current.size === 1) {
            dragRef.current = {
                active: true,
                startX: e.clientX,
                startY: e.clientY,
                startTx: translate.x,
                startTy: translate.y,
                moved: false
            };
            pinchRef.current.active = false;
        }

        if (pointersRef.current.size === 2) {
            const pts = Array.from(pointersRef.current.values());
            const dx = pts[0].x - pts[1].x;
            const dy = pts[0].y - pts[1].y;
            const dist = Math.hypot(dx, dy);
            pinchRef.current = {
                active: true,
                startDistance: dist,
                startScale: scale,
                startTx: translate.x,
                startTy: translate.y
            };
            dragRef.current.active = false;
        }
    }, [scale, translate.x, translate.y]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!pointersRef.current.has(e.pointerId)) return;
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pinchRef.current.active && pointersRef.current.size >= 2) {
            const pts = Array.from(pointersRef.current.values());
            const dx = pts[0].x - pts[1].x;
            const dy = pts[0].y - pts[1].y;
            const dist = Math.hypot(dx, dy);
            const cx = (pts[0].x + pts[1].x) / 2;
            const cy = (pts[0].y + pts[1].y) / 2;

            const startTotal = baseScale * pinchRef.current.startScale;
            const contentX = (cx - pinchRef.current.startTx) / startTotal;
            const contentY = (cy - pinchRef.current.startTy) / startTotal;

            const ratio = pinchRef.current.startDistance > 0 ? dist / pinchRef.current.startDistance : 1;
            const nextScale = clamp(pinchRef.current.startScale * ratio, 1, 8);
            const nextTotal = baseScale * nextScale;
            const nextTx = cx - contentX * nextTotal;
            const nextTy = cy - contentY * nextTotal;

            setScale(nextScale);
            setTranslate({ x: nextTx, y: nextTy });
            onZoomChange(Math.round(nextTotal * 100));
            return;
        }

        if (!dragRef.current.active) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
            dragRef.current.moved = true;
        }
        if (scale === 1) return;
        setTranslate({ x: dragRef.current.startTx + dx, y: dragRef.current.startTy + dy });
    }, [baseScale, onZoomChange, scale]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        pointersRef.current.delete(e.pointerId);
        const wasMoved = dragRef.current.moved;

        if (pointersRef.current.size < 2) {
            pinchRef.current.active = false;
        }
        if (pointersRef.current.size === 0) {
            dragRef.current.active = false;
        }

        if (wasMoved) return;
        if (e.button === 0) {
            zoomIn(e.clientX, e.clientY);
        } else if (e.button === 2) {
            zoomOut(e.clientX, e.clientY);
        }
    }, [zoomIn, zoomOut]);

    const onPointerCancel = useCallback((e: React.PointerEvent) => {
        pointersRef.current.delete(e.pointerId);
        dragRef.current.active = false;
        pinchRef.current.active = false;
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden ${scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'}`}
            style={{ touchAction: 'none' }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div
                className="absolute top-0 left-0 will-change-transform"
                style={{
                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${totalScale})`,
                    transformOrigin: '0 0'
                }}
            >
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className="block max-w-none select-none"
                    draggable={false}
                    onLoad={(e) => {
                        const img = e.currentTarget;
                        setImageSize({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
                    }}
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/file.svg';
                    }}
                />
            </div>
        </div>
    );
});

ZoomPanImage.displayName = 'ZoomPanImage';

export default function ManuscriptComparisonModal({
    isOpen,
    onClose,
    content,
    contentType
}: ManuscriptComparisonModalProps) {
    const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [selectedLibraryName, setSelectedLibraryName] = useState<string>('');
    const [secondLibraryName, setSecondLibraryName] = useState<string>('');
    const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [zoom, setZoom] = useState(100);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isImageFullscreen, setIsImageFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState<'content' | 'comparison'>('content');
    const [secondManuscript, setSecondManuscript] = useState<Manuscript | null>(null);
    const [secondPage, setSecondPage] = useState(0);
    const zoomPanLeftRef = useRef<ZoomPanHandle | null>(null);
    const zoomPanRightRef = useRef<ZoomPanHandle | null>(null);

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

    const inferLibraryNameForManuscript = useCallback((manuscript: Manuscript, availableLibraries: Library[]): string | null => {
        return availableLibraries.find(library => manuscriptMatchesLibrary(manuscript, library))?.name || null;
    }, []);

    const fetchManuscripts = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchAllLibraries = async (): Promise<Library[]> => {
                const first = await librariesApi.getAllLibraries(1, 100);
                let all = first.data || [];
                const totalPages = first.meta?.pagination?.pageCount || 1;

                if (totalPages > 1) {
                    const rest = [];
                    for (let page = 2; page <= totalPages; page++) {
                        rest.push(librariesApi.getAllLibraries(page, 100));
                    }
                    const responses = await Promise.all(rest);
                    for (const resp of responses) {
                        if (resp.data) {
                            all = [...all, ...resp.data];
                        }
                    }
                }

                return all;
            };

            const [fetchedLibraries, manuscriptsResponse] = await Promise.all([
                fetchAllLibraries(),
                manuscriptsApi.getManuscriptsBySection(sectionNumber!)
            ]);

            setLibraries(fetchedLibraries);

            const fetchedManuscripts = manuscriptsResponse.data || [];
            const manuscriptsWithLibraryNames = fetchedManuscripts.filter(m => inferLibraryNameForManuscript(m, fetchedLibraries));

            if (manuscriptsWithLibraryNames.length > 0) {
                setManuscripts(manuscriptsWithLibraryNames);

                const uniqueLibraryNames = Array.from(new Set(manuscriptsWithLibraryNames.map(m => inferLibraryNameForManuscript(m, fetchedLibraries)).filter(Boolean) as string[]));
                const firstLibraryName = uniqueLibraryNames[0] || '';
                const secondName = uniqueLibraryNames[1] || firstLibraryName;

                setSelectedLibraryName(firstLibraryName);
                setSecondLibraryName(secondName);

                const firstManuscript = manuscriptsWithLibraryNames.find(m => inferLibraryNameForManuscript(m, fetchedLibraries) === firstLibraryName) || null;
                const secondSelected = manuscriptsWithLibraryNames.find(m => inferLibraryNameForManuscript(m, fetchedLibraries) === secondName) || firstManuscript;

                setSelectedManuscript(firstManuscript);
                setSecondManuscript(secondSelected);
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
        zoomPanLeftRef.current?.zoomIn();
        zoomPanRightRef.current?.zoomIn();
    };

    const handleZoomOut = () => {
        zoomPanLeftRef.current?.zoomOut();
        zoomPanRightRef.current?.zoomOut();
    };

    const toggleImageFullscreen = () => {
        setIsImageFullscreen(!isImageFullscreen);
    };

    useEffect(() => {
        zoomPanLeftRef.current?.reset();
        setZoom(100);
    }, [selectedManuscript, currentPage]);

    useEffect(() => {
        zoomPanRightRef.current?.reset();
    }, [secondManuscript, secondPage]);

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

    const availableLibraryOptions = useMemo(() => {
        const uniqueNames = Array.from(new Set(libraries.map(l => l.name).filter(Boolean)));
        uniqueNames.sort((a, b) => a.localeCompare(b));
        return uniqueNames.map(name => ({ value: name, label: name }));
    }, [libraries]);

    const handleLibraryChange = useCallback((libraryName: string) => {
        setSelectedLibraryName(libraryName);
        const ms = manuscripts.find(m => inferLibraryNameForManuscript(m, libraries) === libraryName) || null;
        setSelectedManuscript(ms);
        setCurrentPage(0);
    }, [inferLibraryNameForManuscript, libraries, manuscripts]);

    const handleSecondLibraryChange = useCallback((libraryName: string) => {
        setSecondLibraryName(libraryName);
        const ms = manuscripts.find(m => inferLibraryNameForManuscript(m, libraries) === libraryName) || null;
        setSecondManuscript(ms);
        setSecondPage(0);
    }, [inferLibraryNameForManuscript, libraries, manuscripts]);

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
                                                    value={selectedLibraryName}
                                                    onChange={handleLibraryChange}
                                                    options={availableLibraryOptions}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={handleZoomOut} disabled={zoom <= 100} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ZoomOut className="w-4 h-4" /></button>
                                                <span className="text-xs font-bold text-gray-500 w-10 text-center">{zoom}%</span>
                                                <button onClick={handleZoomIn} disabled={zoom >= 800} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ZoomIn className="w-4 h-4" /></button>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={handlePrevPage} disabled={currentPage === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                                                <span className="text-xs font-bold text-gray-500">P{currentPage + 1}</span>
                                                <button onClick={handleNextPage} disabled={currentPage === allPages.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-hidden p-4 bg-gray-900/5 custom-scrollbar">
                                            {currentPageUrl ? (
                                                <div className="w-full h-full bg-white shadow-2xl rounded-lg overflow-hidden">
                                                    <ZoomPanImage
                                                        key={`${selectedManuscript?.id || 'm1'}-${currentPage}`}
                                                        ref={zoomPanLeftRef}
                                                        src={currentPageUrl}
                                                        alt="Manuscript 1"
                                                        onZoomChange={setZoom}
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
                                                            value={secondLibraryName}
                                                            onChange={handleSecondLibraryChange}
                                                            options={availableLibraryOptions}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button onClick={() => setSecondPage(p => Math.max(0, p - 1))} disabled={secondPage === 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                                                        <span className="text-xs font-bold text-gray-500">P{secondPage + 1}</span>
                                                        <button onClick={() => setSecondPage(p => Math.min(secondManuscriptPages.length - 1, p + 1))} disabled={secondPage === secondManuscriptPages.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                                <div className="flex-1 overflow-hidden p-4 bg-gray-900/5 custom-scrollbar">
                                                    {secondPageUrl ? (
                                                        <div className="w-full h-full bg-white shadow-2xl rounded-lg overflow-hidden">
                                                            <ZoomPanImage
                                                                key={`${secondManuscript?.id || 'm2'}-${secondPage}`}
                                                                ref={zoomPanRightRef}
                                                                src={secondPageUrl}
                                                                alt="Manuscript 2"
                                                                onZoomChange={setZoom}
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
