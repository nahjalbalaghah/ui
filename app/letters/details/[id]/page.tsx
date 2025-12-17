'use client';

import React, { useMemo } from 'react';
import ContentDetailsPage from '@/app/components/content/content-details-page';
import { lettersApi } from '@/api/posts';

export default function LetterDetailsPage() {
  const api = useMemo(() => ({
    getContentById: lettersApi.getLetterById,
  }), []);

  return (
    <ContentDetailsPage
      contentType="letters"
      title="Letters"
      api={api}
    />
  );
}
