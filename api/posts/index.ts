import api from '../api';
import { Post, ApiResponse, Translation, Tag, Paragraph, Footnote } from '../orations';

export type { Post, ApiResponse, Translation, Tag, Paragraph, Footnote };

export interface PostFilters {
  type?: string;
  search?: string;
  tags?: string[];
  sermonNumber?: string;
  paragraphNumber?: string;
  [key: string]: any;
}

export interface PostsApiOptions {
  page?: number;
  pageSize?: number;
  filters?: PostFilters;
  populate?: string[];
  sort?: string;
}

export const postsApi = {
  async getPosts(options: PostsApiOptions = {}): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        pageSize = 9,
        filters = {},
        populate = ['footnotes', 'paragraphs.footnotes', 'paragraphs.translations', 'tags', 'translations'],
        sort
      } = options;

      const params: any = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      };

      if (filters.type) {
        params['filters[type][$eq]'] = filters.type;
      }

      if (filters.sermonNumber) {
        params['filters[sermonNumber][$eq]'] = filters.sermonNumber;
      }

      if (filters.paragraphNumber) {
        params['filters[paragraphs][number][$startsWith]'] = filters.paragraphNumber;
      }

      if (filters.search) {
        params['filters[$or][0][title][$containsi]'] = filters.search;
        params['filters[$or][1][heading][$containsi]'] = filters.search;
        params['filters[$or][2][paragraphs][arabic][$containsi]'] = filters.search;
        params['filters[$or][3][paragraphs][translations][text][$containsi]'] = filters.search;
      }

      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag, index) => {
          params[`filters[tags][name][$in][${index}]`] = tag;
        });
      }

      params['populate[footnotes]'] = true;
      params['populate[paragraphs][populate][translations]'] = true;
      params['populate[paragraphs][populate][footnotes]'] = true;
      params['populate[tags]'] = true;

      if (sort) {
        params['sort'] = sort;
      }

      console.log('Final API params:', params);

      const response = await api.get('/api/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  async getPostsForListing(options: PostsApiOptions = {}): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        pageSize = 24,
        filters = {},
        sort
      } = options;

      const params: any = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      };

      if (filters.type) {
        params['filters[type][$eq]'] = filters.type;
      }

      if (filters.search) {
        params['filters[$or][0][title][$containsi]'] = filters.search;
        params['filters[$or][1][heading][$containsi]'] = filters.search;
        params['filters[$or][2][paragraphs][arabic][$containsi]'] = filters.search;
        params['filters[$or][3][paragraphs][translations][text][$containsi]'] = filters.search;
      }

      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag, index) => {
          params[`filters[tags][name][$in][${index}]`] = tag;
        });
      }

      params['populate[tags]'] = true;
      params['populate[paragraphs][populate][translations]'] = true;
      params['populate[paragraphs][populate][footnotes]'] = true;
      params['populate[footnotes]'] = true;

      if (sort) {
        params['sort'] = sort;
      }

      console.log('Listing API params:', params);

      const response = await api.get('/api/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts for listing:', error);
      throw error;
    }
  },

  async getPostBySlug(slug: string, type?: string): Promise<Post | null> {
    try {
      const filters: PostFilters = { search: undefined };
      const params: any = {
        'filters[slug][$eq]': slug,
        'populate[footnotes]': true,
        'populate[paragraphs][populate][translations]': true,
        'populate[paragraphs][populate][footnotes]': true,
        'populate[tags]': true,
      };

      if (type) {
        params['filters[type][$eq]'] = type;
      }

      const response = await api.get('/api/posts', { params });
      
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  },

  async getPostById(id: number, type?: string): Promise<Post | null> {
    try {
      const params: any = {
        'filters[id][$eq]': id,
        'populate[footnotes]': true,
        'populate[paragraphs][populate][translations]': true,
        'populate[paragraphs][populate][footnotes]': true,
        'populate[tags]': true,
      };

      if (type) {
        params['filters[type][$eq]'] = type;
      }

      const response = await api.get('/api/posts', { params });
      
      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching post by id:', error);
      throw error;
    }
  },

  async searchPosts(query: string, options: Omit<PostsApiOptions, 'filters'> = {}): Promise<ApiResponse> {
    return this.getPosts({
      ...options,
      filters: { search: query, ...(options as any).filters }
    });
  },

  async getPostsByTypeForListing(type: string, options: Omit<PostsApiOptions, 'filters'> = {}): Promise<ApiResponse> {
    return this.getPostsForListing({
      ...options,
      filters: { type, ...(options as any).filters }
    });
  },

  async getPostsByType(type: string, options: Omit<PostsApiOptions, 'filters'> = {}): Promise<ApiResponse> {
    return this.getPosts({
      ...options,
      filters: { type, ...(options as any).filters }
    });
  },

  async getPostsByTags(tags: string[], options: Omit<PostsApiOptions, 'filters'> = {}): Promise<ApiResponse> {
    return this.getPosts({
      ...options,
      filters: { tags, ...(options as any).filters }
    });
  }
};

