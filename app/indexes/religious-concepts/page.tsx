'use client';

import StaticIndexList from '@/app/indexes/components/StaticIndexList';
import { getCategoryBySlug } from '@/app/data/indexes';
import { notFound } from 'next/navigation';

export default function ReligiousConceptsIndexPage() {
    const category = getCategoryBySlug('religious-concepts');

    if (!category) {
        notFound();
    }

    return <StaticIndexList category={category} />;
}
