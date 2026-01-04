import api from '../api';
import { Post, ApiResponse, Translation, Tag, Paragraph, Footnote } from '../orations';

export type { Post, ApiResponse, Translation, Tag, Paragraph, Footnote };

export interface PostFilters {
  type?: string;
  search?: string;
  tags?: string[];
  sermonNumber?: string | string[];
  paragraphNumber?: string;
  [key: string]: any;
}

export interface PostsApiOptions {
  page?: number;
  pageSize?: number;
  filters?: PostFilters;
  populate?: string[];
  sort?: string;
  fields?: string[];
}

export const postsApi = {
  async getPosts(options: PostsApiOptions = {}): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        pageSize = 9,
        filters = {},
        populate = ['footnotes', 'paragraphs.footnotes', 'paragraphs.translations', 'tags'],
        sort,
        fields
      } = options;

      const params: any = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      };

      if (filters.type) {
        params['filters[type][$eq]'] = filters.type;
      }

      if (filters.sermonNumber) {
        if (Array.isArray(filters.sermonNumber)) {
          filters.sermonNumber.forEach((num, index) => {
            params[`filters[sermonNumber][$in][${index}]`] = num;
          });
        } else {
          params['filters[sermonNumber][$eq]'] = filters.sermonNumber;
        }
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

      if (fields && fields.length > 0) {
        fields.forEach((field, index) => {
          params[`fields[${index}]`] = field;
        });
      }

      if (populate && populate.length > 0) {
        populate.forEach((relation, index) => {
          // Handle complex population (object syntax) manually if needed, 
          // but for this specific optimization we might just need simple relation names
          // or we can pass raw strings like 'paragraphs.translations' which Strapi accepts as populate[0]=...
          // However, existing code used params['populate[footnotes]'] = true; style.
          // Let's support both: if user passes populate array, we use it.
          // If we want to maintain the old hardcoded behavior when populate is NOT passed, we kept the default value in destructuring.

          // If populate is passed, we check if it matches the old hardcoded keys to use the old object syntax 
          // (which might be safer for deep population if Strapi version requires it), 
          // or just generic array syntax.

          // Actually, looking at the previous code:
          // params['populate[footnotes]'] = true;
          // params['populate[paragraphs][populate][translations]'] = true;
          // This suggests deep population structure.

          // If the caller provides specific populate array, we should probably blindly trust it 
          // or if they provide nothing (default), we do the detailed one.

          // But wait, the default `populate` array in destructuring is:
          // ['footnotes', 'paragraphs.footnotes', 'paragraphs.translations', 'tags', 'translations']

          // This array doesn't directly map to the complex object syntax used below:
          // params['populate[paragraphs][populate][translations]'] = true;

          // So if we just use the array, it might fail for deep relations if Strapi doesn't support dot notation in array `populate[0]=paragraphs.translations`.
          // Strapi v4 supports dot notation. 

          // Let's change the logic: IF populate is the DEFAULT one, use the hardcoded complex object params.
          // IF populate is CUSTOM (optimized), use the array syntax.

          params[`populate[${index}]`] = relation;
        });
      } else if (populate && populate.length === 5 && populate[0] === 'footnotes') {
        // This check is a bit brittle to detect "default". 
        // Let's check if it IS the default array reference, but we destructured a new array.
        // Better strategy: checking if we are in the "optimized" mode (passed via options) or "default" mode.

        // If `fields` is present, we are likely in optimized mode.
        // But let's look at `getPosts` calls.

        // To be safe and minimal:
        // If `populate` option IS provided in the call, use it as array params.
        // If `populate` option IS NOT provided (so it uses default), use the hardcoded logic.

        // But we assigned a default value to `populate` in destructuring:
        // populate = [...]

        // Let's change destructuring to NOT have default, handle it inside.
      }

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
  },

  async getAdjacentOrations(currentId: number): Promise<{ previous: Post | null; next: Post | null }> {
    try {
      // Fetch all orations using pagination to handle API limits
      const batchSize = 100;
      let currentPage = 1;
      let hasMore = true;
      const allPosts: Post[] = [];

      while (hasMore) {
        const response = await postsApi.getPosts({
          filters: { type: 'Oration' },
          page: currentPage,
          pageSize: batchSize,
          fields: ['id', 'heading', 'sermonNumber', 'slug'],
          populate: []
        });

        if (!response.data || response.data.length === 0) {
          break;
        }

        allPosts.push(...response.data);

        const totalPages = response.meta?.pagination?.pageCount || 1;
        hasMore = currentPage < totalPages;
        currentPage++;
      }

      if (allPosts.length === 0) {
        return { previous: null, next: null };
      }

      // Sort by sermon number
      const sortedPosts = allPosts
        .filter(post => post.heading)
        .sort((a, b) => {
          const getDisplayNumber = (sermonNumber: string | null) => {
            if (!sermonNumber) return 0;
            const parts = sermonNumber.split('.');
            return parseInt(parts.length > 1 ? parts[1] : parts[0], 10) || 0;
          };
          return getDisplayNumber(a.sermonNumber) - getDisplayNumber(b.sermonNumber);
        });

      // Find current post index
      const currentIndex = sortedPosts.findIndex(post => post.id === currentId);

      if (currentIndex === -1) {
        return { previous: null, next: null };
      }

      return {
        previous: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
        next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
      };
    } catch (error) {
      console.error('Error fetching adjacent orations:', error);
      return { previous: null, next: null };
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
  },

  async getAdjacentLetters(currentId: number): Promise<{ previous: Post | null; next: Post | null }> {
    try {
      // Fetch all letters using pagination to handle API limits
      const batchSize = 100;
      let currentPage = 1;
      let hasMore = true;
      const allPosts: Post[] = [];

      while (hasMore) {
        const response = await postsApi.getPosts({
          filters: { type: 'Letter' },
          page: currentPage,
          pageSize: batchSize,
          fields: ['id', 'heading', 'sermonNumber', 'slug'],
          populate: []
        });

        if (!response.data || response.data.length === 0) {
          break;
        }

        allPosts.push(...response.data);

        const totalPages = response.meta?.pagination?.pageCount || 1;
        hasMore = currentPage < totalPages;
        currentPage++;
      }

      if (allPosts.length === 0) {
        return { previous: null, next: null };
      }

      const sortedPosts = allPosts
        .filter(post => post.heading)
        .sort((a, b) => {
          const getDisplayNumber = (sermonNumber: string | null) => {
            if (!sermonNumber) return 0;
            const parts = sermonNumber.split('.');
            return parseInt(parts.length > 1 ? parts[1] : parts[0], 10) || 0;
          };
          return getDisplayNumber(a.sermonNumber) - getDisplayNumber(b.sermonNumber);
        });

      const currentIndex = sortedPosts.findIndex(post => post.id === currentId);

      if (currentIndex === -1) {
        return { previous: null, next: null };
      }

      return {
        previous: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
        next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
      };
    } catch (error) {
      console.error('Error fetching adjacent letters:', error);
      return { previous: null, next: null };
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
  },

  async getAdjacentSayings(currentId: number): Promise<{ previous: Post | null; next: Post | null }> {
    try {
      // Fetch all sayings using pagination to handle API limits
      const batchSize = 100;
      let currentPage = 1;
      let hasMore = true;
      const allPosts: Post[] = [];

      while (hasMore) {
        const response = await postsApi.getPosts({
          filters: { type: 'Saying' },
          page: currentPage,
          pageSize: batchSize,
          fields: ['id', 'heading', 'sermonNumber', 'slug'],
          populate: []
        });

        if (!response.data || response.data.length === 0) {
          break;
        }

        allPosts.push(...response.data);

        const totalPages = response.meta?.pagination?.pageCount || 1;
        hasMore = currentPage < totalPages;
        currentPage++;
      }

      if (allPosts.length === 0) {
        return { previous: null, next: null };
      }

      const sortedPosts = allPosts
        .filter(post => post.heading)
        .sort((a, b) => {
          const getDisplayNumber = (sermonNumber: string | null) => {
            if (!sermonNumber) return 0;
            const parts = sermonNumber.split('.');
            return parseInt(parts.length > 1 ? parts[1] : parts[0], 10) || 0;
          };
          return getDisplayNumber(a.sermonNumber) - getDisplayNumber(b.sermonNumber);
        });

      const currentIndex = sortedPosts.findIndex(post => post.id === currentId);

      if (currentIndex === -1) {
        return { previous: null, next: null };
      }

      return {
        previous: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
        next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null
      };
    } catch (error) {
      console.error('Error fetching adjacent sayings:', error);
      return { previous: null, next: null };
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
  },

  async getRadisIntroductionsByNumbers(numbers: string[]): Promise<RadisApiResponse> {
    try {
      const params = new URLSearchParams({
        'pagination[pageSize]': '100'
      });

      numbers.forEach((num, index) => {
        params.append(`filters[number][$in][${index}]`, num);
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/radis-introductions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching radis introductions by numbers:', error);
      throw error;
    }
  }
};

export const paragraphsApi = {
  async getParagraphsByNumbers(numbers: string[]): Promise<ApiResponse> {
    try {
      const params: any = {
        'pagination[pageSize]': 100,
        'populate[translations]': true,
        'populate[footnotes]': true,
      };

      numbers.forEach((num, index) => {
        params[`filters[number][$in][${index}]`] = num;
      });

      const response = await api.get('/api/paragraphs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching paragraphs by numbers:', error);
      throw error;
    }
  },

  async searchParagraphs(query: string, page = 1, pageSize = 25): Promise<ApiResponse> {
    try {
      const params: any = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'populate[translations]': true,
        'populate[footnotes]': true,
        'filters[$or][0][arabic][$containsi]': query,
        'filters[$or][1][translations][text][$containsi]': query,
      };

      const response = await api.get('/api/paragraphs', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching paragraphs:', error);
      throw error;
    }
  }
};