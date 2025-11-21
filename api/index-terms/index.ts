import api from '../api';

export interface TextNumber {
  id: number;
  value: string;
}

export interface IndexTerm {
  id: number;
  documentId: string;
  section: string;
  word_english: string;
  word_arabic: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  text_numbers: TextNumber[];
}

export interface IndexTermsApiResponse {
  data: IndexTerm[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface IndexTermsFilters {
  section?: string;
  word_english?: string;
  word_arabic?: string;
  language?: 'English' | 'Arabic';
}

export const indexTermsApi = {
  async getIndexTerms(
    page = 1,
    pageSize = 20,
    filters?: IndexTermsFilters
  ): Promise<IndexTermsApiResponse> {
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
      
      if (filters?.language === 'English') {
        params['filters[word_english][$null]'] = 'false';
        params['filters[word_english][$ne]'] = '';
      } else if (filters?.language === 'Arabic') {
        params['filters[word_arabic][$null]'] = 'false';
        params['filters[word_arabic][$ne]'] = '';
      }

      const response = await api.get('/api/index-terms', {
        params,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching index terms:', error);
      throw error;
    }
  },

  async getIndexTermById(id: string): Promise<{ data: IndexTerm }> {
    try {
      const response = await api.get(`/api/index-terms/${id}`, {
        params: {
          'populate': '*',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching index term:', error);
      throw error;
    }
  },

  async getSections(): Promise<string[]> {
    try {
      const response = await this.getIndexTerms(1, 100);
      const sections = new Set<string>();
      response.data.forEach((term) => {
        if (term.section) {
          sections.add(term.section);
        }
      });
      return Array.from(sections).sort();
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  },
};
