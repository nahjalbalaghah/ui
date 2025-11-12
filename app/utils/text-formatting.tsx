import React from 'react';
import { Footnote } from '@/api/orations';
import { FootnoteTooltip } from '@/app/components/footnote-tooltip';

export const formatTextWithBold = (text: string, isArabic: boolean = false): React.ReactNode => {
  if (!text) return text;

  if (isArabic) {
    const parts = text.split(/(\([^)]*\)|﴿[^﴾]*﴾)/g);
    return parts.map((part, index) => {
      if ((part.startsWith('(') && part.endsWith(')')) || 
          (part.startsWith('﴿') && part.endsWith('﴾'))) {
        return (
          <span key={index}>
            {part}
          </span>
        );
      }
      return part;
    });
  } else {
    return applyBoldAndItalicFormatting(text);
  }
};

const applyItalicFormatting = (text: string): React.ReactNode => {
  // e.g. (ashnaqahā), (ashnaqa l-nāqata), (Iṣlāḥ al-manṭiq)
  const regex = /\(([^()]*[āīūḥṣṭẓḍʿʾ]+[^()]*)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <em key={`italic-${match.index}`} style={{ fontStyle: "italic" }}>
        ({match[1]})
      </em>
    );
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? <>{parts}</> : text;
};

const applyBoldAndItalicFormatting = (text: string): React.ReactNode => {
  const boldParts = text.split(/(\«[^»]*\»)/g);
  
  return boldParts.map((part, index) => {
    if (part.startsWith('«') && part.endsWith('»')) {
      const innerText = part;
      return (
        <span key={`bold-${index}`} className="font-bold underline">
          {applyItalicFormatting(innerText)}
        </span>
      );
    } else {
      return <React.Fragment key={`text-${index}`}>{applyItalicFormatting(part)}</React.Fragment>;
    }
  });
};

export const formatTextWithFootnotes = (
  text: string,
  footnotes: Footnote[],
  isArabic: boolean = false,
  currentSection?: string
): React.ReactNode => {
  if (!text || !footnotes || footnotes.length === 0) {
    if (!isArabic) {
      return applyItalicFormatting(text);
    }
    return formatTextWithBold(text, isArabic);
  }

  const relevantFootnotes = currentSection
    ? footnotes.filter((footnote) => {
        const footnoteSection = footnote.section?.replace(/^"|"$/g, "") || "";
        if (currentSection === "main") {
          return (
            !footnoteSection ||
            footnoteSection === "main" ||
            footnoteSection === "" ||
            !footnoteSection.match(/^\d+(\.\d+)*$/)
          );
        }
        return footnoteSection === currentSection;
      })
    : footnotes;

  if (relevantFootnotes.length === 0) {
    return formatTextWithBold(text, isArabic);
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  interface WordOccurrence {
    word: string;
    position: number;
    footnote: Footnote;
    occurrenceIndex: number;
  }

  const allOccurrences: WordOccurrence[] = [];
  const wordOccurrenceCount: Record<string, number> = {};

  for (const fn of relevantFootnotes) {
    const wordToMatch = (isArabic ? fn.arabic_word : fn.english_word)?.trim();
    if (!wordToMatch) continue;

    const occurrenceKey = isArabic ? wordToMatch : wordToMatch.toLowerCase();

    // Escape regex chars
    const escapedWord = wordToMatch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let regex: RegExp;
    if (isArabic) {
      // Arabic → direct exact match
      regex = new RegExp(`(?<!\\S)${escapedWord}(?!\\S)`, "g");
    } else {
      // English and symbols:
      // If word is alphanumeric → use \b boundaries (so "attribute" ≠ "attributes")
      // If word has special chars (like ?, >>, ,) → allow raw matching
      if (/^[a-zA-Z0-9]+$/.test(wordToMatch)) {
        regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
      } else {
        regex = new RegExp(`${escapedWord}`, "gi");
      }
    }

    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!wordOccurrenceCount[occurrenceKey]) {
        wordOccurrenceCount[occurrenceKey] = 0;
      }
      wordOccurrenceCount[occurrenceKey]++;

      allOccurrences.push({
        word: match[0],
        position: match.index,
        footnote: fn,
        occurrenceIndex: wordOccurrenceCount[occurrenceKey],
      });
    }
  }

  allOccurrences.sort((a, b) => a.position - b.position);

  const highlightedOccurrences: WordOccurrence[] = [];

  for (const occurrence of allOccurrences) {
    const fn = occurrence.footnote;
    const indexField = isArabic ? fn.arabic_word_index : fn.english_word_index;

    let shouldHighlight = false;

    if (indexField == null || indexField === "") {
      shouldHighlight = occurrence.occurrenceIndex === 1;
    } else {
      const parsed = parseInt(indexField.toString(), 10);

      if (!isNaN(parsed)) {
        // index = 0 or 3 → treat as 1
        if (parsed === 0 || parsed === 3) {
          shouldHighlight = occurrence.occurrenceIndex === 1;
        } else {
          const targetIndex = parsed + 1;
          shouldHighlight = occurrence.occurrenceIndex === targetIndex;
        }
      } else {
        shouldHighlight = occurrence.occurrenceIndex === 1;
      }
    }

    if (shouldHighlight) {
      highlightedOccurrences.push(occurrence);
    }
  }

  // Remove overlapping matches
  const finalOccurrences: WordOccurrence[] = [];
  for (const occurrence of highlightedOccurrences) {
    const endPosition = occurrence.position + occurrence.word.length;

    const hasOverlap = finalOccurrences.some((existing) => {
      const existingEnd = existing.position + existing.word.length;
      return (
        (occurrence.position >= existing.position &&
          occurrence.position < existingEnd) ||
        (endPosition > existing.position && endPosition <= existingEnd) ||
        (occurrence.position <= existing.position &&
          endPosition >= existingEnd)
      );
    });

    if (!hasOverlap) {
      finalOccurrences.push(occurrence);
    }
  }

  for (let i = 0; i < finalOccurrences.length; i++) {
    const occurrence = finalOccurrences[i];

    if (occurrence.position > lastIndex) {
      const beforeText = text.substring(lastIndex, occurrence.position);
      result.push(
        <React.Fragment key={`before-${occurrence.position}`}>
          {isArabic ? formatTextWithBold(beforeText, isArabic) : applyItalicFormatting(beforeText)}
        </React.Fragment>
      );
    }

    const fn = occurrence.footnote;
    result.push(
      <FootnoteTooltip
        key={`footnote-${occurrence.position}`}
        footnote={fn}
        matchedLanguage={isArabic ? "arabic" : "english"}
      >
        <span className="">
          {occurrence.word}
          <sup className="ml-1 font-bold">{fn.number}</sup>
        </span>
      </FootnoteTooltip>
    );

    lastIndex = occurrence.position + occurrence.word.length;
  }

  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    result.push(
      <React.Fragment key="remaining">
        {isArabic ? formatTextWithBold(remainingText, isArabic) : applyItalicFormatting(remainingText)}
      </React.Fragment>
    );
  }

  return result;
};

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const isArabicText = (text: string): boolean => {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

export const HighlightArabicText = ({ text }: any) => {
   // (ashnaqahā), (ashnaqa l-nāqata), (Iṣlāḥ al-manṭiq)
  const regex = /\(([^()]*[āīūḥṣṭẓḍʿʾ]+[^()]*)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <em key={match.index} style={{ fontStyle: "italic" }}>
        ({match[1]})
      </em>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return <span>{parts}</span>;
}