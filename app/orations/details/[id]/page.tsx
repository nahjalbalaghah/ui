'use client';
import React, { useMemo } from 'react';
import ContentDetailsPage from '@/app/components/content/content-details-page';
import { orationsApi } from '@/api/posts';

export default function OrationsDetailsPage() {
  const api = useMemo(() => ({
    getContentById: orationsApi.getOrationById,
  }), []);

  return (
    <ContentDetailsPage
      contentType="orations"
      title="Orations"
      api={api}
    />
  );
}
