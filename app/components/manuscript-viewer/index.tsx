'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, ChevronLeft, ChevronRight, Grid3x3, Image as ImageIcon, Loader2 } from 'lucide-react';

type ViewMode = 'single' | 'gallery';

interface ManuscriptViewerProps {
  pages: (string | null)[];
  bookName: string;
}

type ZoomPanHandle = {
  zoomIn: (clientX?: number, clientY?: number) => void;
  zoomOut: (clientX?: number, clientY?: number) => void;
  reset: () => void;
};

type ZoomPanImageProps = {
  src: string;
  alt: string;
  onZoomChange: (percent: number) => void;
  onLoadingChange?: (loading: boolean) => void;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const INITIAL_FIT_BOOST = 1.03;

const ZoomPanImage = React.forwardRef<ZoomPanHandle, ZoomPanImageProps>(({ src, alt, onZoomChange, onLoadingChange }, ref) => {
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
    startCenterX: number;
    startCenterY: number;
  }>({
    active: false,
    startDistance: 0,
    startScale: 1,
    startTx: 0,
    startTy: 0,
    startCenterX: 0,
    startCenterY: 0
  });

  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
  // Store imageSize together with the src it belongs to, so we never apply stale sizes
  const [imageSizeForSrc, setImageSizeForSrc] = useState<{ src: string; w: number; h: number } | null>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageSize = imageSizeForSrc?.src === src ? imageSizeForSrc : null;
  const totalScale = useMemo(() => baseScale * scale, [baseScale, scale]);

  const centerImage = useCallback(
    (nextBaseScale: number, nextScale: number, imgW: number, imgH: number, cW: number, cH: number) => {
      const nextTotalScale = nextBaseScale * nextScale;
      const x = (cW - imgW * nextTotalScale) / 2;
      const y = (cH - imgH * nextTotalScale) / 2;
      setTranslate({ x, y });
    },
    []
  );

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

  // When src changes: mark as not ready and signal loading
  useEffect(() => {
    setImageSizeForSrc(null);
    setBaseScale(1);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    onLoadingChange?.(true);
    const img = imgRef.current;
    if (!img || !img.complete) return;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (w > 0 && h > 0) {
      setImageSizeForSrc({ src, w, h });
    }
  }, [src, onLoadingChange]);

  // Once we have a valid imageSize for the *current* src, compute layout
  useEffect(() => {
    if (!imageSize) return;
    const { w: imgW, h: imgH } = imageSize;
    const { w: cW, h: cH } = containerSize;

    const fitWidth = cW / imgW;
    const fitHeight = cH / imgH;
    const nextBaseScale = (isFinite(fitWidth) && fitWidth > 0 && isFinite(fitHeight) && fitHeight > 0)
      ? clamp(Math.max(fitWidth, fitHeight) * INITIAL_FIT_BOOST, 0.01, 5)
      : 1;

    setBaseScale(nextBaseScale);
    setScale(1);
    centerImage(nextBaseScale, 1, imgW, imgH, cW, cH);
    onZoomChange(Math.round(nextBaseScale * 100));
    onLoadingChange?.(false);
  }, [imageSize, containerSize, centerImage, onLoadingChange, onZoomChange]);

  const setScaleAroundPoint = useCallback(
    (clientX: number, clientY: number, nextScale: number) => {
      const el = containerRef.current;
      if (!el || !imageSize) return;
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
    },
    [baseScale, imageSize, onZoomChange, totalScale, translate.x, translate.y]
  );

  const zoomIn = useCallback(
    (clientX?: number, clientY?: number) => {
      const next = clamp(scale * 1.25, 1, 8);
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setScaleAroundPoint(clientX ?? rect.left + rect.width / 2, clientY ?? rect.top + rect.height / 2, next);
    },
    [scale, setScaleAroundPoint]
  );

  const zoomOut = useCallback(
    (clientX?: number, clientY?: number) => {
      const next = clamp(scale / 1.25, 1, 8);
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setScaleAroundPoint(clientX ?? rect.left + rect.width / 2, clientY ?? rect.top + rect.height / 2, next);
    },
    [scale, setScaleAroundPoint]
  );

  const reset = useCallback(() => {
    if (!imageSize) return;
    setScale(1);
    onZoomChange(Math.round(baseScale * 100));
    centerImage(baseScale, 1, imageSize.w, imageSize.h, containerSize.w, containerSize.h);
  }, [baseScale, centerImage, containerSize, imageSize, onZoomChange]);

  React.useImperativeHandle(ref, () => ({ zoomIn, zoomOut, reset }), [reset, zoomIn, zoomOut]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.002);
      const next = clamp(scale * factor, 1, 8);
      setScaleAroundPoint(e.clientX, e.clientY, next);
    },
    [scale, setScaleAroundPoint]
  );

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
      const cx = (pts[0].x + pts[1].x) / 2;
      const cy = (pts[0].y + pts[1].y) / 2;
      pinchRef.current = {
        active: true,
        startDistance: dist,
        startScale: scale,
        startTx: translate.x,
        startTy: translate.y,
        startCenterX: cx,
        startCenterY: cy
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

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const cursorClass = scale > 1 ? 'cursor-grab' : 'cursor-zoom-in';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${cursorClass}`}
      style={{ touchAction: 'none' }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={onContextMenu}
    >
      <div
        className="absolute top-0 left-0 will-change-transform"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${totalScale})`,
          transformOrigin: '0 0',
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
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            // Tag the measurement with the src so stale loads are ignored
            setImageSizeForSrc({ src, w, h });
          }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = '/file.svg';
            onLoadingChange?.(false);
          }}
        />
      </div>
    </div>
  );
});

