import api from './api';

interface AudioFileItem {
    id: number;
    documentId: string;
    url: string;
    name: string;
}

export interface AudioUpload {
    id: number;
    documentId: string;
    edition?: {
        id: number;
        documentId: string;
        title: string;
    };
    audio?: {
        id: number;
        arabic?: AudioFileItem[];
        english?: AudioFileItem[];
    };
    audioTracks?: {
        arabic?: AudioFileItem;
        english?: AudioFileItem;
    };
    audioFile: {
        id: number;
        documentId: string;
        url: string;
        name: string;
    };
    post: {
        id: number;
        documentId: string;
        sermonNumber: string;
    };
}

export interface AudioApiResponse {
    data: AudioUpload[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

const toAbsoluteMediaUrl = (url?: string): string => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://test-admin.nahjalbalaghah.org${url.startsWith('/') ? '' : '/'}${url}`;
};

const normalizeAudioUpload = (item: any): AudioUpload => {
    const fallbackFile = item?.audioFile;
    const arabicTrack = item?.audio?.arabic?.[0]
        ? {
            id: item.audio.arabic[0].id,
            documentId: item.audio.arabic[0].documentId,
            url: toAbsoluteMediaUrl(item.audio.arabic[0].url),
            name: item.audio.arabic[0].name,
        }
        : undefined;
    const englishTrack = item?.audio?.english?.[0]
        ? {
            id: item.audio.english[0].id,
            documentId: item.audio.english[0].documentId,
            url: toAbsoluteMediaUrl(item.audio.english[0].url),
            name: item.audio.english[0].name,
        }
        : undefined;
    const nestedFile = arabicTrack || englishTrack || fallbackFile;

    return {
        ...item,
        audioTracks: {
            arabic: arabicTrack,
            english: englishTrack,
        },
        audioFile: nestedFile
            ? {
                id: nestedFile.id,
                documentId: nestedFile.documentId,
                url: toAbsoluteMediaUrl(nestedFile.url),
                name: nestedFile.name,
            }
            : {
                id: 0,
                documentId: '',
                url: '',
                name: '',
            },
    };
};

export const audioApi = {
    async getAudioBySermonNumber(sermonNumber: string): Promise<AudioUpload | null> {
        try {
            const params = {
                'filters[post][sermonNumber][$eq]': sermonNumber,
                'populate[edition]': true,
                'populate[post]': true,
                'populate[audio][populate]': '*',
            };

            const response = await api.get<AudioApiResponse>('/api/audio-uploads', { params });

            if (response.data.data && response.data.data.length > 0) {
                return normalizeAudioUpload(response.data.data[0]);
            }
            return null;
        } catch (error) {
            console.error('Error fetching audio:', error);
            return null;
        }
    },
};
