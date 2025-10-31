import api from '../api';

export interface ManuscriptFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface Manuscript {
  id: number;
  documentId: string;
  section: string;
  title?: string;
  description?: string;
  bookName?: string;
  siglaArabic?: string;
  siglaEnglish?: string;
  hijriYear?: string;
  gregorianYear?: string;
  holdingInstitution?: string;
  country?: string;
  city?: string;
  catalogNumber?: string;
  specialMerit?: string;
  rights?: string;
  binding?: string;
  acknowledgments?: string;
  accessRestriction?: string;
  repository?: string;
  partLocation?: string;
  cityOfOrigin?: string;
  countryOfOrigin?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  files: ManuscriptFile[];
}

export interface ManuscriptsApiResponse {
  data: Manuscript[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface TOCData {
  heading: string;
  TocEnglish: string;
  TocArabic: string;
}

export const manuscriptsApi = {
  /**
   * Get all manuscripts with populated files
   */
  async getAllManuscripts(page = 1, pageSize = 25): Promise<ManuscriptsApiResponse> {
    try {
      const response = await api.get('/api/manuscripts', {
        params: {
          'populate': 'files',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
      throw error;
    }
  },

  /**
   * Get manuscripts for a specific section
   * @param sectionNumber - The section number (e.g., "1.5", "1.1", "2.3")
   */
  async getManuscriptsBySection(sectionNumber: string, page = 1, pageSize = 25): Promise<ManuscriptsApiResponse> {
    try {
      const response = await api.get('/api/manuscripts', {
        params: {
          'filters[section][$eq]': sectionNumber,
          'populate': 'files',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching manuscripts for section ${sectionNumber}:`, error);
      throw error;
    }
  },

  /**
   * Get a single manuscript by ID
   */
  async getManuscriptById(id: string): Promise<Manuscript | null> {
    try {
      const response = await api.get(`/api/manuscripts/${id}`, {
        params: {
          'populate': 'files',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching manuscript ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get manuscripts filtered by type (Oration, Letter, Saying)
   * Based on section prefix: 1.x = Oration, 2.x = Letter, 3.x = Saying
   */
  async getManuscriptsByType(type: 'oration' | 'letter' | 'saying', page = 1, pageSize = 25): Promise<ManuscriptsApiResponse> {
    try {
      let sectionPrefix = '';
      switch (type) {
        case 'oration':
          sectionPrefix = '1';
          break;
        case 'letter':
          sectionPrefix = '2';
          break;
        case 'saying':
          sectionPrefix = '3';
          break;
      }

      const response = await api.get('/api/manuscripts', {
        params: {
          'filters[section][$startsWith]': sectionPrefix,
          'populate': 'files',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching manuscripts for type ${type}:`, error);
      throw error;
    }
  },
};

/**
 * Helper function to determine the content type based on section number
 */
export function getContentTypeFromSection(section: string): 'oration' | 'letter' | 'saying' | null {
  if (section.startsWith('1')) return 'oration';
  if (section.startsWith('2')) return 'letter';
  if (section.startsWith('3')) return 'saying';
  return null;
}

/**
 * Helper function to format manuscript image URL
 */
export function getManuscriptImageUrl(url: string, baseUrl = 'https://test-admin.nahjalbalaghah.org'): string {
  if (url.startsWith('http')) {
    return url;
  }
  return `${baseUrl}${url}`;
}