ZoomPanImage.displayName = 'ZoomPanImage';

const MissingPagePlaceholder: React.FC<{ pageNumber: number }> = ({ pageNumber }) => (
  <div className="flex items-center justify-center bg-gray-100 min-h-[400px] lg:min-h-[600px] rounded-lg">
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

const ManuscriptViewer: React.FC<ManuscriptViewerProps> = ({ pages, bookName }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const zoomPanRef = useRef<ZoomPanHandle | null>(null);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
  };

  const handleZoomIn = () => {
    zoomPanRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    zoomPanRef.current?.zoomOut();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => prev === 'single' ? 'gallery' : 'single');
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentPage(index);
    if (viewMode === 'gallery') {
      setViewMode('single');
    }
  };

  useEffect(() => {
    zoomPanRef.current?.reset();
    setZoom(100);
  }, [currentPage]);

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleExpand}
        />
      )}

      <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'fixed inset-4 z-50 animate-expand' : 'relative'
        }`}
        style={{
          transform: isExpanded ? 'scale(1)' : 'scale(1)',
          opacity: isExpanded ? 1 : 1
        }}>
        <div className="bg-[#F5F6FA] border-b border-[#E2E3E9] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 100}
              className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-gray-700" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 800}
              className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleViewMode}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${viewMode === 'gallery' ? 'bg-[#43896B] text-white' : 'hover:bg-white text-gray-700'
                }`}
              aria-label={viewMode === 'gallery' ? 'Single page view' : 'Gallery view'}
            >
              {viewMode === 'gallery' ? <ImageIcon className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleExpand}
              className="cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"
              aria-label={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? (
                <Minimize2 className="w-5 h-5 text-gray-700" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row h-full">
          <div className="lg:w-24 bg-[#F5F6FA] border-b lg:border-b-0 lg:border-r border-[#E2E3E9] p-2 overflow-y-auto">
            <div className="flex lg:flex-col gap-2">
              {pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentPage === index
                      ? 'border-[#43896B] shadow-md'
                      : 'border-transparent hover:border-gray-300'
                    }`}
                  aria-label={`Page ${index + 1}`}
                >
                  {page ? (
                    <img
                      src={page}
                      alt={`Page ${index + 1} thumbnail`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/file.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {viewMode === 'single' ? (
              pages[currentPage] ? (
                <div className="flex items-center justify-center min-h-[400px] lg:min-h-[600px] p-4">
                  <div className="relative bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-none h-[80vh] lg:h-[85vh]">
                    <ZoomPanImage
                      key={currentPage}
                      ref={zoomPanRef}
                      src={pages[currentPage]}
                      alt={`${bookName} - Page ${currentPage + 1}`}
                      onZoomChange={setZoom}
                      onLoadingChange={setIsImageLoading}
                    />
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm">
                          <Loader2 className="w-4 h-4 animate-spin text-[#43896B]" />
                          <span className="text-sm font-semibold text-gray-700">Loading image...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <MissingPagePlaceholder pageNumber={currentPage + 1} />
              )
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {pages.map((page, index) => (
                  <div
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className="relative group rounded-lg overflow-hidden transition-all cursor-pointer bg-gray-100"
                  >
                    {page ? (
                      <>
                        <img
                          src={page}
                          alt={`${bookName} - Page ${index + 1}`}
                          className="w-full h-auto block"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/file.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center pointer-events-none">
                          <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                            Page {index + 1}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="aspect-[3/4] flex items-center justify-center bg-gray-200">
                        <div className="text-center p-4">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-xs text-gray-500 font-medium">Page {index + 1}</p>
                          <p className="text-xs text-gray-400">Missing</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {viewMode === 'single' && (
          <div className="bg-[#F5F6FA] border-t border-[#E2E3E9] px-4 py-3 flex items-center justify-between">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Previous</span>
            </button>

            <div className="text-sm font-medium text-gray-700">
              Page {currentPage + 1} of {pages.length}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === pages.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <span className="text-sm font-medium">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ManuscriptViewer;
