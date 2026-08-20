'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ContentDetailsPage from '@/app/components/content/content-details-page';
import ContentSubPathDispatcher from '@/app/components/content/content-sub-path-dispatcher';
import { orationsApi, lettersApi, sayingsApi } from '@/api/posts';

export default function ContentDetailsClient() {
  const params = useParams();
  const paramsArray = params.params as string[];

  if (!paramsArray || paramsArray.length < 2) {
    return <div>Invalid path</div>;
  }

  const [type, id, ...rest] = paramsArray;

  const apiMap: Record<string, any> = {
    orations: orationsApi.getOrationById,
    letters: lettersApi.getLetterById,
    sayings: sayingsApi.getSayingById,
  };

  const titleMap: Record<string, string> = {
    orations: 'Orations',
    letters: 'Letters',
    sayings: 'Sayings',
  };

  const api = useMemo(() => ({
    getContentById: apiMap[type],
  }), [type]);

  if (rest.length > 0) {
    return <ContentSubPathDispatcher type={type as any} />;
  }

  if (!api.getContentById) {
    return <div>Content type not found</div>;
  }

  return (
    <ContentDetailsPage
      contentType={type as any}
      title={titleMap[type] || type}
      api={api}
      id={parseInt(id)}
    />
  );
}
