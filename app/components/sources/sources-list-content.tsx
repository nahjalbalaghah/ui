'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ScrollText, ArrowRight, X, Search, Book } from 'lucide-react';
import Link from 'next/link';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Select from '@/app/components/select';
import AlphabetChips from '@/app/components/alphabet-chips';

interface SourcesListContentProps {
    contentTypeLabel: string;
    itemNumber: string;
}

const sourcesData = [
    {
        textNo: "1.1.1",
        references: [
            { name: "Thaqafī", ref: "1:170–176" },
            { name: "Kulaynī", ref: "1:134–136" },
            { name: "Ḥarrānī", ref: "61" },
            { name: "Quḍāʿī", ref: "Dustūr 170" },
            { name: "Ṭabrisī", ref: "Iḥtijāj 1:294, 2:174 (attrib. ʿAlī al-Riḍā)" },
            { name: "Ḥātim", ref: "Tuḥfah 22" },
            { name: "Ibn Ṭalḥah", ref: "154" }
        ]
    }
];

export default function SourcesListContent({ contentTypeLabel, itemNumber }: SourcesListContentProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState<'English' | 'Arabic'>('English');

    const handleClearFilters = () => {
        setSearchQuery('');
        setLanguage('English');
    };

    const hasActiveFilters = searchQuery !== '' || language !== 'English';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ScrollText className="w-6 h-6 text-[#43896B]" />
                        <h1 className="text-3xl font-bold text-gray-900">Sources for {contentTypeLabel}</h1>
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
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant='outlined'
                            icon={<Search className="w-4 h-4" />}
                        >
                            Apply Filters
                        </Button>
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
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 w-32">Text No</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">References</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sourcesData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 align-top">
                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#43896B]/10 text-[#43896B] font-bold text-sm">
                                                {item.textNo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2 text-gray-700 leading-relaxed">
                                                {item.references.map((ref, i) => (
                                                    <React.Fragment key={i}>
                                                        <Link
                                                            href={`${pathname}/${ref.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                                                            className="inline-flex items-center gap-1 text-[#43896B] hover:text-[#367556] font-medium transition-colors bg-white border border-[#43896B]/20 px-2 py-0.5 rounded-md hover:bg-[#43896B]/5 group"
                                                        >
                                                            {ref.name}
                                                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </Link>
                                                        <span className="text-gray-500 mr-2">{ref.ref}{i < item.references.length - 1 ? ';' : ''}</span>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
