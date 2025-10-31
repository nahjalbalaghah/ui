import { ManuscriptLinkData } from '@/app/components/manuscript-reference';

export const getManuscriptReferencesForContent = (
  contentId: number,
  contentType: 'orations' | 'letters' | 'sayings'
): ManuscriptLinkData[] => {
  const manuscriptMap: Record<string, ManuscriptLinkData[]> = {
    'orations-1': [
      {
        id: '1',
        title: 'Mar\'ashi Manuscript',
        sourceReference: 'Mar\'ashi Library, Qum',
        pageNumber: '15-18',
        folioNumber: '7v-9r'
      },
      {
        id: '3',
        title: 'Nasiri Manuscript',
        sourceReference: 'National Library of Iran, Tehran',
        pageNumber: '22-25'
      }
    ],
    'orations-2': [
      {
        id: '2',
        title: 'Shahrastani Manuscript',
        sourceReference: 'National Library of Iraq, Baghdad',
        pageNumber: '45-48',
        folioNumber: '23r-24v'
      },
      {
        id: '1',
        title: 'Mar\'ashi Manuscript',
        sourceReference: 'Mar\'ashi Library, Qum',
        pageNumber: '32-35'
      }
    ],
    'orations-3': [
      {
        id: '3',
        title: 'Nasiri Manuscript',
        sourceReference: 'National Library of Iran, Tehran',
        pageNumber: '56-59',
        folioNumber: '28r-30r'
      }
    ],
    
    'letters-1': [
      {
        id: '1',
        title: 'Mar\'ashi Manuscript',
        sourceReference: 'Mar\'ashi Library, Qum',
        pageNumber: '123-126',
        folioNumber: '62r-63v'
      }
    ],
    'letters-2': [
      {
        id: '2',
        title: 'Shahrastani Manuscript',
        sourceReference: 'National Library of Iraq, Baghdad',
        pageNumber: '89-92',
        folioNumber: '45r-46r'
      },
      {
        id: '3',
        title: 'Nasiri Manuscript',
        sourceReference: 'National Library of Iran, Tehran',
        pageNumber: '78-81'
      }
    ],
    'letters-3': [
      {
        id: '1',
        title: 'Mar\'ashi Manuscript',
        sourceReference: 'Mar\'ashi Library, Qum',
        pageNumber: '145-148'
      }
    ],
    
    // Sayings
    'sayings-1': [
      {
        id: '3',
        title: 'Nasiri Manuscript',
        sourceReference: 'National Library of Iran, Tehran',
        pageNumber: '201-203',
        folioNumber: '101r'
      }
    ],
    'sayings-2': [
      {
        id: '2',
        title: 'Shahrastani Manuscript',
        sourceReference: 'National Library of Iraq, Baghdad',
        pageNumber: '156-158'
      },
      {
        id: '1',
        title: 'Mar\'ashi Manuscript',
        sourceReference: 'Mar\'ashi Library, Qum',
        pageNumber: '189-191',
        folioNumber: '95r-95v'
      }
    ],
    'sayings-3': [
      {
        id: '1',
        title: 'Mar\'ashi Manuscript',
        sourceReference: 'Mar\'ashi Library, Qum',
        pageNumber: '210-212'
      },
      {
        id: '3',
        title: 'Nasiri Manuscript',
        sourceReference: 'National Library of Iran, Tehran',
        pageNumber: '234-236',
        folioNumber: '117v-118r'
      }
    ],
  };

  const key = `${contentType}-${contentId}`;
  return manuscriptMap[key] || getDefaultManuscriptReferences(contentType);
};

const getDefaultManuscriptReferences = (contentType: 'orations' | 'letters' | 'sayings'): ManuscriptLinkData[] => {
  return [
    {
      id: '1',
      title: 'Mar\'ashi Manuscript',
      sourceReference: 'Mar\'ashi Library, Qum',
      pageNumber: 'Various pages'
    }
  ];
};

export interface RelatedContentItem {
  id: number;
  type: 'orations' | 'letters' | 'sayings';
  title: string;
  pageNumber?: string;
  folioNumber?: string;
}
