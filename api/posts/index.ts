import api from '../api';
import { Post, ApiResponse, Translation, Tag, Paragraph } from '../orations';

export type { Post, ApiResponse, Translation, Tag, Paragraph };

export interface PostFilters {
  type?: string;
  search?: string;
  tags?: string[];
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
        populate = ['tags', 'paragraphs.translations', 'translations'],
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
        params['filters[$or][1][paragraphs][arabic][$containsi]'] = filters.search;
      }

      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach((tag, index) => {
          params[`filters[tags][name][$in][${index}]`] = tag;
        });
      }

      params['populate[0]'] = 'tags';
      params['populate[1]'] = 'paragraphs.translations';

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

  async getPostBySlug(slug: string, type?: string): Promise<Post | null> {
    try {
      const filters: PostFilters = { search: undefined };
      const params: any = {
        'filters[slug][$eq]': slug,
        'populate[0]': 'tags',
        'populate[1]': 'paragraphs.translations',
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

  async searchPosts(query: string, options: Omit<PostsApiOptions, 'filters'> = {}): Promise<ApiResponse> {
    return this.getPosts({
      ...options,
      filters: { search: query, ...(options as any).filters }
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
    return postsApi.getPostsByType('Oration', { page, pageSize });
  },

  async getOrationBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Oration');
  },

  async searchOrations(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPosts({ 
      page, 
      pageSize,
      filters: { search: query, type: 'Oration' }
    });
  },

  async getOrationBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const response = await postsApi.getPosts({
        filters: {
          sermonNumber,
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
  }
};

export const lettersApi = {
  async getLetters(page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsByType('Letter', { page, pageSize });
  },

  async getLetterBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Letter');
  },

  async searchLetters(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPosts({ 
      page, 
      pageSize,
      filters: { search: query, type: 'Letter' }
    });
  },

  async getLetterBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const response = await postsApi.getPosts({
        filters: {
          sermonNumber,
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
  }
};

export const sayingsApi = {
  async getSayings(page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPostsByType('Saying', { page, pageSize });
  },

  async getSayingBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Saying');
  },

  async searchSayings(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    return postsApi.getPosts({ 
      page, 
      pageSize,
      filters: { search: query, type: 'Saying' }
    });
  },

  async getSayingBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const response = await postsApi.getPosts({
        filters: {
          sermonNumber,
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
  }
};
