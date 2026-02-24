'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SourcesListContent from '@/app/components/sources/sources-list-content';

export default function OrationsSourcesPage() {
    const params = useParams();
    const id = params.id as string;

    return <SourcesListContent contentTypeLabel="Oration" itemNumber={id} />;
}
