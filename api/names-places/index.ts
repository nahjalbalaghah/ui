import api from '../api';

export interface NamePlaceTextNumber {
  id: number;
  value: string;
}

export interface NamePlace {
  id: number;
  documentId: string;
  section: string;
  word_english: string;
  word_arabic: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  text_numbers: NamePlaceTextNumber[];
}

export interface NamePlacesApiResponse {
  data: NamePlace[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface NamePlacesFilters {
  section?: string;
  word_english?: string;
  word_arabic?: string;
  startsWith_english?: string;
  startsWith_arabic?: string;
  language?: 'English' | 'Arabic';
}

export const namePlacesApi = {
  async getNamePlaces(
    page = 1,
    pageSize = 20,
    filters?: NamePlacesFilters
  ): Promise<NamePlacesApiResponse> {
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

      const response = await api.get('/api/name-and-places', {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching names and places:', error);
      throw error;
    }
  },

  /**
   * Fetch all results by following pagination
   */
  async getAllNamePlaces(): Promise<NamePlace[]> {
    try {
      const firstPage = await this.getNamePlaces(1, 100);
      let allData = firstPage.data || [];
      const pageCount = firstPage.meta.pagination.pageCount;

      if (pageCount > 1) {
        const promises = [];
        for (let i = 2; i <= pageCount; i++) {
          promises.push(this.getNamePlaces(i, 100));
        }
        const responses = await Promise.all(promises);
        responses.forEach(res => {
          if (res.data) allData = [...allData, ...res.data];
        });
      }

      return allData;
    } catch (error) {
      console.error('Error fetching all names and places:', error);
      throw error;
    }
  },

  async getNamePlaceById(id: string): Promise<{ data: NamePlace }> {
    try {
      const response = await api.get(`/api/name-and-places/${id}`, {
        params: {
          'populate': '*',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching name/place:', error);
      throw error;
    }
  },

  async getSections(): Promise<string[]> {
    try {
      const response = await this.getNamePlaces(1, 100);
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
