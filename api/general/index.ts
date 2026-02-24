import api from '../api';

export interface GeneralIndexTextNumber {
    id: number;
    value: string;
}

export interface GeneralIndexItem {
    id: number;
    documentId: string;
    section: string;
    word_english: string;
    word_arabic: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    text_numbers: GeneralIndexTextNumber[];
}

export interface GeneralIndexApiResponse {
    data: GeneralIndexItem[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface GeneralIndexFilters {
    section?: string;
    word_english?: string;
    word_arabic?: string;
    startsWith_english?: string;
    startsWith_arabic?: string;
    language?: 'English' | 'Arabic';
}

export const generalIndexApi = {
    async getGeneralIndex(
        page = 1,
        pageSize = 20,
        filters?: GeneralIndexFilters
    ): Promise<GeneralIndexApiResponse> {
        try {
            const params: Record<string, any> = {
                'populate': '*',
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
            };

            if (filters?.section) {
                params['filters[section][$eq]'] = filters.section;
            }
            if (filters?.word_english) {
                params['filters[word_english][$containsi]'] = filters.word_english;
            }
            if (filters?.word_arabic) {
                params['filters[word_arabic][$containsi]'] = filters.word_arabic;
            }

            if (filters?.startsWith_english) {
                params['filters[word_english][$startsWithi]'] = filters.startsWith_english;
            }
            if (filters?.startsWith_arabic) {
                params['filters[word_arabic][$startsWithi]'] = filters.startsWith_arabic;
            }

            if (filters?.language === 'English') {
                params['filters[word_english][$null]'] = 'false';
                params['filters[word_english][$ne]'] = '';
            } else if (filters?.language === 'Arabic') {
                params['filters[word_arabic][$null]'] = 'false';
                params['filters[word_arabic][$ne]'] = '';
            }

            // Assuming the endpoint will be created in the CMS
            const response = await api.get('/api/general-indexes', {
                params,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching general index:', error);
            throw error;
        }
    },

    async getAllGeneralIndex(): Promise<GeneralIndexItem[]> {
        try {
            const firstPage = await this.getGeneralIndex(1, 100);
            let allData = firstPage.data || [];
            const pageCount = firstPage.meta.pagination.pageCount;

            if (pageCount > 1) {
                const promises = [];
                for (let i = 2; i <= pageCount; i++) {
                    promises.push(this.getGeneralIndex(i, 100));
                }
                const responses = await Promise.all(promises);
                responses.forEach(res => {
                    if (res.data) allData = [...allData, ...res.data];
                });
            }

            return allData;
        } catch (error) {
            console.error('Error fetching all general index items:', error);
            throw error;
        }
    },

    async getGeneralIndexById(id: string): Promise<{ data: GeneralIndexItem }> {
        try {
            const response = await api.get(`/api/general-indexes/${id}`, {
                params: {
                    'populate': '*',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching general index item:', error);
            throw error;
        }
    },

    async getSections(): Promise<string[]> {
        try {
            const response = await this.getGeneralIndex(1, 100);
            const sections = new Set<string>();
            response.data.forEach((item) => {
                if (item.section) {
                    sections.add(item.section);
                }
            });
            return Array.from(sections).sort();
        } catch (error) {
            console.error('Error fetching sections:', error);
            throw error;
        }
    },
};