export const orationsApi = {
  async getOrations(page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsByTypeForListing('Oration', { page, pageSize });
  },

  async getOrationBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Oration');
  },

  async getOrationById(id: number): Promise<Post | null> {
    return postsApi.getPostById(id, 'Oration');
  },

  async searchOrations(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsForListing({ 
      page, 
      pageSize,
      filters: { search: query, type: 'Oration' }
    });
  },

  async getOrationBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const formattedSermonNumber = sermonNumber.startsWith('1.') ? sermonNumber : `1.${sermonNumber}`;
      const response = await postsApi.getPosts({
        filters: {
          sermonNumber: formattedSermonNumber,
          type: 'Oration'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching oration by sermon number:', error);
      throw error;
    }
  },

  async getOrationByParagraphNumber(paragraphNumber: string): Promise<Post | null> {
    try {
      const formattedParagraphNumber = paragraphNumber.startsWith('1.') ? paragraphNumber : `1.${paragraphNumber}`;
      const response = await postsApi.getPosts({
        filters: {
          paragraphNumber: formattedParagraphNumber,
          type: 'Oration'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching oration by paragraph number:', error);
      throw error;
    }
  },

  async getOrationByTextReference(textRef: string): Promise<Post | null> {
    try {
      // Extract the paragraph number from text reference (e.g., "26" or "26.1" from "1.26.1")
      const parts = textRef.split('.');
      if (parts.length < 2) return null;
      
      // Try to find by searching through all orations (client-side search)
      // First, fetch with large pageSize to get many orations
      const response = await postsApi.getPosts({
        filters: { type: 'Oration' },
        pageSize: 500  // Fetch more to increase chances
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Generate multiple possible formats to match against
      const sectionWithoutPrefix = parts.slice(1).join('.');  // "26.1" from "1.26.1"
      
      // Search for an oration containing this text reference
      for (const post of response.data) {
        // Check if sermonNumber matches
        if (post.sermonNumber === textRef || post.sermonNumber === sectionWithoutPrefix) {
          return post;
        }

        if (post.paragraphs && post.paragraphs.length > 0) {
          // Check if any paragraph number matches - try multiple formats
          for (const paragraph of post.paragraphs) {
            if (!paragraph.number) continue;
            
            const pNum = paragraph.number.trim();
            
            // Try strict matching strategies
            if (
              pNum === textRef ||  // Exact match: "1.26.1"
              pNum === sectionWithoutPrefix // Match without prefix: "26.1"
            ) {
              return post;
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching oration by text reference:', error);
      throw error;
    }
  }
};

export const lettersApi = {
  async getLetters(page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsByTypeForListing('Letter', { page, pageSize });
  },

  async getLetterBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Letter');
  },

  async getLetterById(id: number): Promise<Post | null> {
    return postsApi.getPostById(id, 'Letter');
  },

  async searchLetters(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsForListing({ 
      page, 
      pageSize,
      filters: { search: query, type: 'Letter' }
    });
  },

  async getLetterBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const formattedSermonNumber = sermonNumber.startsWith('2.') ? sermonNumber : `2.${sermonNumber}`;
      const response = await postsApi.getPosts({
        filters: {
          sermonNumber: formattedSermonNumber,
          type: 'Letter'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching letter by sermon number:', error);
      throw error;
    }
  },

  async getLetterByParagraphNumber(paragraphNumber: string): Promise<Post | null> {
    try {
      const formattedParagraphNumber = paragraphNumber.startsWith('2.') ? paragraphNumber : `2.${paragraphNumber}`;
      const response = await postsApi.getPosts({
        filters: {
          paragraphNumber: formattedParagraphNumber,
          type: 'Letter'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching letter by paragraph number:', error);
      throw error;
    }
  },

  async getLetterByTextReference(textRef: string): Promise<Post | null> {
    try {
      const parts = textRef.split('.');
      if (parts.length < 2) return null;
      
      const response = await postsApi.getPosts({
        filters: { type: 'Letter' },
        pageSize: 500
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const sectionWithoutPrefix = parts.slice(1).join('.');  // "26.1" from "2.26.1"
      
      for (const post of response.data) {
        // Check if sermonNumber matches
        if (post.sermonNumber === textRef || post.sermonNumber === sectionWithoutPrefix) {
          return post;
        }

        if (post.paragraphs && post.paragraphs.length > 0) {
          for (const paragraph of post.paragraphs) {
            if (!paragraph.number) continue;
            
            const pNum = paragraph.number.trim();
            
            if (
              pNum === textRef ||
              pNum === sectionWithoutPrefix
            ) {
              return post;
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching letter by text reference:', error);
      throw error;
    }
  }
};

export const sayingsApi = {
  async getSayings(page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsByTypeForListing('Saying', { page, pageSize });
  },

  async getSayingBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Saying');
  },

  async getSayingById(id: number): Promise<Post | null> {
    return postsApi.getPostById(id, 'Saying');
  },

  async searchSayings(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsForListing({ 
      page, 
      pageSize,
      filters: { search: query, type: 'Saying' }
    });
  },

  async getSayingBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const formattedSermonNumber = sermonNumber.startsWith('3.') ? sermonNumber : `3.${sermonNumber}`;
      const response = await postsApi.getPosts({
        filters: {
          sermonNumber: formattedSermonNumber,
          type: 'Saying'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching saying by sermon number:', error);
      throw error;
    }
  },

  async getSayingByParagraphNumber(paragraphNumber: string): Promise<Post | null> {
    try {
      const formattedParagraphNumber = paragraphNumber.startsWith('3.') ? paragraphNumber : `3.${paragraphNumber}`;
      const response = await postsApi.getPosts({
        filters: {
          paragraphNumber: formattedParagraphNumber,
          type: 'Saying'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching saying by paragraph number:', error);
      throw error;
    }
  },

  async getSayingByTextReference(textRef: string): Promise<Post | null> {
    try {
      const parts = textRef.split('.');
      if (parts.length < 2) return null;
      
      const response = await postsApi.getPosts({
        filters: { type: 'Saying' },
        pageSize: 500
      });

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const sectionWithoutPrefix = parts.slice(1).join('.');  // "26.1" from "3.26.1"
      
      for (const post of response.data) {
        // Check if sermonNumber matches
        if (post.sermonNumber === textRef || post.sermonNumber === sectionWithoutPrefix) {
          return post;
        }

        if (post.paragraphs && post.paragraphs.length > 0) {
          for (const paragraph of post.paragraphs) {
            if (!paragraph.number) continue;
            
            const pNum = paragraph.number.trim();
            
            if (
              pNum === textRef ||
              pNum === sectionWithoutPrefix
            ) {
              return post;
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching saying by text reference:', error);
      throw error;
    }
  }
};

export interface RadisIntroduction {
  id: number;
  documentId: string;
  arabic: string;
  translation: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface RadisApiResponse {
  data: RadisIntroduction[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const radisApi = {
  async getRadisIntroductions(page = 1, pageSize = 25): Promise<RadisApiResponse> {
    try {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
        'sort[0]': 'number:asc'
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/radis-introductions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching radis introductions:', error);
      throw error;
    }
  },

  async getRadisIntroductionByNumber(number: string): Promise<RadisIntroduction | null> {
    try {
      const params = new URLSearchParams({
        'filters[number][$eq]': number,
        'pagination[pageSize]': '1'
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/radis-introductions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        return result.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching radis introduction by number:', error);
      throw error;
    }
  },

  async searchRadisIntroductions(query: string, page = 1, pageSize = 25): Promise<RadisApiResponse> {
    try {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
        'filters[$or][0][arabic][$containsi]': query,
        'filters[$or][1][translation][$containsi]': query,
        'sort[0]': 'number:asc'
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/radis-introductions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching radis introductions:', error);
      throw error;
    }
  }
};
