'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, ArrowRight, Loader2 } from 'lucide-react';
import {
  parseTextReference,
  getContentTypeName,
  getTextRefTypeColor,
} from '@/app/utils/text-reference';
import { orationsApi, lettersApi, sayingsApi } from '@/api/posts';

interface TextRefChipProps {
  textRef: string;
  variant?: 'default' | 'inline';
  showIcon?: boolean;
  showLabel?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  englishWord?: string;
  arabicWord?: string;
}

/**
 * Clickable chip component for text references
 * Handles parsing, routing, and highlighting on detail pages
 */
export default function TextRefChip({
  textRef,
  variant = 'default',
  showIcon = true,
  showLabel = false,
  onClick,
  englishWord,
  arabicWord,
}: TextRefChipProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const parsed = useMemo(() => parseTextReference(textRef), [textRef]);

  if (!parsed) {
    // Fallback if reference cannot be parsed
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
        {showIcon && <Book className="w-3 h-3" />}
        {textRef}
      </span>
    );
  }

  const contentTypeName = getContentTypeName(parsed.type);
  const colorClass = getTextRefTypeColor(parsed.type);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(e);
      return;
    }

    try {
      setIsLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.set('highlightRef', parsed.number);
      
      if (englishWord) {
        queryParams.set('word', englishWord);
      }
      if (arabicWord) {
        queryParams.set('arabicWord', arabicWord);
      }

      // For introduction (radis), navigate directly
      if (parsed.type === 'introduction') {
        router.push(`/radis?${queryParams.toString()}`);
        return;
      }

      // Try different sermon/paragraph number formats
      // Format 1: Just the first part (26 from 26.1)
      let sermonNumber = parsed.sectionNumber.split('.')[0];
      
      // Fetch the post by sermon number to get its ID
      let post = null;
      switch (parsed.type) {
        case 'oration':
          post = await orationsApi.getOrationBySermonNumber(sermonNumber);
          break;
        case 'letter':
          post = await lettersApi.getLetterBySermonNumber(sermonNumber);
          break;
        case 'saying':
          post = await sayingsApi.getSayingBySermonNumber(sermonNumber);
          break;
      }

      // If not found, try with the full sectionNumber (26.1)
      if (!post && parsed.sectionNumber !== sermonNumber) {
        sermonNumber = parsed.sectionNumber;
        switch (parsed.type) {
          case 'oration':
            post = await orationsApi.getOrationBySermonNumber(sermonNumber);
            break;
          case 'letter':
            post = await lettersApi.getLetterBySermonNumber(sermonNumber);
            break;
          case 'saying':
            post = await sayingsApi.getSayingBySermonNumber(sermonNumber);
            break;
        }
      }

      // If still not found, try searching by paragraph number (full sectionNumber)
      if (!post) {
        const paragraphNumber = parsed.sectionNumber;
        switch (parsed.type) {
          case 'oration':
            post = await orationsApi.getOrationByParagraphNumber(paragraphNumber);
            break;
          case 'letter':
            post = await lettersApi.getLetterByParagraphNumber(paragraphNumber);
            break;
          case 'saying':
            post = await sayingsApi.getSayingByParagraphNumber(paragraphNumber);
            break;
        }
      }

      // Final fallback: search by text reference (client-side search through all posts)
      if (!post) {
        switch (parsed.type) {
          case 'oration':
            post = await orationsApi.getOrationByTextReference(parsed.number);
            break;
          case 'letter':
            post = await lettersApi.getLetterByTextReference(parsed.number);
            break;
          case 'saying':
            post = await sayingsApi.getSayingByTextReference(parsed.number);
            break;
        }
      }

      if (!post) {
        console.error(`Could not find ${parsed.type} with text reference ${parsed.number}`);
        return;
      }

      // Navigate to detail page with post ID and highlight ref
      const contentTypeMap = {
        oration: 'orations',
        letter: 'letters',
        saying: 'sayings',
        introduction: 'radis',
      };

      router.push(
        `/${contentTypeMap[parsed.type]}/details/${post.id}?${queryParams.toString()}`
      );
    } catch (error) {
      console.error('Error navigating to text reference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${colorClass} text-xs font-semibold rounded transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-wait`}
        title={`Go to ${contentTypeName}`}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          showIcon && <ArrowRight className="w-3 h-3" />
        )}
        {textRef}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colorClass} text-xs font-medium rounded-full transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-wait`}
      title={`Navigate to ${contentTypeName} - ${parsed.sectionNumber}`}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        showIcon && <Book className="w-3 h-3" />
      )}
      {textRef}
      {showLabel && <span className="hidden sm:inline text-xs opacity-75">({contentTypeName})</span>}
    </button>
  );
}
