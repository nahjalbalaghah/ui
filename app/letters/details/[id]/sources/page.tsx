'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SourcesListContent from '@/app/components/sources/sources-list-content';

export default function LettersSourcesPage() {
    const params = useParams();
    const id = params.id as string;

    return <SourcesListContent contentTypeLabel="Letter" itemNumber={id} />;
}
