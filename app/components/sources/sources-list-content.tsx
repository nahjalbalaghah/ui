'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ScrollText, ArrowRight, X, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import AlphabetChips from '@/app/components/alphabet-chips';
import { glossaryEntriesApi, GlossaryEntry } from '@/api/glossary-entries';

interface SourcesListContentProps {
    contentTypeLabel: string;
    itemNumber: string;
}

export default function SourcesListContent({ contentTypeLabel, itemNumber }: SourcesListContentProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState<'English' | 'Arabic'>('English');
    const [sources, setSources] = useState<GlossaryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                setLoading(true);
                // Determine if this is a post-level number (e.g. "1.1") or paragraph-level (e.g. "1.1.1")
                const parts = itemNumber.split('.');
                const isPostLevel = parts.length <= 2;
                const response = await glossaryEntriesApi.getGlossaryEntries(
                    isPostLevel
                        ? { postSermonNumber: itemNumber }
                        : { paragraphNumber: itemNumber }
                );
                setSources(response.data);
            } catch (err) {
                console.error('Failed to fetch sources:', err);
                setError('Failed to load sources. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (itemNumber) {
            fetchSources();
        }
    }, [itemNumber]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setLanguage('English');
    };

    const hasActiveFilters = searchQuery !== '' || language !== 'English';

    const filteredSources = sources.filter(source => {
        const matchesSearch = source.word.toLowerCase().includes(searchQuery.toLowerCase());
        // For now, Strapi data might not have language field, so we just filter by search
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#43896B] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading sources...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ScrollText className="w-6 h-6 text-[#43896B]" />
                        <h1 className="text-3xl font-bold text-gray-900">Sources for {contentTypeLabel} {itemNumber}</h1>
                    </div>
                    <p className="text-gray-600">Historical sources and references verifying the authenticity of this text.</p>
                </div>

                {/* Filter Banner Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                        {hasActiveFilters && (
                            <Button
                                onClick={handleClearFilters}
                                variant='danger'
                                icon={<X className="w-4 h-4" />}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-sm text-gray-700 mb-1">Language</label>
                            <Select
                                value={language}
                                onChange={(value) => setLanguage(value as 'English' | 'Arabic')}
                                options={[
                                    { value: 'English', label: 'English' },
                                    { value: 'Arabic', label: 'Arabic' }
                                ]}
                                placeholder="Select Language"
                            />
                        </div>
                        <Input
                            label="Search Source"
                            placeholder="Search by author or book name..."
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
                        <div className="p-8 text-center text-gray-500">No sources found for this text.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 w-32">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Source Word</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 w-32">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredSources.map((source) => (
                                        <tr key={source.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 align-top">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#43896B]/10 text-[#43896B] font-bold text-sm">
                                                    #{source.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`${pathname}/${source.documentId}`}
                                                    className="inline-flex items-center gap-1 text-[#43896B] hover:text-[#367556] font-medium transition-colors group"
                                                >
                                                    {source.word}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`${pathname}/${source.documentId}`}>
                                                    <Button
                                                        variant="outlined"
                                                        icon={<ArrowRight className="w-4 h-4" />}
                                                    >
                                                        Details
                                                    </Button>
                                                </Link>
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
