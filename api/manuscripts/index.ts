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

// Library Item interface (individual manuscript details)
export interface LibraryItem {
  id: number;
  documentId: string;
  Sigla: string;
  libraryRef: string;
  City: string;
  Country: string;
  Date: string;
  catalogNumber: string;
  Completeness: string;
  Scribe: string;
  dimensions: string | null;
  originCity: string | null;
  Features: string;
  PermanentLink: string | null;
  Sequence: string;
  Format: string;
  AdditionalInfo: string | null;
  MoreInformation: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Library interface (collection/group of manuscripts)
export interface Library {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  library_items: LibraryItem[];
  manuscript: any | null;
}

export interface LibrariesApiResponse {
  data: Library[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Manuscript {
  id: number;
  documentId: string;
  section: string;
  library?: string;
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

/**
 * Libraries API - for fetching manuscript collection names and details
 */
export const librariesApi = {
  /**
   * Get all libraries (manuscript names) with populated items
   */
  async getAllLibraries(page = 1, pageSize = 25): Promise<LibrariesApiResponse> {
    try {
      const response = await api.get('/api/libraries', {
        params: {
          'populate': '*',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching libraries:', error);
      throw error;
    }
  },

  /**
   * Get a specific library by name
   * @param name - The library name (e.g., "Mar'ashi MS 3827")
   */
  async getLibraryByName(name: string): Promise<LibrariesApiResponse> {
    try {
      const response = await api.get('/api/libraries', {
        params: {
          'filters[name][$eq]': name,
          'populate': '*',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching library by name ${name}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific library by ID
   */
  async getLibraryById(id: string): Promise<Library | null> {
    try {
      const response = await api.get(`/api/libraries/${id}`, {
        params: {
          'populate': '*',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching library ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search libraries by partial name match
   * @param searchTerm - Search term to match against library names
   */
  async searchLibraries(searchTerm: string, page = 1, pageSize = 25): Promise<LibrariesApiResponse> {
    try {
      const response = await api.get('/api/libraries', {
        params: {
          'filters[name][$containsi]': searchTerm,
          'populate': '*',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching libraries for "${searchTerm}":`, error);
      throw error;
    }
  },
};

/**
 * Helper function to convert LibraryItem to a format compatible with existing components
 */
export function convertLibraryItemToManuscriptDetails(library: Library, item?: LibraryItem) {
  const libraryItem = item || library.library_items[0];
  
  if (!libraryItem) {
    return {
      id: library.documentId,
      name: library.name,
      siglaEnglish: '',
      siglaArabic: '',
      library: '',
      city: '',
      country: '',
      date: '',
      catalogNumber: '',
      completeness: '',
      scribe: '',
      dimensions: '',
      originCity: '',
      features: '',
      permanentLink: '',
      orationSequence: '',
      format: '',
      additionalInfo: '',
    };
  }

  // Extract sigla - format is "M/م" -> siglaEnglish: "M", siglaArabic: "م"
  const siglaParts = libraryItem.Sigla?.split('/') || ['', ''];
  
  return {
    id: library.documentId,
    name: library.name,
    siglaEnglish: siglaParts[0]?.trim() || '',
    siglaArabic: siglaParts[1]?.trim() || '',
    library: libraryItem.libraryRef || '',
    city: libraryItem.City || '',
    country: libraryItem.Country || '',
    date: libraryItem.Date || '',
    catalogNumber: libraryItem.catalogNumber || '',
    completeness: libraryItem.Completeness || '',
    scribe: libraryItem.Scribe || '',
    dimensions: libraryItem.dimensions || '',
    originCity: libraryItem.originCity || '',
    features: libraryItem.Features || '',
    permanentLink: libraryItem.PermanentLink || '',
    orationSequence: libraryItem.Sequence || '',
    format: libraryItem.Format || '',
    additionalInfo: libraryItem.AdditionalInfo || '',
  };
}
