'use client';
import React from 'react';
import ContentDetailsPage from '@/app/components/content/content-details-page';
import { lettersApi } from '@/api/posts';

export default function LetterDetailsPage() {
  return (
    <ContentDetailsPage
      contentType="letters"
      title="Letters"
      api={{
        getContentBySlug: lettersApi.getLetterBySlug,
      }}
    />
  );
}
