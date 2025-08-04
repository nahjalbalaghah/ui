import api from '../api';
import { Post, ApiResponse } from '../orations';

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
        populate = ['tags', 'paragraphs.translations'],
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

      Object.keys(filters).forEach(key => {
        if (!['type', 'search', 'tags'].includes(key)) {
          params[`filters[${key}]`] = filters[key];
        }
      });

      populate.forEach(field => {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          params[`populate[${parent}][populate][${child}]`] = true;
        } else {
          params[`populate`] = params[`populate`] ? `${params[`populate`]},${field}` : field;
        }
      });

      if (sort) {
        params['sort'] = sort;
      }

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
        'populate[paragraphs][populate][translations]': true,
        'populate': 'tags',
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
