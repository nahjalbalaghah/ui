import api from '../api';
import type { LinkedFootnote } from '../index-terms';

export interface QuranHadithTextNumber {
  id: number;
  value: string;
}

export interface QuranHadith {
  id: number;
  documentId: string;
  surah_number: string;
  surah_name: string;
  surah_name_arabic?: string;
  arabic_name?: string;
  verse_numbers: string;
  verse_text: string;
  verse_translation: string;
  reference_type?: string;
  title?: string;
  reference?: string;
  poet?: string;
  arabic_text?: string;
  english_translation?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  text_numbers: QuranHadithTextNumber[];
  LinkFootnote?: LinkedFootnote[];
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
  _normalizeItem(item: any): QuranHadith {
    const rawCategory = item.reference_type || item.category || '';
    const normalizedCategory = rawCategory.toLowerCase() === 'parables' ? 'Proverbs' : rawCategory;
    return {
      ...item,
      surah_number: item.surah_number || '',
      surah_name: item.surah_name || item.reference || item.title || '',
      surah_name_arabic: item.surah_name_arabic || item.arabic_name || '',
      arabic_name: item.arabic_name || item.surah_name_arabic || '',
      verse_numbers: item.verse_numbers || '',
      verse_text: item.verse_text || item.arabic_text || '',
      verse_translation: item.verse_translation || item.english_translation || '',
      reference_type: normalizedCategory,
      title: item.title || '',
      reference: item.reference || '',
      arabic_text: item.arabic_text || item.verse_text || '',
      english_translation: item.english_translation || item.verse_translation || '',
      category: normalizedCategory,
      text_numbers: Array.isArray(item.text_numbers) ? item.text_numbers : [],
    };
  },

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
        if (filters.reference_type === 'Proverbs') {
          params['filters[category][$in][0]'] = 'Proverbs';
          params['filters[category][$in][1]'] = 'Parables';
        } else {
          params['filters[category][$eq]'] = filters.reference_type;
        }
      }
      if (filters?.surah_name) {
        params['filters[reference][$containsi]'] = filters.surah_name;
      }
      if (filters?.surah_number) {
        params['filters[surah_number][$eq]'] = filters.surah_number;
      }
      if (filters?.verse_translation) {
        params['filters[english_translation][$containsi]'] = filters.verse_translation;
      }
      if (filters?.verse_text) {
        params['filters[arabic_text][$containsi]'] = filters.verse_text;
      }

      if (filters?.startsWith_surah) {
        params['filters[reference][$startsWithi]'] = filters.startsWith_surah;
      }
      if (filters?.startsWith_verse) {
        params['filters[arabic_text][$startsWithi]'] = filters.startsWith_verse;
      }

      if (filters?.language === 'English') {
        params['filters[english_translation][$null]'] = 'false';
        params['filters[english_translation][$ne]'] = '';
      } else if (filters?.language === 'Arabic') {
        params['filters[arabic_text][$null]'] = 'false';
        params['filters[arabic_text][$ne]'] = '';
      }

      const response = await api.get('/api/quran-hadiths', {
        params,
      });

      return {
        ...response.data,
        data: (response.data.data || []).map((item: any) => quranHadithApi._normalizeItem(item)),
      };
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
      const firstPage = await quranHadithApi.getQuranHadiths(1, 100);
      let allData = firstPage.data || [];
      const pageCount = firstPage.meta.pagination.pageCount;

      if (pageCount > 1) {
        const promises = [];
        for (let i = 2; i <= pageCount; i++) {
          promises.push(quranHadithApi.getQuranHadiths(i, 100));
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
      return {
        ...response.data,
        data: quranHadithApi._normalizeItem(response.data.data),
      };
    } catch (error) {
      console.error('Error fetching quran/hadith:', error);
      throw error;
    }
  },

  async getSurahNames(): Promise<{ name: string; arabicName: string }[]> {
    try {
      const response = await quranHadithApi.getQuranHadiths(1, 200);
      const uniqueNames = new Map<string, string>();
      response.data.forEach((item) => {
        if (item.surah_name) {
          uniqueNames.set(item.surah_name, item.surah_name_arabic || '');
        }
      });
      return Array.from(uniqueNames.entries())
        .map(([name, arabicName]) => ({ name, arabicName }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching surah names:', error);
      throw error;
    }
  },
};
