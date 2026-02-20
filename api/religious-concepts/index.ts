import api from '../api';

export interface ReligiousConceptTextNumber {
  id: number;
  value: string;
}

export interface ReligiousConcept {
  id: number;
  documentId: string;
  section: string;
  word_english: string;
  word_arabic: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  text_numbers: ReligiousConceptTextNumber[];
}

export interface ReligiousConceptsApiResponse {
  data: ReligiousConcept[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ReligiousConceptsFilters {
  section?: string;
  word_english?: string;
  word_arabic?: string;
  startsWith_english?: string;
  startsWith_arabic?: string;
  language?: 'English' | 'Arabic';
}

export const religiousConceptsApi = {
  async getReligiousConcepts(
    page = 1,
    pageSize = 20,
    filters?: ReligiousConceptsFilters
  ): Promise<ReligiousConceptsApiResponse> {
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

      const response = await api.get('/api/religious-and-ethical-concepts', {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching religious concepts:', error);
      throw error;
    }
  },

  /**
   * Fetch all results by following pagination
   */
  async getAllReligiousConcepts(): Promise<ReligiousConcept[]> {
    try {
      const firstPage = await this.getReligiousConcepts(1, 100);
      let allData = firstPage.data || [];
      const pageCount = firstPage.meta.pagination.pageCount;

      if (pageCount > 1) {
        const promises = [];
        for (let i = 2; i <= pageCount; i++) {
          promises.push(this.getReligiousConcepts(i, 100));
        }
        const responses = await Promise.all(promises);
        responses.forEach(res => {
          if (res.data) allData = [...allData, ...res.data];
        });
      }

      return allData;
    } catch (error) {
      console.error('Error fetching all religious concepts:', error);
      throw error;
    }
  },

  async getReligiousConceptById(id: string): Promise<{ data: ReligiousConcept }> {
    try {
      const response = await api.get(`/api/religious-and-ethical-concepts/${id}`, {
        params: {
          'populate': '*',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching religious concept:', error);
      throw error;
    }
  },

  async getSections(): Promise<string[]> {
    try {
      const response = await this.getReligiousConcepts(1, 100);
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
