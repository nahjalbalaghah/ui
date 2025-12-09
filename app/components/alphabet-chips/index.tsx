import React from 'react';

interface AlphabetChipsProps {
    selectedLetter: string;
    onSelectLetter: (letter: string) => void;
    language: 'English' | 'Arabic';
}

const ENGLISH_ALPHABET = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const ARABIC_ALPHABET = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
    'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

export default function AlphabetChips({ selectedLetter, onSelectLetter, language }: AlphabetChipsProps) {
    const letters = language === 'English' ? ENGLISH_ALPHABET : ARABIC_ALPHABET;

    return (
        <div className="flex flex-wrap gap-1.5 mb-6 justify-center" dir={language === 'Arabic' ? 'rtl' : 'ltr'}>
            <button
                onClick={() => onSelectLetter('')}
                className={`h-8 px-3 text-xs font-semibold rounded-full transition-all border flex items-center justify-center ${!selectedLetter
                        ? "bg-[#43896B] text-white border-[#43896B] shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-[#43896B] hover:text-[#43896B]"
                    }`}
            >
                All
            </button>
            {letters.map((letter) => (
                <button
                    key={letter}
                    onClick={() => onSelectLetter(letter)}
                    className={`w-8 h-8 text-xs font-semibold rounded-full transition-all border flex items-center justify-center ${selectedLetter === letter
                            ? "bg-[#43896B] text-white border-[#43896B] shadow-sm scale-110"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-[#43896B] hover:text-[#43896B]"
                        }`}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
}
