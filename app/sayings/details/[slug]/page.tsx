'use client';
import React, { useMemo } from 'react';
import ContentDetailsPage from '@/app/components/content/content-details-page';
import { sayingsApi } from '@/api/posts';

export default function SayingDetailsPage() {
  const api = useMemo(() => ({
    getContentBySlug: sayingsApi.getSayingBySlug,
  }), []);

  return (
    <ContentDetailsPage
      contentType="sayings"
      title="Sayings"
      api={api}
    />
  );
}
