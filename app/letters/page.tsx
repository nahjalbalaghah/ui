'use client';
import React from 'react';
import ContentPage from '@/app/components/content/content-page';
import { lettersApi } from '@/api/posts';

const config = {
  contentType: 'letters' as const,
  title: 'Letters (Writings)',
  subtitle: 'The insightful letters of Imam Ali, addressing governance, administration, and spiritual guidance with wisdom and authority.',
  api: {
    getContent: lettersApi.getLetters,
    searchContent: lettersApi.searchLetters,
  },
  tocArabic: "باب المختار من كتب أمير المؤمنين عليه السلام ورسائله إلى أعدائه وأمراء بلاده ويدخل في ذلكما ٱختير من عهوده إلى عماّله ووصاياه لأهله وأصحابه",
  tocEnglish: "Chapter containing selections from the Commander of the Faithful’s dispatches and letters to his enemies and his regional governors, including selections from instructions to his tax collectors and testaments to his family and companions"
};

export default function LettersPage() {
  return <ContentPage config={config} />;
}
