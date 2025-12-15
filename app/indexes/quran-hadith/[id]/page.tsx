'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    postsApi,
    radisApi,
    quranHadithApi,
    Post,
    RadisIntroduction,
    QuranHadith
} from '@/api';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/app/components/button';
import { parseTextReference } from '@/app/utils/text-reference';

interface CombinedResult {
    type: 'Post' | 'Paragraph' | 'Radis';
    data: any;
    reference: string;
    sourceType?: 'Oration' | 'Letter' | 'Saying';
    matchingParagraphNumber?: string;
    matchingContent?: string;
}

// Robust text matcher (handles singular/plural)
const checkTextMatch = (text: string, term: string) => {
    if (!text) return false;
    const t = term.toLowerCase().trim();
    const txt = text.toLowerCase();

    if (txt.includes(t)) return true;

    // Simple stemming/pluralization
    if (t.endsWith('s') && txt.includes(t.slice(0, -1))) return true;
    if (t.endsWith('ies') && txt.includes(t.slice(0, -3) + 'y')) return true;
    if (t.endsWith('es') && txt.includes(t.slice(0, -2))) return true;

    return false;
};

// Extract only the sentence or portion containing the term
const extractMatchingSentence = (text: string, term: string): string | null => {
    if (!text || !term) return null;
    
    const t = term.toLowerCase().trim();
    const txtLower = text.toLowerCase();
    
    let termIndex = txtLower.indexOf(t);
    
    if (termIndex === -1) {
        if (t.endsWith('s')) {
            termIndex = txtLower.indexOf(t.slice(0, -1));
        } else if (t.endsWith('ies')) {
            termIndex = txtLower.indexOf(t.slice(0, -3) + 'y');
        } else if (t.endsWith('es')) {
            termIndex = txtLower.indexOf(t.slice(0, -2));
        }
    }
    
    if (termIndex === -1) return null;
    
    const sentenceEnders = /[.!?؟]/;
    
    let sentenceStart = 0;
    for (let i = termIndex - 1; i >= 0; i--) {
        if (sentenceEnders.test(text[i])) {
            sentenceStart = i + 1;
            break;
        }
    }
    
    let sentenceEnd = text.length;
    for (let i = termIndex; i < text.length; i++) {
        if (sentenceEnders.test(text[i])) {
            sentenceEnd = i + 1;
            break;
        }
    }
    
    let sentence = text.slice(sentenceStart, sentenceEnd).trim();
    
    if (sentence.length < 50 && text.length > sentence.length) {
        const contextStart = Math.max(0, termIndex - 100);
        const contextEnd = Math.min(text.length, termIndex + 100);
        sentence = text.slice(contextStart, contextEnd).trim();
        
        if (contextStart > 0) sentence = '...' + sentence;
        if (contextEnd < text.length) sentence = sentence + '...';
    }
    
    return sentence;
};

const getMatchingContent = (post: Post, term: string, language?: 'english' | 'arabic'): { content: string; paragraphNumber?: string } | null => {
    const title = (post.title || post.heading || '');
    if (language !== 'arabic' && checkTextMatch(title, term)) {
        const text = post.paragraphs?.[0]?.translations?.[0]?.text || post.translations?.[0]?.text || title;
        const matchingSentence = extractMatchingSentence(text, term);
        return { content: matchingSentence || text, paragraphNumber: undefined };
    }

    if (post.paragraphs && post.paragraphs.length > 0) {
        for (const p of post.paragraphs) {
            const eng = p.translations?.[0]?.text || '';
            const ara = p.arabic || '';
            const matchEng = language !== 'arabic' && checkTextMatch(eng, term);
            const matchAra = language !== 'english' && checkTextMatch(ara, term);

            if (matchEng || matchAra) {
                const fullText = (language === 'arabic' ? ara : eng) || (language === 'english' ? eng : ara);
                const matchingSentence = extractMatchingSentence(fullText, term);
                return { content: matchingSentence || fullText, paragraphNumber: p.number };
            }
        }
    }

    if (post.translations && language !== 'arabic') {
        for (const t of post.translations) {
            if (checkTextMatch(t.text, term)) {
                const matchingSentence = extractMatchingSentence(t.text, term);
                return { content: matchingSentence || t.text, paragraphNumber: undefined };
            }
        }
    }

    return null;
};

