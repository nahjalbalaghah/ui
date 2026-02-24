'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ScrollText } from 'lucide-react';

export default function SourceDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const sourceId = params.sourceId as string;

    // Format source name for display
    const sourceName = sourceId
        ? decodeURIComponent(sourceId)
            .split('-')
            .map(word => {
                const w = word.toLowerCase();
                if (w === 'thaqafi') return 'Thaqafī';
                if (w === 'kulayni') return 'Kulaynī';
                if (w === 'harrani') return 'Ḥarrānī';
                if (w === 'qudai') return 'Quḍāʿī';
                if (w === 'tabrisi') return 'Ṭabrisī';
                if (w === 'hatim') return 'Ḥātim';
                if (word.charAt(0) === 'h' && word.length > 1) return 'Ḥ' + word.slice(1);
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ')
        : 'Unknown Source';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#367556] font-semibold transition-colors cursor-pointer mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Sources
                </button>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                    <div className="bg-[#43896B] p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <ScrollText className="w-6 h-6 text-[#43896B] bg-white rounded-full p-1" />
                            <span className="font-bold tracking-widest uppercase text-xs">Historical Source</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{sourceName}</h1>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed italic border-l-4 border-[#43896B] pl-6 py-2 bg-[#43896B]/5 rounded-r-xl mb-12">
                            <p>
                                "Text content will be given here. This is a placeholder for the historical text associated with {sourceName} in the context of Nahj al-Balaghah."
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Description</h2>
                                <p className="text-gray-600">
                                    This section will contain detailed information about the source, its author, and its significance in verifying the authenticity of the narrations in Nahj al-Balaghah.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-2">Author Details</h3>
                                    <p className="text-sm text-gray-600">Information about the narrator or historian will be displayed here.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-2">Volume & Page</h3>
                                    <p className="text-sm text-gray-600">Specific references to volumes, chapters, and pages in the original manuscript.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
