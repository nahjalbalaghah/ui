import React from 'react';
import { parseTextReference } from './text-reference';

/**
 * Wrap text references in span elements with data-text-ref attributes
 * This allows them to be highlighted and interacted with
 * 
 * Examples:
 * "1.26.1" -> <span data-text-ref="1.26.1">1.26.1</span>
 * "See 2.10 for details" -> See <span data-text-ref="2.10">2.10</span> for details
 */
export function wrapTextReferences(text: string | React.ReactNode): React.ReactNode {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Regex to match text references: X.Y or X.Y.Z (where X is 0-3, followed by digits)
  // Match patterns like: 1.26, 1.26.1, 2.10.5, etc.
  const textRefRegex = /([0-3]\.\d+(?:\.\d+)*)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let matchCounter = 0;

  while ((match = textRefRegex.exec(text)) !== null) {
    const textRef = match[0];
    const parsed = parseTextReference(textRef);

    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add wrapped text reference if it's valid
    if (parsed) {
      parts.push(
        React.createElement('span', {
          key: `text-ref-${matchCounter}`,
          'data-text-ref': textRef,
          className: 'text-ref-marker',
        }, textRef)
      );
      matchCounter++;
    } else {
      // If parsing fails, just add the text as-is
      parts.push(textRef);
    }

    lastIndex = textRefRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Only return array if we have matches, otherwise return original text
  if (matchCounter > 0 && parts.length > 0) {
    return parts;
  }

  return text;
}
