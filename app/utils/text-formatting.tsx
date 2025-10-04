import React from 'react';
import { Footnote } from '@/api/orations';
import { FootnoteTooltip } from '@/app/components/footnote-tooltip';

interface FootnoteMatchResult {
  text: string;
  footnotes: Footnote[];
  isMatch: boolean;
  start: number;
  end: number;
}

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
    const parts = text.split(/(\«[^»]*\»)/g);
    return parts.map((part, index) => {
      if (part.startsWith('«') && part.endsWith('»')) {
        return (
          <span key={index} className="font-bold underline">
            {part}
          </span>
        );
      }
      return part;
    });
  }
};

// export const formatTextWithFootnotes = (
//   text: string, 
//   footnotes: Footnote[], 
//   isArabic: boolean = false,
//   currentSection?: string 
// ): React.ReactNode => {
//   if (!text || !footnotes || footnotes.length === 0) {
//     return formatTextWithBold(text, isArabic);
//   }

//   const relevantFootnotes = currentSection 
//     ? footnotes.filter(footnote => {
//         const footnoteSection = footnote.section?.replace(/^"|"$/g, '') || '';
//         if (currentSection === 'main') {
//           return !footnoteSection || 
//                  footnoteSection === 'main' || 
//                  footnoteSection === '' ||
//                  !footnoteSection.match(/^\d+(\.\d+)*$/);
//         }
//         return footnoteSection === currentSection;
//       })
//     : footnotes;

//   if (relevantFootnotes.length === 0) {
//     return formatTextWithBold(text, isArabic);
//   }

//   const matches: FootnoteMatchResult[] = [];
  
//   relevantFootnotes.forEach(footnote => {
//     const wordToMatch = isArabic ? footnote.arabic_word : footnote.english_word;
    
//     if (!wordToMatch || !wordToMatch.trim()) {
//       return;
//     }

//     const cleanWord = wordToMatch.trim();
    
//     let regex = new RegExp(`\\b${escapeRegExp(cleanWord)}\\b`, 'gi');
//     let match;
    
//     while ((match = regex.exec(text)) !== null) {
//       matches.push({
//         text: match[0],
//         footnotes: [footnote],
//         isMatch: true,
//         start: match.index,
//         end: match.index + match[0].length
//       });
//     }
    
//     if (cleanWord.includes(' ') || cleanWord.length > 3) {
//       regex = new RegExp(escapeRegExp(cleanWord), 'gi');
//       text.replace(regex, (match, offset) => {
//         const hasExistingMatch = matches.some(m => 
//           offset >= m.start && offset < m.end || 
//           offset + match.length > m.start && offset + match.length <= m.end
//         );
        
//         if (!hasExistingMatch) {
//           matches.push({
//             text: match,
//             footnotes: [footnote],
//             isMatch: true,
//             start: offset,
//             end: offset + match.length
//           });
//         }
//         return match;
//       });
//     }
//   });

//   matches.sort((a, b) => a.start - b.start);

//   const mergedMatches: FootnoteMatchResult[] = [];
//   for (const match of matches) {
//     const lastMatch = mergedMatches[mergedMatches.length - 1];
    
//     if (lastMatch && match.start < lastMatch.end) {
//       lastMatch.footnotes.push(...match.footnotes);
//       lastMatch.end = Math.max(lastMatch.end, match.end);
//       lastMatch.text = text.substring(lastMatch.start, lastMatch.end);
//     } else {
//       mergedMatches.push(match);
//     }
//   }

//   if (mergedMatches.length === 0) {
//     return formatTextWithBold(text, isArabic);
//   }

//   const result: React.ReactNode[] = [];
//   let lastIndex = 0;

//   mergedMatches.forEach((match, index) => {
//     if (match.start > lastIndex) {
//       const beforeText = text.substring(lastIndex, match.start);
//       result.push(
//         <React.Fragment key={`before-${index}`}>
//           {formatTextWithBold(beforeText, isArabic)}
//         </React.Fragment>
//       );
//     }

//     const matchedText = match.text;
//     const uniqueFootnotes = Array.from(
//       new Map(match.footnotes.map(f => [f.id, f])).values()
//     );

//     if (uniqueFootnotes.length === 1) {
//       result.push(
//         <FootnoteTooltip 
//           key={`footnote-${index}`} 
//           footnote={uniqueFootnotes[0]}
//           matchedLanguage={isArabic ? 'arabic' : 'english'}
//         >
//           <span className="font-bold border-b-[3px] text-[#43896B] border-[#43896B]">
//             {matchedText}
//             <sup className=" ml-1 font-bold">{uniqueFootnotes[0].number}</sup>
//           </span>
//         </FootnoteTooltip>
//       );
//     } else {
//       const numbers = uniqueFootnotes.map(f => f.number).join(',');
//       result.push(
//         <span key={`footnote-${index}`} className="font-bold border-b-2 text-[#43896B] border-[#43896B]">
//           {matchedText}
//           <sup className="text-[#43896B] ml-1 font-bold">{numbers}</sup>
//         </span>
//       );
//     }

//     lastIndex = match.end;
//   });

//   if (lastIndex < text.length) {
//     const remainingText = text.substring(lastIndex);
//     result.push(
//       <React.Fragment key="remaining">
//         {formatTextWithBold(remainingText, isArabic)}
//       </React.Fragment>
//     );
//   }

//   return result;
// };

export const formatTextWithFootnotes = (
  text: string,
  footnotes: Footnote[],
  isArabic: boolean = false,
  currentSection?: string
): React.ReactNode => {
  if (!text || !footnotes || footnotes.length === 0) {
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
          {formatTextWithBold(beforeText, isArabic)}
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
        <span className="font-bold border-b-[3px] text-[#43896B] border-[#43896B]">
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
        {formatTextWithBold(remainingText, isArabic)}
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