
export type TextRefType = 'oration' | 'letter' | 'saying' | 'introduction';

export interface ParsedTextRef {
  type: TextRefType;
  number: string;
  sectionNumber: string;
}

export function parseTextReference(textRef: string): ParsedTextRef | null {
  if (!textRef || typeof textRef !== 'string') {
    return null;
  }

  const trimmed = textRef.trim();
  const parts = trimmed.split('.');

  if (parts.length < 2) {
    return null;
  }

  const prefix = parts[0];
  const sectionNumber = parts.slice(1).join('.');

  let type: TextRefType;

  switch (prefix) {
    case '1':
      type = 'oration';
      break;
    case '2':
      type = 'letter';
      break;
    case '3':
      type = 'saying';
      break;
    case '0':
      type = 'introduction';
      break;
    default:
      return null;
  }

  return {
    type,
    number: trimmed,
    sectionNumber,
  };
}

export function getTextRefRoutePath(parsed: ParsedTextRef): string {
  switch (parsed.type) {
    case 'oration':
      return `/orations/details/${parsed.sectionNumber}?highlightRef=${parsed.number}`;
    case 'letter':
      return `/letters/details/${parsed.sectionNumber}?highlightRef=${parsed.number}`;
    case 'saying':
      return `/sayings/details/${parsed.sectionNumber}?highlightRef=${parsed.number}`;
    case 'introduction':
      return `/radis?highlightRef=${parsed.number}`;
    default:
      return '/';
  }
}

export function getContentTypeName(type: TextRefType): string {
  switch (type) {
    case 'oration':
      return 'Orations';
    case 'letter':
      return 'Letters';
    case 'saying':
      return 'Sayings';
    case 'introduction':
      return 'Introduction';
    default:
      return 'Unknown';
  }
}

export function getContentTypeSlug(type: TextRefType): 'Oration' | 'Letter' | 'Saying' | 'Radis' {
  switch (type) {
    case 'oration':
      return 'Oration';
    case 'letter':
      return 'Letter';
    case 'saying':
      return 'Saying';
    case 'introduction':
      return 'Radis';
    default:
      return 'Oration';
  }
}

export function getTextRefTypeColor(type: TextRefType): string {
  switch (type) {
    case 'oration':
      return 'bg-blue-100 text-blue-700';
    case 'letter':
      return 'bg-purple-100 text-purple-700';
    case 'saying':
      return 'bg-orange-100 text-orange-700';
    case 'introduction':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
