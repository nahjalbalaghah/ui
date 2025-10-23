'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import './pdf-viewer.css'

const usePDF = () => {
  const [pdfComponents, setPdfComponents] = useState<any>(null)

  useEffect(() => {
    const loadPDF = async () => {
      const pdfjs = await import('pdfjs-dist')
      const { Document, Page } = await import('react-pdf')
      
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
      
      setPdfComponents({ Document, Page, pdfjs })
    }
    
    loadPDF()
  }, [])

  return pdfComponents
}

interface PDFViewerProps {
  pdfUrl: string
  title?: string
}

export default function PDFViewer({ pdfUrl, title = 'PDF Document' }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [pageWidth, setPageWidth] = useState<number | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const pdfComponents = usePDF()

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        setPageWidth(containerWidth - 16)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [isFullscreen])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const actualWidth = pageWidth ? pageWidth * scale : undefined

  if (!pdfComponents) {
    return (
      <div className="flex items-center justify-center h-[800px] bg-gray-100">
        <div className="text-[#43896B] text-lg">Loading PDF viewer...</div>
      </div>
    )
  }

  const { Document, Page } = pdfComponents

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <div className="bg-gradient-to-r from-[#43896B] to-[#357a5e] text-white px-2 sm:px-4 py-3 flex items-center justify-between rounded-t-xl sticky top-0 z-10">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-xs sm:text-sm font-medium px-1 sm:px-3 whitespace-nowrap">
            Page {pageNumber} of {numPages || '...'}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-xs sm:text-sm font-medium px-1 sm:px-2 whitespace-nowrap">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.5}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-4 sm:h-6 bg-white/30 mx-1 sm:mx-2"></div>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
      <div 
        ref={containerRef}
        className={`bg-gray-100 overflow-auto ${isFullscreen ? 'h-[calc(100vh-60px)]' : 'h-[500px] sm:h-[740px]'}`}
      >
        <div className="flex justify-center items-start min-h-full p-1 sm:p-2">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-64">
                <div className="text-[#43896B] text-lg">Loading PDF...</div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-64">
                <div className="text-red-600 text-lg">Failed to load PDF. Please try again.</div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={actualWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl max-w-full"
            />
          </Document>
        </div>
      </div>
    </div>
  )
}
