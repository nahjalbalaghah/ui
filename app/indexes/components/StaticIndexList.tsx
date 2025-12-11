'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, Book, ArrowRight } from 'lucide-react';
import Button from '@/app/components/button';
import Input from '@/app/components/input';
import Pagination from '@/app/components/pagination';
import AlphabetChips from '@/app/components/alphabet-chips';
import { IndexCategory } from '@/app/data/indexes';

interface StaticIndexListProps {
    category: IndexCategory;
}

export default function StaticIndexList({ category }: StaticIndexListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL State
    const page = parseInt(searchParams.get('page') || '1');
    const searchQuery = searchParams.get('search') || '';
    const startLetter = searchParams.get('letter') || '';

    const [filterSearch, setFilterSearch] = useState(searchQuery);
    const pageSize = 20;

    useEffect(() => {
        setFilterSearch(searchQuery);
    }, [searchQuery]);

    // Filter Logic
    const filteredItems = useMemo(() => {
        let items = [...category.items];

        // Alphabet Filter
        if (startLetter) {
            items = items.filter(item =>
                item.word.toLowerCase().startsWith(startLetter.toLowerCase())
            );
        }

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.word.toLowerCase().includes(q)
            );
        }

        // Sort Alphabetically
        items.sort((a, b) => a.word.localeCompare(b.word));

        return items;
    }, [category.items, startLetter, searchQuery]);

    // Pagination Logic
    const total = filteredItems.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

    // Handlers
    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (filterSearch) params.set('search', filterSearch);
        if (startLetter) params.set('letter', startLetter);
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setFilterSearch('');
        router.push(pathname);
    };

    const handleLetterSelect = (letter: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (letter === startLetter) {
            params.delete('letter'); // Toggle off
        } else {
            params.set('letter', letter);
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasActiveFilters = searchQuery || startLetter;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">{category.title}</h1>
                    <p className="text-lg text-gray-600">
                        {category.description}
                    </p>
                </div>

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

                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Input
                                label="Search"
                                placeholder={`Search ${category.title}...`}
                                value={filterSearch}
                                onChange={(e) => setFilterSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                            />
                        </div>
                        <div className="mb-[2px]">
                            <Button
                                onClick={handleApplyFilters}
                                variant='outlined'
                                icon={<Search className="w-4 h-4" />}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <AlphabetChips
                        selectedLetter={startLetter}
                        onSelectLetter={handleLetterSelect}
                        language="English"
                    />
                </div>

                <div>
                    {total === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium text-lg">No items found</p>
                            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{(page - 1) * pageSize + 1}</span>-<span className="font-semibold text-gray-900">{Math.min(page * pageSize, total)}</span> of <span className="font-semibold text-gray-900">{total}</span>
                                </p>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed">
                                        <colgroup>
                                            <col className="w-1/3" />
                                            <col />
                                            <col className="w-24" />
                                        </colgroup>
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Word</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ref Count</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {paginatedItems.map((item) => {
                                                const targetUrl = `${pathname}/${encodeURIComponent(item.word)}`;

                                                return (
                                                    <tr
                                                        key={item.word}
                                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                                        onClick={() => router.push(targetUrl)}
                                                    >
                                                        <td className="px-6 py-4 text-gray-800 font-medium group-hover:text-[#43896B] transition-colors">
                                                            {item.word}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {item.references.length} references
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-center">
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors">
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile List */}
                            <div className="md:hidden space-y-4">
                                {paginatedItems.map((item) => {
                                    const targetUrl = `${pathname}/${encodeURIComponent(item.word)}`;
                                    return (
                                        <div
                                            key={item.word}
                                            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm cursor-pointer hover:border-[#43896B] transition-colors group"
                                            onClick={() => router.push(targetUrl)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-base font-semibold text-gray-900 group-hover:text-[#43896B] transition-colors">
                                                        {item.word}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {item.references.length} references
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        loading={false}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
