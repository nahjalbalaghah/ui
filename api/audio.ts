import api from './api';

export interface AudioUpload {
    id: number;
    documentId: string;
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

export const audioApi = {
    async getAudioBySermonNumber(sermonNumber: string): Promise<AudioUpload | null> {
        try {
            const params = {
                'filters[post][sermonNumber][$eq]': sermonNumber,
                'populate[audioFile][fields]': 'url,name',
                'populate[post][fields]': 'sermonNumber',
            };

            const response = await api.get<AudioApiResponse>('/api/audio-uploads', { params });

            if (response.data.data && response.data.data.length > 0) {
                return response.data.data[0];
            }
            return null;
        } catch (error) {
            console.error('Error fetching audio:', error);
            return null;
        }
    },
};
