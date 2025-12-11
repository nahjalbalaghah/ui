'use client';

import StaticIndexList from '@/app/indexes/components/StaticIndexList';
import { getCategoryBySlug } from '@/app/data/indexes';
import { notFound } from 'next/navigation';

export default function NamesPlacesIndexPage() {
    const category = getCategoryBySlug('names-places');

    if (!category) {
        notFound();
    }

    return <StaticIndexList category={category} />;
}
