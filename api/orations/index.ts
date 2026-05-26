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

export interface Source {
  id: number;
  documentId?: string;
  word?: string;
  content?: string;
  author?: string;
  title?: string;
  volumepage?: string;
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
  appendix_of_sources?: Source[];
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
  TocEnglish?: string;
  TocArabic?: string;
  paragraphs: Paragraph[];
  tags: Tag[];
  footnotes: Footnote[];
  post_base_documentId?: string;
  editions?: any;
}

export interface Edition {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
      const response = await api.get('/api/post-bases', {
        params: {
          'filters[posts][type][$eq]': 'Oration',
          'populate[posts][populate][paragraphs][populate][0]': 'translations',
          'populate[posts][populate][paragraphs][populate][1]': 'footnotes',
          'populate[posts][populate][paragraphs][populate][2]': 'appendix_of_sources',
          'populate[posts][populate][editions][fields][0]': 'title',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      // Extract posts from post-bases with heading inheritance and deduplication
      const posts: Post[] = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        for (const base of response.data.data) {
          if (base.posts && Array.isArray(base.posts)) {
            // For listing and single slug/number lookup, we usually only want the first post per base
            // or specific matching ones. For simplicity, we can just deduplicate here.
            const basePosts = base.posts.map((post: any) => ({
              ...post,
              heading: post.heading || base.heading || base.TocEnglish || 'Untitled',
              post_base_documentId: base.documentId
            }));
            
            // If it's a listing call (detected by presence of meta in caller context, or just general)
            // we only push the first one if we want deduplication.
            if (basePosts.length > 0) {
              posts.push(basePosts[0]);
            }
          }
        }
      }
      return { data: posts, meta: response.data.meta };
    } catch (error) {
      console.error('Error fetching orations:', error);
      throw error;
    }
  },

  async getOrationBySlug(slug: string): Promise<Post | null> {
    try {
      const response = await api.get('/api/post-bases', {
        params: {
          'filters[posts][slug][$eq]': slug,
          'filters[posts][type][$eq]': 'Oration',
          'populate[posts][populate][paragraphs][populate][0]': 'translations',
          'populate[posts][populate][paragraphs][populate][1]': 'footnotes',
          'populate[posts][populate][paragraphs][populate][2]': 'appendix_of_sources',
          'populate[posts][populate][editions][fields][0]': 'title',
        },
      });

      const posts: Post[] = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        for (const base of response.data.data) {
          if (base.posts && Array.isArray(base.posts)) {
            const basePosts = base.posts.map((post: any) => ({
              ...post,
              heading: post.heading || base.heading || base.TocEnglish || 'Untitled',
              post_base_documentId: base.documentId
            }));
            posts.push(...basePosts);
          }
        }
      }
      const matchingPost = posts.find((p) => p.slug === slug);
      if (matchingPost) {
        return matchingPost;
      }
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.error('Error fetching oration by slug:', error);
      throw error;
    }
  },

  async searchOrations(query: string, page = 1, pageSize = 9): Promise<ApiResponse> {
    try {
      const response = await api.get('/api/post-bases', {
        params: {
          'filters[posts][type][$eq]': 'Oration',
          'filters[posts][$or][0][title][$containsi]': query,
          'filters[posts][$or][1][heading][$containsi]': query,
          'filters[posts][$or][2][paragraphs][arabic][$containsi]': query,
          'filters[posts][$or][3][paragraphs][translations][text][$containsi]': query,
          'populate[posts][populate][paragraphs][populate][0]': 'translations',
          'populate[posts][populate][paragraphs][populate][1]': 'footnotes',
          'populate[posts][populate][paragraphs][populate][2]': 'appendix_of_sources',
          'populate[posts][populate][editions][fields][0]': 'title',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      const posts: Post[] = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        for (const base of response.data.data) {
          if (base.posts && Array.isArray(base.posts)) {
            const basePosts = base.posts.map((post: any) => ({
              ...post,
              heading: post.heading || base.heading || base.TocEnglish || 'Untitled',
              post_base_documentId: base.documentId
            }));
            posts.push(...basePosts);
          }
        }
      }
      return { data: posts, meta: response.data.meta };
    } catch (error) {
      console.error('Error searching orations:', error);
      throw error;
    }
  },

  async getOrationBySermonNumber(sermonNumber: string): Promise<Post | null> {
    try {
      const response = await api.get('/api/post-bases', {
        params: {
          'filters[posts][sermonNumber][$eq]': sermonNumber,
          'filters[posts][type][$eq]': 'Oration',
          'populate[posts][populate][paragraphs][populate][0]': 'translations',
          'populate[posts][populate][paragraphs][populate][1]': 'footnotes',
          'populate[posts][populate][paragraphs][populate][2]': 'appendix_of_sources',
          'populate[posts][populate][editions][fields][0]': 'title',
        },
      });

      const posts: Post[] = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        for (const base of response.data.data) {
          if (base.posts && Array.isArray(base.posts)) {
            const basePosts = base.posts.map((post: any) => ({
              ...post,
              heading: post.heading || base.heading || base.TocEnglish || 'Untitled',
              post_base_documentId: base.documentId
            }));
            posts.push(...basePosts);
          }
        }
      }
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.error('Error fetching oration by sermon number:', error);
      throw error;
    }
  },
};
