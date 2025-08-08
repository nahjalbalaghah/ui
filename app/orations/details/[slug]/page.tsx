'use client';
import React from 'react';
import ContentDetailsPage from '@/app/components/content/content-details-page';
import { orationsApi } from '@/api/posts';

export default function OrationsDetailsPage() {
  return (
    <ContentDetailsPage
      contentType="orations"
      title="Orations"
      api={{
        getContentBySlug: orationsApi.getOrationBySlug,
      }}
    />
  );
}
