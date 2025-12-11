'use client';

import StaticIndexList from '@/app/indexes/components/StaticIndexList';
import { getCategoryBySlug } from '@/app/data/indexes';
import { notFound } from 'next/navigation';

export default function QuranHadithIndexPage() {
    const category = getCategoryBySlug('quran-hadith');

    if (!category) {
        notFound();
    }

    return <StaticIndexList category={category} />;
}