const isValidPost = (post: Post) => {
    if (post.title === 'Topic 1') return false;
    if (!post.sermonNumber) return false;
    return true;
};

export default function QuranHadithDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [results, setResults] = useState<CombinedResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<'english' | 'arabic' | undefined>(undefined);
    const [displayTitle, setDisplayTitle] = useState<string>('');

    const term = decodeURIComponent(params.id as string).trim();
    const refsParam = searchParams.get('refs');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            let detectedLanguage: 'english' | 'arabic' | undefined = undefined;

            try {
                let textNumbers: string[] = [];
                let indexItem: QuranHadith | null = null;

                if (refsParam) {
                    textNumbers = refsParam.split(',').filter(Boolean);
                    const isArabicChar = /[\u0600-\u06FF]/.test(term);
                    detectedLanguage = isArabicChar ? 'arabic' : 'english';
                    // Set display title from the term (verse translation)
                    setDisplayTitle(term);
                } else {
                    // Search by verse_translation first (most likely match from URL)
                    const indexResponse = await quranHadithApi.getQuranHadiths(1, 1, { verse_translation: term });
                    if (indexResponse.data && indexResponse.data.length > 0) {
                        indexItem = indexResponse.data[0];
                        detectedLanguage = 'english';
                        setDisplayTitle(indexItem.verse_translation || term);
                    } else {
                        // Fallback to surah_name search
                        const surahResponse = await quranHadithApi.getQuranHadiths(1, 1, { surah_name: term });
                        if (surahResponse.data && surahResponse.data.length > 0) {
                            indexItem = surahResponse.data[0];
                            detectedLanguage = 'english';
                            setDisplayTitle(indexItem.verse_translation || indexItem.surah_name || term);
                        } else {
                            // Fallback to Arabic text search
                            const arabicResponse = await quranHadithApi.getQuranHadiths(1, 1, { verse_text: term });
                            if (arabicResponse.data && arabicResponse.data.length > 0) {
                                indexItem = arabicResponse.data[0];
                                detectedLanguage = 'arabic';
                                setDisplayTitle(indexItem.verse_text || term);
                            } else {
                                setDisplayTitle(term);
                            }
                        }
                    }
                    if (indexItem && indexItem.text_numbers) {
                        textNumbers = indexItem.text_numbers.map(t => t.value);
                    }
                }

                setLanguage(detectedLanguage);

                const combined: CombinedResult[] = [];
                const fetchedIds = new Set<string>();

                if (textNumbers.length > 0) {
                    const promises = textNumbers.map(async (refValue) => {
                        const parsed = parseTextReference(refValue);
                        if (!parsed) return null;

                        const { type, sectionNumber } = parsed;

                        try {
                            if (type === 'introduction') {
                                const radisRes = await radisApi.getRadisIntroductionsByNumbers([sectionNumber]);
                                if (radisRes.data && radisRes.data.length > 0) {
                                    const item = radisRes.data[0];
                                    const textToSearch = detectedLanguage === 'arabic' ? (item.arabic || '') : (item.translation || '');
                                    const matchingSentence = extractMatchingSentence(textToSearch, term);
                                    return { 
                                        type: 'Radis', 
                                        data: item, 
                                        reference: refValue,
                                        matchingContent: matchingSentence || textToSearch.slice(0, 300) + (textToSearch.length > 300 ? '...' : '')
                                    };
                                }
                            } else {
                                const parts = sectionNumber.split('.');
                                const mainId = parts[0];
                                const subId = parts.length > 1 ? parts[1] : null;

                                const typeMap: Record<string, string> = { 'oration': 'Oration', 'letter': 'Letter', 'saying': 'Saying' };
                                const prefixMap: Record<string, string> = { 'oration': '1.', 'letter': '2.', 'saying': '3.' };

                                const querySermonNumber = `${prefixMap[type] || ''}${mainId}`;

                                const postsRes = await postsApi.getPosts({ filters: { sermonNumber: querySermonNumber } });
                                if (postsRes.data) {
                                    const matchedPost = postsRes.data.find(p => p.type === typeMap[type] && isValidPost(p));
                                    if (matchedPost) {
                                        if (subId) {
                                            const targetPara = matchedPost.paragraphs?.find(p => {
                                                if (!p.number) return false;
                                                const numStr = p.number.toString();
                                                return numStr === subId || numStr.endsWith(`.${subId}`) || numStr === `${querySermonNumber}.${subId}`;
                                            });

                                            if (targetPara) {
                                                const eng = targetPara.translations?.[0]?.text || '';
                                                const ara = targetPara.arabic || '';
                                                const textToSearch = detectedLanguage === 'arabic' ? ara : eng;
                                                const matchingSentence = extractMatchingSentence(textToSearch, term);
                                                return { 
                                                    type: 'Post', 
                                                    data: matchedPost, 
                                                    reference: refValue, 
                                                    sourceType: matchedPost.type as any,
                                                    matchingParagraphNumber: targetPara.number,
                                                    matchingContent: matchingSentence || textToSearch.slice(0, 300) + (textToSearch.length > 300 ? '...' : '')
                                                };
                                            }
                                        }
                                        // Fallback: return post even if no specific paragraph found
                                        const firstContent = matchedPost.paragraphs?.[0]?.translations?.[0]?.text || 
                                                           matchedPost.translations?.[0]?.text || 
                                                           matchedPost.heading || '';
                                        const matchingSentence = extractMatchingSentence(firstContent, term);
                                        return { 
                                            type: 'Post', 
                                            data: matchedPost, 
                                            reference: refValue, 
                                            sourceType: matchedPost.type as any,
                                            matchingContent: matchingSentence || firstContent.slice(0, 300) + (firstContent.length > 300 ? '...' : '')
                                        };
                                    }
                                }
                            }
                        } catch (e) {
                            console.error(`Failed to fetch ref ${refValue}`, e);
                        }
                        return null;
                    });

                    const resultsFromRefs = await Promise.all(promises);
                    resultsFromRefs.forEach(r => {
                        if (r && !fetchedIds.has(r.reference)) {
                            combined.push(r as CombinedResult);
                            fetchedIds.add(r.reference);
                        }
                    });
                }

                combined.sort((a, b) => {
                    return a.reference.localeCompare(b.reference, undefined, { numeric: true });
                });

                setResults(combined);

            } catch (err) {
                console.error('Error fetching details:', err);
                setError('Failed to load details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (term) {
            fetchData();
        }
    }, [term, refsParam]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#43896B]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={() => router.back()} variant="outlined">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Button
                        onClick={() => router.back()}
                        variant="outlined"
                        className="!p-2 -ml-2 border-none text-gray-500 hover:text-gray-700"
                        icon={<ArrowLeft className="w-5 h-5" />}
                    >
                        Back
                    </Button>
                    <h1 className="text-xl font-bold text-gray-800 text-center flex-1 line-clamp-1">
                        &ldquo;{displayTitle || term}&rdquo; <span className="text-sm font-normal text-gray-400 uppercase ml-2">{language}</span>
                    </h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
                {results.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-xl mb-4">No content found for &ldquo;{displayTitle || term}&rdquo;.</p>
                    </div>
                ) : (
                    results.map((item, index) => (
                        <ContentCard key={`${item.type}-${item.reference}-${index}`} item={item} term={term} language={language} />
                    ))
                )}
            </div>
        </div>
    );
}

