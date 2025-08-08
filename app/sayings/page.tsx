'use client';
import React from 'react';
import ContentPage from '@/app/components/content/content-page';
import { sayingsApi } from '@/api/posts';

const config = {
  contentType: 'sayings' as const,
  title: 'Sayings (Wisdom)',
  subtitle: 'The profound sayings of Imam Ali, offering timeless wisdom on life, character, and spiritual development.',
  api: {
    getContent: sayingsApi.getSayings,
    searchContent: sayingsApi.searchSayings,
  }
};

export default function SayingsPage() {
  return <ContentPage config={config} />;
}
