import api from '../api';
import { Post, ApiResponse, Translation, Tag, Paragraph, Footnote, Source, Edition } from '../orations';

export type { Post, ApiResponse, Translation, Tag, Paragraph, Footnote, Source, Edition };

export interface PostFilters {
  type?: string;
  search?: string;
  tags?: string[];
  sermonNumber?: string | string[];
  paragraphNumber?: string;
  editionTitle?: string;
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
  _extractPosts(responseData: any[], deduplicate = false, preferredEdition?: string): Post[] {
    if (!responseData || !Array.isArray(responseData)) return [];
    const posts: Post[] = [];
    for (const base of responseData) {
      if (base.posts && Array.isArray(base.posts) && base.posts.length > 0) {
        let postsToProcess = base.posts;
        if (deduplicate) {
          if (preferredEdition) {
            // Find a post that matches the preferred edition title
            const matchingPost = base.posts.find((p: any) => {
              const eds = p.editions;
              if (Array.isArray(eds)) {
                return eds.some((e: any) => e.title?.toLowerCase() === preferredEdition.toLowerCase());
              } else if (eds && eds.title) {
                return eds.title.toLowerCase() === preferredEdition.toLowerCase();
              }
              return false;
            });
            postsToProcess = [matchingPost || base.posts[0]];
          } else {
            postsToProcess = [base.posts[0]];
          }
        }
        for (const post of postsToProcess) {
          posts.push({
            ...post,
            heading: post.heading || base.heading || base.TocEnglish || 'Untitled',
            TocEnglish: post.TocEnglish || base.TocEnglish || '',
            TocArabic: post.TocArabic || base.TocArabic || '',
            post_base_documentId: base.documentId
          });
        }
      }
    }
    return posts;
  },

