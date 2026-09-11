'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, ScrollText, Loader2 } from 'lucide-react';
import { GlossaryEntry, glossaryEntriesApi } from '@/api';

interface SourceDetailsContentProps {
    documentId?: string;
}

export default function SourceDetailsContent({ documentId: propDocumentId }: SourceDetailsContentProps) {
    const params = useParams();
    const router = useRouter();

    // Support both old structure and new catch-all params
    const documentId = propDocumentId || (() => {
        if (params.slug && Array.isArray(params.slug)) return params.slug[1];
        if (params.params && Array.isArray(params.params) && params.params.length >= 4) {
            return params.params[3]; // /content/details/type/id/sources/documentId
        }
        return undefined;
    })();

    const [source, setSource] = useState<GlossaryEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSourceDetails = async () => {
            if (!documentId) return;
            try {
                setLoading(true);
                const foundSource = await glossaryEntriesApi.getGlossaryEntryByDocumentId(documentId);
                if (foundSource) {
                    setSource(foundSource);
                } else {
                    setError('المصدر غير موجود');
                }
            } catch (err) {
                console.error('Failed to fetch source details:', err);
                setError('فشل تحميل تفاصيل المصدر. يرجى المحاولة مرة أخرى لاحقاً.');
            } finally {
                setLoading(false);
            }
        };

        fetchSourceDetails();
    }, [documentId]);

    if (loading) {
        return (
            <div dir="rtl" className="font-arabic min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#43896B] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">جارٍ تحميل تفاصيل المصدر...</p>
                </div>
            </div>
        );
    }

    if (error || !source) {
        return (
            <div dir="rtl" className="font-arabic min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'المصدر غير موجود'}</p>
                    <button
                        onClick={() => router.back()}
                        className="text-[#43896B] hover:underline flex items-center gap-2 mx-auto"
                    >
                        <ArrowRight className="w-4 h-4" />
                        رجوع
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div dir="rtl" className="font-arabic min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[#43896B] hover:text-[#367556] font-semibold transition-colors cursor-pointer mb-8"
                >
                    <ArrowRight className="w-5 h-5" />
                    العودة إلى المصادر
                </button>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                    <div className="bg-[#43896B] p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <ScrollText className="w-6 h-6 text-[#43896B] bg-white rounded-full p-1" />
                            <span className="font-bold tracking-widest text-xs">مصدر تاريخي</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-normal">{source.word}</h1>
                        <div className="mt-4 space-y-1 text-white/90">
                            {source.author && <p className="text-lg font-semibold">المؤلف: {source.author}</p>}
                            {source.title && <p className="text-base">الكتاب: {source.title}</p>}
                            {source.publicationInformation && <p className="text-sm">معلومات النشر: {source.publicationInformation}</p>}
                            {source.authorDate && <p className="text-sm">تاريخ المؤلف: {source.authorDate}</p>}
                            {source.volumepage && <p className="text-sm">{source.volumepage}</p>}
                        </div>
                    </div>
                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg max-w-none text-gray-700 border-r-4 border-[#43896B] p-4 lg:p-6 bg-[#43896B]/5 rounded-l-xl mb-12">
                            <p className="whitespace-pre-wrap text-right font-arabic text-lg">{source.content}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
