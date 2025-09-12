import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Footnote } from '@/api/orations';

interface FootnoteTooltipProps {
  children: React.ReactNode;
  footnote: Footnote;
  className?: string;
  matchedLanguage?: 'english' | 'arabic';
}

let tooltipZIndexCounter = 2147483600;

export const FootnoteTooltip: React.FC<FootnoteTooltipProps> = ({ 
  children, 
  footnote, 
  className = '',
  matchedLanguage = 'english'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [uniqueZIndex] = useState(() => ++tooltipZIndexCounter);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log(`FootnoteTooltip created for footnote ${footnote.number}:`, {
    english_word: footnote.english_word,
    arabic_word: footnote.arabic_word,
    section: footnote.section,
    uniqueZIndex: uniqueZIndex,
    hasTranslation: !!footnote.english_translation,
    hasInterpretation: !!footnote.arabic_interpretation
  });

  const updatePosition = () => {
    if (triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      
      console.log(`Footnote ${footnote.number} positioning debug:`, {
        triggerRect: {
          top: triggerRect.top,
          left: triggerRect.left,
          bottom: triggerRect.bottom,
          right: triggerRect.right,
          width: triggerRect.width,
          height: triggerRect.height
        },
        windowScroll: {
          scrollX: window.scrollX,
          scrollY: window.scrollY
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        word: footnote.english_word
      });
      
      if (triggerRect.width === 0 && triggerRect.height === 0) {
        console.warn(`Footnote ${footnote.number}: Invalid triggerRect`);
        return;
      }
      
      let top = triggerRect.bottom + 8;
      let left = triggerRect.left;
      
      const tooltipWidth = 300;
      const tooltipHeight = 150;
      
      if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 16;
      }
      if (left < 16) {
        left = 16;
      }
      
      if (top + tooltipHeight > window.innerHeight) {
        top = triggerRect.top - tooltipHeight - 8;
      }
      if (top < 16) {
        top = 16;
      }
      
      console.log(`Footnote ${footnote.number} final viewport position:`, { top, left });
      setPosition({ top, left });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (mounted && isVisible) {
      const timer = setTimeout(() => {
        updatePosition();
        
        const handleScroll = () => updatePosition();
        const handleResize = () => updatePosition();
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        };
      }, 50);
      
      return () => {
        clearTimeout(timer);
        if (cleanup) {
          cleanup();
        }
      };
    }
  }, [mounted, isVisible]);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
    setHasBeenVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const handleTooltipMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleTooltipMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const hasContent = footnote.english_translation || footnote.arabic_interpretation;

  if (!hasContent) {
    return (
      <span className={`footnote-marker ${className}`}>
        {children}
      </span>
    );
  }

  const shouldShowTooltip = mounted && isVisible && position.top > 0 && position.left >= 0;
  
  const tooltipContent = shouldShowTooltip ? (
    <div
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: uniqueZIndex,
        position: 'fixed',
        pointerEvents: 'auto',
      }}
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
    >
      <div className="text-xs mb-2 font-semibold text-[#43896B] border-b border-gray-200 pb-2">
        Footnote {footnote.number}
      </div>
      {matchedLanguage === 'english' && footnote.english_translation && (
        <div className="text-sm mb-2 leading-relaxed text-gray-800">
          {footnote.english_translation}
        </div>
      )}
      {matchedLanguage === 'arabic' && footnote.arabic_interpretation && (
        <div className="text-sm text-right mb-2 leading-relaxed text-gray-800" dir="rtl">
          {footnote.arabic_interpretation}
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        className={`footnote-marker cursor-help border-b border-[#43896B] transition-colors ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'relative' }}
      >
        {children}
      </span>
      {mounted && tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
};