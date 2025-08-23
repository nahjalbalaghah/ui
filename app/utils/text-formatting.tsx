import React from 'react';


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

export const isArabicText = (text: string): boolean => {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};