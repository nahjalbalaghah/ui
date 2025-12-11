'use client';

import StaticIndexDetails from '@/app/indexes/components/StaticIndexDetails';
import { useParams } from 'next/navigation';

export default function QuranHadithDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    return <StaticIndexDetails categorySlug="quran-hadith" termSlug={id} />;
}
