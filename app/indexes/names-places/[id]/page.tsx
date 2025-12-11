'use client';

import StaticIndexDetails from '@/app/indexes/components/StaticIndexDetails';
import { useParams } from 'next/navigation';

export default function NamesPlacesDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    return <StaticIndexDetails categorySlug="names-places" termSlug={id} />;
}
