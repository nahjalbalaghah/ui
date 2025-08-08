'use client';
import React from 'react';
import ContentPage from '@/app/components/content/content-page';
import { orationsApi } from '@/api/posts';

const config = {
  contentType: 'orations' as const,
  title: 'Orations (Sermons)',
  subtitle: 'The powerful orations of Imam Ali, addressing justice, society, and spirituality with profound wisdom and eloquence.',
  api: {
    getContent: orationsApi.getOrations,
    searchContent: orationsApi.searchOrations,
  }
};

export default function OrationsPage() {
  return <ContentPage config={config} />;
}
