import api from '../api';

export interface QuranHadithTextNumber {
  id: number;
  value: string;
}

export interface QuranHadith {
  id: number;
  documentId: string;
  surah_number: string;
  surah_name: string;
  verse_numbers: string;
  verse_text: string;
  verse_translation: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  text_numbers: QuranHadithTextNumber[];
}

export interface QuranHadithApiResponse {
  data: QuranHadith[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface QuranHadithFilters {
  surah_name?: string;
  surah_number?: string;
  verse_translation?: string;
  verse_text?: string;
  startsWith_surah?: string;
  startsWith_verse?: string;
  language?: 'English' | 'Arabic';
  reference_type?: 'Quran' | 'Hadith' | 'Poetry' | 'Proverbs' | '';
}

export const quranHadithApi = {
  async getQuranHadiths(
    page = 1,
    pageSize = 20,
    filters?: QuranHadithFilters
  ): Promise<QuranHadithApiResponse> {
    try {
      const params: Record<string, any> = {
        'populate': '*',
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      };

      if (filters?.reference_type) {
        params['filters[reference_type][$eq]'] = filters.reference_type;
      }
      if (filters?.surah_name) {
        params['filters[surah_name][$containsi]'] = filters.surah_name;
      }
      if (filters?.surah_number) {
        params['filters[surah_number][$eq]'] = filters.surah_number;
      }
      if (filters?.verse_translation) {
        params['filters[verse_translation][$containsi]'] = filters.verse_translation;
      }
      if (filters?.verse_text) {
        params['filters[verse_text][$containsi]'] = filters.verse_text;
      }

      if (filters?.startsWith_surah) {
        params['filters[surah_name][$startsWithi]'] = filters.startsWith_surah;
      }
      if (filters?.startsWith_verse) {
        params['filters[verse_text][$startsWithi]'] = filters.startsWith_verse;
      }

      if (filters?.language === 'English') {
        params['filters[verse_translation][$null]'] = 'false';
        params['filters[verse_translation][$ne]'] = '';
      } else if (filters?.language === 'Arabic') {
        params['filters[verse_text][$null]'] = 'false';
        params['filters[verse_text][$ne]'] = '';
      }

      const response = await api.get('/api/quran-hadiths', {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching quran and hadiths:', error);
      throw error;
    }
  },

  /**
   * Fetch all results by following pagination
   */
  async getAllQuranHadiths(): Promise<QuranHadith[]> {
    try {
      const firstPage = await this.getQuranHadiths(1, 100);
      let allData = firstPage.data || [];
      const pageCount = firstPage.meta.pagination.pageCount;

      if (pageCount > 1) {
        const promises = [];
        for (let i = 2; i <= pageCount; i++) {
          promises.push(this.getQuranHadiths(i, 100));
        }
        const responses = await Promise.all(promises);
        responses.forEach(res => {
          if (res.data) allData = [...allData, ...res.data];
        });
      }

      return allData;
    } catch (error) {
      console.error('Error fetching all quran and hadiths:', error);
      throw error;
    }
  },

  async getQuranHadithById(id: string): Promise<{ data: QuranHadith }> {
    try {
      const response = await api.get(`/api/quran-hadiths/${id}`, {
        params: {
          'populate': '*',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quran/hadith:', error);
      throw error;
    }
  },

  async getSurahNames(): Promise<string[]> {
    try {
      const response = await this.getQuranHadiths(1, 200);
      const names = new Set<string>();
      response.data.forEach((item) => {
        if (item.surah_name) {
          names.add(item.surah_name);
        }
      });
      return Array.from(names).sort();
    } catch (error) {
      console.error('Error fetching surah names:', error);
      throw error;
    }
  },
};