  async getEditions(): Promise<{ data: Edition[] }> {
    try {
      const response = await api.get('/api/editions');
      return {
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching editions:', error);
      throw error;
    }
  },

  async getPostsByPostBaseDocumentId(documentId: string): Promise<ApiResponse> {
    try {
      const params: any = {
        'filters[documentId][$eq]': documentId,
        'populate[posts][populate][translations]': true,
        'populate[posts][populate][footnotes]': true,
        'populate[posts][populate][paragraphs][populate][0]': 'translations',
        'populate[posts][populate][paragraphs][populate][1]': 'footnotes',
        'populate[posts][populate][paragraphs][populate][2]': 'appendix_of_sources',
        'populate[posts][populate][editions][fields][0]': 'title',
      };

      const response = await api.get('/api/post-bases', { params });
      // We don't deduplicate here as we want all posts for a base when specifically requested by its ID
      const posts = this._extractPosts(response.data.data);
      return {
        data: posts,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('Error fetching posts by post_base documentId:', error);
      throw error;
    }
  },

  async getPosts(options: PostsApiOptions = {}): Promise<ApiResponse> {
    try {
      const {
        page = 1,
        pageSize = 9,
        filters = {},
        populate = ['footnotes', 'paragraphs.footnotes', 'paragraphs.translations', 'paragraphs.appendix_of_sources'],
        sort,
        fields
      } = options;

      const params: any = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      };

      if (filters.type) {
        params['filters[posts][type][$eq]'] = filters.type;
      }

      if (filters.sermonNumber) {
        if (Array.isArray(filters.sermonNumber)) {
          filters.sermonNumber.forEach((num, index) => {
            params[`filters[posts][sermonNumber][$in][${index}]`] = num;
          });
        } else {
          params['filters[posts][sermonNumber][$eq]'] = filters.sermonNumber;
        }
      }

      if (filters.sermonNumberEndsWith) {
        params['filters[posts][sermonNumber][$endsWith]'] = filters.sermonNumberEndsWith;
      }

      if (filters.paragraphNumber) {
        params['filters[posts][paragraphs][number][$startsWith]'] = filters.paragraphNumber;
      }

      if (filters.editionTitle) {
        params['filters[posts][editions][title][$eqi]'] = filters.editionTitle;
      }

      // Handle the $or filter from fetchAvailablePosts
      if (filters.$or && Array.isArray(filters.$or)) {
        filters.$or.forEach((condition: any, index: number) => {
          if (condition.sermonNumber) {
            params[`filters[$or][${index}][posts][sermonNumber][$eq]`] = condition.sermonNumber;
          } else if (condition.sermonNumberEndsWith) {
            params[`filters[$or][${index}][posts][sermonNumber][$endsWith]`] = condition.sermonNumberEndsWith;
          }
        });
      }

      if (filters.search) {
        const searchIndexOffset = (filters.$or?.length || 0);
        params[`filters[posts][$or][${searchIndexOffset + 0}][title][$containsi]`] = filters.search;
        params[`filters[posts][$or][${searchIndexOffset + 1}][heading][$containsi]`] = filters.search;
        params[`filters[posts][$or][${searchIndexOffset + 2}][paragraphs][arabic][$containsi]`] = filters.search;
        params[`filters[posts][$or][${searchIndexOffset + 3}][paragraphs][translations][text][$containsi]`] = filters.search;
      }



      if (fields && fields.length > 0) {
        fields.forEach((field, index) => {
          params[`populate[posts][fields][${index}]`] = field;
        });
      }

      if (populate && populate.length > 0) {
        // Map common relations to their nested structure to avoid index-based population errors
        populate.forEach((relation) => {
          if (relation === 'paragraphs.translations') {
            params['populate[posts][populate][paragraphs][populate][0]'] = 'translations';
          } else if (relation === 'paragraphs.footnotes') {
            params['populate[posts][populate][paragraphs][populate][1]'] = 'footnotes';
          } else if (relation === 'paragraphs.appendix_of_sources') {
            params['populate[posts][populate][paragraphs][populate][2]'] = 'appendix_of_sources';
          } else if (relation === 'footnotes') {
            params['populate[posts][populate][footnotes]'] = true;
          } else if (relation === 'tags') {
            // Skipping tags as it caused "Invalid key tags"
          } else {
            params[`populate[posts][populate][${relation}]`] = true;
          }
        });
      }

      // Always populate editions as it is used for TOC
      params['populate[posts][populate][translations]'] = true;
      params['populate[posts][populate][footnotes]'] = true;
      params['populate[posts][populate][editions][fields][0]'] = 'title';

      if (sort) {
        params['sort'] = sort;
      }

      console.log('Final API params:', params);

      const response = await api.get('/api/post-bases', { params });
      const posts = this._extractPosts(
        response.data.data, 
        !!filters.search || options.pageSize === 15,
        filters.editionTitle
      );
      return {
        data: posts,
        meta: response.data.meta,
      };
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
        params['filters[posts][type][$eq]'] = filters.type;
      }

      if (filters.search) {
        params['filters[posts][$or][0][title][$containsi]'] = filters.search;
        params['filters[posts][$or][1][heading][$containsi]'] = filters.search;
        params['filters[posts][$or][2][paragraphs][arabic][$containsi]'] = filters.search;
        params['filters[posts][$or][3][paragraphs][translations][text][$containsi]'] = filters.search;
      }

      if (filters.editionTitle) {
        params['filters[posts][editions][title][$eqi]'] = filters.editionTitle;
      }

      params['populate[posts][populate][paragraphs][populate][0]'] = 'translations';
      params['populate[posts][populate][paragraphs][populate][1]'] = 'footnotes';
      params['populate[posts][populate][paragraphs][populate][2]'] = 'appendix_of_sources';
      params['populate[posts][populate][translations]'] = true;
      params['populate[posts][populate][editions][fields][0]'] = 'title';

      if (sort) {
        params['sort'] = sort;
      }

      console.log('Listing API params:', params);

      const response = await api.get('/api/post-bases', { params });
      const posts = this._extractPosts(response.data.data, true, filters.editionTitle);
      return {
        data: posts,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('Error fetching posts for listing:', error);
      throw error;
    }
  },

  async getPostBySlug(slug: string, type?: string): Promise<Post | null> {
    try {
      const params: any = {
        'filters[posts][slug][$eq]': slug,
        'populate[posts][populate][translations]': true,
        'populate[posts][populate][footnotes]': true,
        'populate[posts][populate][paragraphs][populate][0]': 'translations',
        'populate[posts][populate][paragraphs][populate][1]': 'footnotes',
        'populate[posts][populate][paragraphs][populate][2]': 'appendix_of_sources',
        'populate[posts][populate][editions][fields][0]': 'title',
      };

      if (type) {
        params['filters[posts][type][$eq]'] = type;
      }

      const response = await api.get('/api/post-bases', { params });
      const posts = this._extractPosts(response.data.data);

      const matchingPost = posts.find((p) => p.slug === slug);
      if (matchingPost) {
        return matchingPost;
      }
      if (posts.length > 0) {
        return posts[0];
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
        'filters[posts][id][$eq]': id,
        'populate[posts][populate][translations]': true,
        'populate[posts][populate][footnotes]': true,
        'populate[posts][populate][paragraphs][populate][0]': 'translations',
        'populate[posts][populate][paragraphs][populate][1]': 'footnotes',
        'populate[posts][populate][paragraphs][populate][2]': 'appendix_of_sources',
        'populate[posts][populate][editions][fields][0]': 'title',
      };

      if (type) {
        params['filters[posts][type][$eq]'] = type;
      }

      const response = await api.get('/api/post-bases', { params });
      const posts = this._extractPosts(response.data.data);

      const matchingPost = posts.find((p) => p.id === id);
      if (matchingPost) {
        return matchingPost;
      }
      if (posts.length > 0) {
        return posts[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching post by id:', error);
      throw error;
    }
  },

  async searchPosts(query: string, options: PostsApiOptions = {}): Promise<ApiResponse> {
    return this.getPosts({
      ...options,
      filters: { search: query, ...options.filters }
    });
  },

  async getPostsByTypeForListing(type: string, options: PostsApiOptions = {}): Promise<ApiResponse> {
    return this.getPostsForListing({
      ...options,
      filters: { type, ...options.filters }
    });
  },

  async getPostsByType(type: string, options: PostsApiOptions = {}): Promise<ApiResponse> {
    return this.getPosts({
      ...options,
      filters: { type, ...options.filters }
    });
  },

  async getPostsByTags(tags: string[], options: PostsApiOptions = {}): Promise<ApiResponse> {
    return this.getPosts({
      ...options,
      filters: { tags, ...options.filters }
    });
  }
};

export const orationsApi = {
  async getOrations(page = 1, pageSize = 9, editionTitle?: string): Promise<ApiResponse> {
    return postsApi.getPostsByTypeForListing('Oration', {
      page,
      pageSize,
      filters: editionTitle ? { editionTitle } : {}
    });
  },

  async getOrationBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Oration');
  },

  async getOrationById(id: number): Promise<Post | null> {
    return postsApi.getPostById(id, 'Oration');
  },

  async searchOrations(query: string, page = 1, pageSize = 9, editionTitle?: string): Promise<ApiResponse> {
    return postsApi.getPostsForListing({
      page,
      pageSize,
      filters: { search: query, type: 'Oration', ...(editionTitle ? { editionTitle } : {}) }
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
  async getLetters(page = 1, pageSize = 9, editionTitle?: string): Promise<ApiResponse> {
    return postsApi.getPostsByTypeForListing('Letter', {
      page,
      pageSize,
      filters: editionTitle ? { editionTitle } : {}
    });
  },

  async getLetterBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Letter');
  },

  async getLetterById(id: number): Promise<Post | null> {
    return postsApi.getPostById(id, 'Letter');
  },

  async searchLetters(query: string, page = 1, pageSize = 9, editionTitle?: string): Promise<ApiResponse> {
    return postsApi.getPostsForListing({
      page,
      pageSize,
      filters: { search: query, type: 'Letter', ...(editionTitle ? { editionTitle } : {}) }
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
  async getSayings(page = 1, pageSize = 9, editionTitle?: string): Promise<ApiResponse> {
    return postsApi.getPostsByTypeForListing('Saying', {
      page,
      pageSize,
      filters: editionTitle ? { editionTitle } : {}
    });
  },

  async getSayingBySlug(slug: string): Promise<Post | null> {
    return postsApi.getPostBySlug(slug, 'Saying');
  },

  async getSayingById(id: number): Promise<Post | null> {
    return postsApi.getPostById(id, 'Saying');
  },

  async searchSayings(query: string, page = 1, pageSize = 9, editionTitle?: string): Promise<ApiResponse> {
    return postsApi.getPostsForListing({
      page,
      pageSize,
      filters: { search: query, type: 'Saying', ...(editionTitle ? { editionTitle } : {}) }
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

export interface Conclusion {
  id: number;
  documentId: string;
  arabic: string;
  translation: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ConclusionApiResponse {
  data: Conclusion[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const conclusionsApi = {
  async getConclusions(page = 1, pageSize = 25): Promise<ConclusionApiResponse> {
    try {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
        'sort[0]': 'number:asc'
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/conclusions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching conclusions:', error);
      throw error;
    }
  },

  async getConclusionByNumber(number: string): Promise<Conclusion | null> {
    try {
      const params = new URLSearchParams({
        'filters[number][$eq]': number,
        'pagination[pageSize]': '1'
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/conclusions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result.data && result.data.length > 0) {
        return result.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching conclusion by number:', error);
      throw error;
    }
  },

  async searchConclusions(query: string, page = 1, pageSize = 25): Promise<ConclusionApiResponse> {
    try {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
        'filters[$or][0][arabic][$containsi]': query,
        'filters[$or][1][translation][$containsi]': query,
        'sort[0]': 'number:asc'
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/conclusions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching conclusions:', error);
      throw error;
    }
  },

  async getConclusionsByNumbers(numbers: string[]): Promise<ConclusionApiResponse> {
    try {
      const params = new URLSearchParams({
        'pagination[pageSize]': '100'
      });

      numbers.forEach((num, index) => {
        params.append(`filters[number][$in][${index}]`, num);
      });

      const response = await fetch(`https://test-admin.nahjalbalaghah.org/api/conclusions?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching conclusions by numbers:', error);
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

// ---- Post Bases API (for TOC) ----

export interface PostBaseEdition {
  id: number;
  title: string;
}

export interface PostBasePost {
  id: number;
  type: string;
  heading?: string;
  sermonNumber?: string;
  slug?: string;
  editions?: PostBaseEdition[];
}

export interface PostBase {
  id: number;
  documentId: string;
  posts: PostBasePost[];
}

export interface PostBasesApiResponse {
  data: PostBase[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const postBasesApi = {
  async getPostBases(type: string, edition?: string): Promise<PostBasesApiResponse> {
    try {
      const params: any = {
        'filters[posts][type][$eq]': type,
        'populate[posts][populate][editions][fields][0]': 'title',
        'pagination[pageSize]': 300,
      };

      // Add edition filter if provided
      if (edition) {
        params['filters[posts][editions][title][$eqi]'] = edition;
        params['populate[posts][populate][editions][fields][0]'] = 'title';
      }

      console.log('PostBases API params:', params);

      const response = await api.get('/api/post-bases', { params });

      // Enrich posts with parent headings for TOC display
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map((base: any) => ({
          ...base,
          posts: base.posts?.map((post: any) => ({
            ...post,
            heading: post.heading || base.heading || base.TocEnglish || 'Untitled'
          }))
        }));
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching post bases:', error);
      throw error;
    }
  },

  async getOrationsTOC(edition?: string): Promise<PostBasesApiResponse> {
    return this.getPostBases('Oration', edition);
  },

  async getLettersTOC(edition?: string): Promise<PostBasesApiResponse> {
    return this.getPostBases('Letter', edition);
  },

  async getSayingsTOC(edition?: string): Promise<PostBasesApiResponse> {
    return this.getPostBases('Saying', edition);
  }
};
