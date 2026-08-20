import { Suspense } from 'react';
import { orationsApi, lettersApi, sayingsApi } from '@/api/posts';
import ContentDetailsClient from './ContentDetailsClient';

// Pre-render every oration/letter/saying's base detail page at build time
// (static export has no server, so dynamic segments must be enumerated here).
// Nested sub-paths (toc, sources, sources/[documentId]) are NOT enumerated --
// they're served by rewriting to this same id's static shell at the web
// server, and rendered client-side by ContentSubPathDispatcher after hydration.
export async function generateStaticParams() {
  const contentTypes: { type: string; listFn: (page: number, pageSize: number) => Promise<{ data: { id: number }[]; meta: { pagination: { pageCount: number } } }> }[] = [
    { type: 'orations', listFn: orationsApi.getOrations },
    { type: 'letters', listFn: lettersApi.getLetters },
    { type: 'sayings', listFn: sayingsApi.getSayings },
  ];

  const allParams: { params: string[] }[] = [];

  for (const { type, listFn } of contentTypes) {
    let page = 1;
    const pageSize = 100;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const res = await listFn(page, pageSize);
      const items = res?.data || [];
      for (const item of items) {
        if (item?.id != null) {
          allParams.push({ params: [type, String(item.id)] });
        }
      }
      const pageCount = res?.meta?.pagination?.pageCount || 1;
      if (page >= pageCount || items.length === 0) break;
      page++;
    }
  }

  return allParams;
}

// Unlisted (type, id) combos 404 at the Next level; the Apache rewrite is
// what actually serves nested sub-paths, so this stays strict.
export const dynamicParams = false;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContentDetailsClient />
    </Suspense>
  );
}
