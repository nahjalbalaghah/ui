'use client';
import React from 'react';
import ContentDetailsPage from '@/app/components/content/content-details-page';
import { sayingsApi } from '@/api/posts';

export default function SayingDetailsPage() {
  return (
    <ContentDetailsPage
      contentType="sayings"
      title="Sayings"
      api={{
        getContentBySlug: sayingsApi.getSayingBySlug,
      }}
    />
  );
}