function ContentCard({ item, term, language }: { item: CombinedResult; term: string; language?: 'english' | 'arabic' }) {
    const router = useRouter();
    const { type, data, matchingContent, matchingParagraphNumber } = item;

    const getNavigationUrl = (): string | null => {
        if (type === 'Post') {
            const post = data as Post;
            const contentTypeMap: Record<string, string> = {
                'Oration': 'orations',
                'Letter': 'letters',
                'Saying': 'sayings'
            };
            const contentType = contentTypeMap[post.type] || 'orations';
            
            const params = new URLSearchParams();
            
            const highlightRef = matchingParagraphNumber || post.sermonNumber;
            if (highlightRef) {
                params.set('highlightRef', highlightRef);
            }
            
            const isArabicTerm = /[\u0600-\u06FF]/.test(term);
            if (isArabicTerm) {
                params.set('arabicWord', term);
            } else {
                params.set('word', term);
            }
            
            const queryString = params.toString();
            return `/${contentType}/details/${post.id}${queryString ? `?${queryString}` : ''}`;
        }
        
        if (type === 'Radis') {
            const radis = data as RadisIntroduction;
            return `/radis?highlightRef=0.${radis.number}`;
        }
        
        return null;
    };

    const handleCardClick = () => {
        const url = getNavigationUrl();
        if (url) {
            router.push(url);
        }
    };

    if (type === 'Post') {
        const post = data as Post;
        
        const displayContent = matchingContent || 'No content available';

        let displayTitle = post.title || post.heading || `Oration ${post.sermonNumber}`;
        const isArabicTitle = /[\u0600-\u06FF]/.test(displayTitle);

        if (language === 'english' && isArabicTitle) {
            if (post.title && !/[\u0600-\u06FF]/.test(post.title)) {
                displayTitle = post.title;
            } else {
                const typeLabel = post.type === 'Oration' ? 'Sermon' : post.type;
                displayTitle = `${typeLabel} ${post.sermonNumber}`;
            }
        } else if (language === 'arabic' && !isArabicTitle) {
            if (post.heading && /[\u0600-\u06FF]/.test(post.heading)) {
                displayTitle = post.heading;
            }
        }

        return (
            <div 
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#43896B] transition-all cursor-pointer relative group"
                onClick={handleCardClick}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                            {post.type}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">#{post.sermonNumber}</span>
                        {matchingParagraphNumber && (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                Para: {matchingParagraphNumber}
                            </span>
                        )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#43896B] transition-colors">{displayTitle}</h3>

                <div className="space-y-4">
                    <div className="text-gray-700 leading-relaxed">
                        <HighlightText text={displayContent} term={term} />
                    </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-sm text-[#43896B] font-medium group-hover:underline">
                        View full {post.type.toLowerCase()} →
                    </span>
                </div>
            </div>
        );
    }

    if (type === 'Radis') {
        const radis = data as RadisIntroduction;
        
        const displayContent = matchingContent || (language === 'arabic' ? radis.arabic : radis.translation) || '';

        const showEng = language !== 'arabic' && radis.translation;
        const showAra = language !== 'english' && radis.arabic;

        if (!showEng && !showAra) return null;

        return (
            <div 
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#43896B] transition-all cursor-pointer relative group"
                onClick={handleCardClick}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                            Radis Introduction
                        </span>
                        <span className="text-gray-500 text-sm font-medium">#{radis.number}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#43896B] group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>

                <div className="text-gray-700 leading-relaxed">
                    <HighlightText text={displayContent} term={term} />
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="text-sm text-[#43896B] font-medium group-hover:underline">
                        View full introduction →
                    </span>
                </div>
            </div>
        );
    }

    return null;
}

function HighlightText({ text, term }: { text: string; term: string }) {
    if (!text) return null;
    if (!term) return <p className="text-gray-800 text-lg leading-loose">{text}</p>;

    const t = term.toLowerCase().trim();

    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let regexStr = escape(t);
    if (t.endsWith('ies')) regexStr = `${escape(t.slice(0, -3))}(?:y|ies)`;
    else if (t.endsWith('es')) regexStr = `${escape(t.slice(0, -2))}(?:es)?`;
    else if (t.endsWith('s')) regexStr = `${escape(t.slice(0, -1))}s?`;
    else regexStr = `${escape(t)}(?:s|es)?`;

    const parts = text.split(new RegExp(`(${regexStr})`, 'gi'));

    return (
        <p className="text-gray-800 text-lg leading-loose">
            {parts.map((part, i) =>
                new RegExp(`^${regexStr}$`, 'i').test(part) ? (
                    <span key={i} className="bg-yellow-200 text-gray-900 font-medium px-1 rounded">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </p>
    );
}
