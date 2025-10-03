import api from '../api';

export interface Translation {
  id?: number;
  type: string;
  text: string;
}

export interface Footnote {
  id: number;
  documentId: string;
  number: string;
  section: string;
  arabic_word: string;
  english_word: string;
  arabic_interpretation: string;
  english_translation: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  english_word_index?: string | number;
  arabic_word_index?: string | number;
}


export interface Tag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Paragraph {
  id: number;
  documentId: string;
  arabic: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  translations: Translation[];
  footnotes?: Footnote[];
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  type: string;
  availableTranslations: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  translations: Translation[] | null;
  sermonNumber: string | null;
  heading?: string;
  paragraphs: Paragraph[];
  tags: Tag[];
  footnotes: Footnote[];
}

export interface ApiResponse {
  data: Post[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const orationsApi = {
  async getOrations(page = 1, pageSize = 9): Promise<ApiResponse> {
    try {
      const response = await api.get('/api/posts', {
        params: {
          'filters[type][$eq]': 'Oration',
          'populate[footnotes]': true,
          'populate[paragraphs][populate][translations]': true,
          'populate[paragraphs][populate][footnotes]': true,
          'populate[tags]': true,
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orations:', error);
      throw error;
    }
  },

  async getOrationBySlug(slug: string): Promise<Post | null> {
    try {
      const response = await api.get('/api/posts', {
        params: {
          'filters[slug][$eq]': slug,
          'filters[type][$eq]': 'Oration',
          'populate[footnotes]': true,
          'populate[paragraphs][populate][translations]': true,
          'populate[paragraphs][populate][footnotes]': true,
          'populate[tags]': true,
        },
      });
      
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching oration by slug:', error);
      throw error;
    }
  },

  async searchOrations(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    try {
      const response = await api.get('/api/posts', {
        params: {
          'filters[type][$eq]': 'Oration',
          'filters[$or][0][title][$containsi]': query,
          'filters[$or][1][heading][$containsi]': query,
          'filters[$or][2][paragraphs][arabic][$containsi]': query,
          'filters[$or][3][paragraphs][translations][text][$containsi]': query,
          'populate[footnotes]': true,
          'populate[paragraphs][populate][translations]': true,
          'populate[paragraphs][populate][footnotes]': true,
          'populate[tags]': true,
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching orations:', error);
      throw error;
    }
  },

  async getOrationBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const response = await api.get('/api/posts', {
        params: {
          'filters[sermonNumber][$eq]': sermonNumber,
          'filters[type][$eq]': 'Oration',
          'populate[footnotes]': true,
          'populate[paragraphs][populate][translations]': true,
          'populate[paragraphs][populate][footnotes]': true,
          'populate[tags]': true,
        },
      });
      
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching oration by sermon number:', error);
      throw error;
    }
  },
};
