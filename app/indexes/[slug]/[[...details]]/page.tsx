'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import NamesPlacesContent from '@/app/components/indexes/NamesPlacesContent';
import IndexTermsContent from '@/app/components/indexes/IndexTermsContent';
import QuranHadithContent from '@/app/components/indexes/QuranHadithContent';
import ReligiousConceptsContent from '@/app/components/indexes/ReligiousConceptsContent';
import IndexDetailDispatcher from '@/app/components/indexes/index-detail-dispatcher';

const VALID_SLUGS = ['names-places', 'terms', 'quran-hadith', 'religious-concepts'];

const listingComponents: Record<string, React.FC> = {
  'names-places': NamesPlacesContent,
  'terms': IndexTermsContent,
  'quran-hadith': QuranHadithContent,
  'religious-concepts': ReligiousConceptsContent,
};

export default function IndexSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const details = params.details as string[] | undefined;

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  // No details means listing page
  if (!details || details.length === 0) {
    const ListingComponent = listingComponents[slug];
    if (!ListingComponent) {
      notFound();
    }
    return <ListingComponent />;
  }

  // Has details means detail/dispatcher page
  return <IndexDetailDispatcher />;
}
