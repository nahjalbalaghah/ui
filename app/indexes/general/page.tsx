'use client';

import { Suspense } from 'react';
import GeneralContent from './GeneralContent';

export default function GeneralIndexPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43896B] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading general index...</p>
            </div>
        </div>}>
            <GeneralContent />
        </Suspense>
    );
}
