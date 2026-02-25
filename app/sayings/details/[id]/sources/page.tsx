'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SourcesListContent from '@/app/components/sources/sources-list-content';

export default function SayingsSourcesPage() {
    const params = useParams();
    const id = params.id as string;

    return <SourcesListContent contentTypeLabel="Saying" itemNumber={id} />;
}
