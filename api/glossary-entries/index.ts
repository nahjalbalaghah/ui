import api from '../api';

export interface GlossaryEntry {
  id: number;
  documentId: string;
  word: string;
  content: string;
  author?: string | null;
  title?: string | null;
  volumepage?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  paragraphs?: {
    id: number;
    number: string;
  }[];
  posts?: {
    id: number;
    sermonNumber: string;
  }[];
}

export interface GlossaryEntriesApiResponse {
  data: GlossaryEntry[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const glossaryEntriesApi = {
  async getGlossaryEntries(options: {
    page?: number;
    pageSize?: number;
    paragraphNumber?: string;
    postSermonNumber?: string;
  } = {}): Promise<GlossaryEntriesApiResponse> {
    try {
      const { page = 1, pageSize = 25, paragraphNumber, postSermonNumber } = options;
      const params: any = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'populate[paragraphs][fields][0]': 'number',
        'populate[posts][fields][0]': 'sermonNumber',
      };

      if (paragraphNumber) {
        params['filters[paragraphs][number][$eq]'] = paragraphNumber;
      }

      if (postSermonNumber) {
        // Sources can be attached either directly to a post or to one of its
        // paragraphs. Include both relations when deciding whether to show the
        // Sources control for an oration, letter, or saying.
        params['filters[$or][0][posts][sermonNumber][$eq]'] = postSermonNumber;
        params['filters[$or][1][paragraphs][number][$startsWith]'] = `${postSermonNumber}.`;
      }

      const response = await api.get('/api/glossary-entries', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching glossary entries:', error);
      throw error;
    }
  },

  async getGlossaryEntryByWord(word: string): Promise<GlossaryEntry | null> {
    try {
      const params: any = {
        'filters[word][$eq]': word,
        'populate': '*',
      };

      const response = await api.get('/api/glossary-entries', { params });
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching glossary entry by word:', error);
      throw error;
    }
  },

  async getGlossaryEntryByDocumentId(documentId: string): Promise<GlossaryEntry | null> {
    try {
      const params: any = {
        'populate': '*',
      };
      if (/^\d+$/.test(documentId)) params['filters[id][$eq]'] = documentId;
      else params['filters[documentId][$eq]'] = documentId;

      const response = await api.get('/api/glossary-entries', { params });
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching glossary entry by documentId:', error);
      throw error;
    }
  }
};
