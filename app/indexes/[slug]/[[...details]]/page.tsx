import { Suspense } from 'react';
import IndexSlugClient from './IndexSlugClient';

const VALID_SLUGS = ['names-places', 'terms', 'quran-hadith', 'religious-concepts', 'glossary'];

// Only the 5 top-level listing pages are pre-rendered. Detail/search pages
// under each category (e.g. /indexes/terms/some-word) are entirely
// client-rendered and query-string driven (see IndexDetailDispatcher), so
// there's no real static content to gain by enumerating every term -- the
// Apache rewrite serves this same listing shell for any deeper path, and
// IndexSlugClient's own routing logic (reading the real URL post-hydration)
// takes it from there.
export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug, details: [] }));
}

export const dynamicParams = false;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <IndexSlugClient />
    </Suspense>
  );
}
