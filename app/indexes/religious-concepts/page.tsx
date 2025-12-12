'use client';

import { Suspense } from 'react';
import StaticIndexList from '@/app/indexes/components/StaticIndexList';
import { getCategoryBySlug } from '@/app/data/indexes';
import { notFound } from 'next/navigation';

function ReligiousConceptsContent() {
    const category = getCategoryBySlug('religious-concepts');

    if (!category) {
        notFound();
    }

    return <StaticIndexList category={category} />;
}

export default function ReligiousConceptsIndexPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ReligiousConceptsContent />
        </Suspense>
    );
}
