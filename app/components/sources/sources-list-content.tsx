'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ScrollText, X, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import AlphabetChips from '@/app/components/alphabet-chips';
import { GlossaryEntry, glossaryEntriesApi } from '@/api';

interface SourcesListContentProps {
    contentTypeLabel: string;
    itemNumber: string;
}

const CONTENT_TYPE_LABELS_AR: Record<string, string> = {
    Oration: 'الخطبة',
    Letter: 'الرسالة',
    Saying: 'الحكمة',
};

export default function SourcesListContent({ contentTypeLabel, itemNumber }: SourcesListContentProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState<'English' | 'Arabic'>('English');
    const [sources, setSources] = useState<GlossaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const contentTypeLabelAr = CONTENT_TYPE_LABELS_AR[contentTypeLabel] || contentTypeLabel;

    useEffect(() => {
        const fetchSources = async () => {
            try {
                setLoading(true);
                const parts = itemNumber.split('.');
                const isParagraphLevel = parts.length > 2;
                const response = await glossaryEntriesApi.getGlossaryEntries({
                    pageSize: 200,
                    ...(isParagraphLevel
                        ? { paragraphNumber: itemNumber }
                        : { postSermonNumber: itemNumber })
                });
                setSources(response.data || []);
            } catch (err) {
                console.error('Failed to fetch sources:', err);
                setError('فشل تحميل المصادر. يرجى المحاولة مرة أخرى لاحقاً.');
            } finally {
                setLoading(false);
            }
        };

        if (itemNumber) {
            fetchSources();
        }
    }, [itemNumber, contentTypeLabel]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setLanguage('English');
    };

    const handleRowClick = (source: GlossaryEntry) => {
        router.push(`${pathname}/${source.documentId || source.id}`);
    };

    const hasActiveFilters = searchQuery !== '' || language !== 'English';

    const filteredSources = sources.filter(source => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            (source.word && source.word.toLowerCase().includes(query)) ||
            (source.author && source.author.toLowerCase().includes(query)) ||
            (source.title && source.title.toLowerCase().includes(query)) ||
            (source.content && source.content.toLowerCase().includes(query)) ||
            (source.volumepage && source.volumepage.toLowerCase().includes(query));

        const matchesLanguage = language === 'Arabic'
            ? /[؀-ۿ]/.test(`${source.word || ''} ${source.content || ''} ${source.title || ''} ${source.author || ''}`)
            : true;

        return !!matchesSearch && matchesLanguage;
    });

    if (loading) {
        return (
            <div dir="rtl" className="font-arabic min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#43896B] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">جارٍ تحميل المصادر...</p>
                </div>
            </div>
        );
    }

    return (
        <div dir="rtl" className="font-arabic min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ScrollText className="w-6 h-6 text-[#43896B]" />
                        <h1 className="text-3xl font-bold text-gray-900">مصادر {contentTypeLabelAr} {itemNumber}</h1>
                    </div>
                    <p className="text-gray-600">مصادر تاريخية ومراجع تثبت صحة هذا النص.</p>
                </div>

                {/* Filter Banner Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">التصفية</h2>
                        {hasActiveFilters && (
                            <Button
                                onClick={handleClearFilters}
                                variant='danger'
                                icon={<X className="w-4 h-4" />}
                            >
                                مسح الفلاتر
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-sm text-gray-700 mb-1">اللغة</label>
                            <Select
                                value={language}
                                onChange={(value) => setLanguage(value as 'English' | 'Arabic')}
                                options={[
                                    { value: 'English', label: 'الإنجليزية' },
                                    { value: 'Arabic', label: 'العربية' }
                                ]}
                                placeholder="اختر اللغة"
                            />
                        </div>
                        <Input
                            label="البحث عن مصدر"
                            placeholder="ابحث حسب اسم المؤلف أو الكتاب..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='h-9.5'
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <AlphabetChips
                        selectedLetter=""
                        onSelectLetter={() => { }}
                        language={language}
                    />
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {error ? (
                        <div className="p-8 text-center text-red-600">{error}</div>
                    ) : filteredSources.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">لم يتم العثور على مصادر لهذا النص.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">المصدر</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">المؤلف / الكتاب</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredSources.map((source) => (
                                        <tr
                                            key={source.id}
                                            onClick={() => handleRowClick(source)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`${pathname}/${source.documentId || source.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-1 text-[#43896B] hover:text-[#367556] font-medium transition-colors"
                                                >
                                                    {source.word}
                                                </Link>
                                                {source.volumepage && (
                                                    <div className="text-sm text-gray-500 mt-1">{source.volumepage}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-800 font-medium">{source.author || '-'}</div>
                                                <div className="text-sm text-gray-500">{source.title || '-'}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
