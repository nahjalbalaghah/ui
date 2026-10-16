// User preferences persisted in cookies so they survive across visits.

const COOKIE_PREFIX = 'nb_pref_';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export type PreferenceKey = 'edition' | 'sort' | 'display' | 'detailDisplay';

export function getPreference(key: PreferenceKey): string | null {
  if (typeof document === 'undefined') return null;
  const name = `${COOKIE_PREFIX}${key}=`;
  const match = document.cookie.split('; ').find((c) => c.startsWith(name));
  if (!match) return null;
  try {
    return decodeURIComponent(match.slice(name.length)) || null;
  } catch {
    return null;
  }
}

export function setPreference(key: PreferenceKey, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_PREFIX}${key}=${encodeURIComponent(value)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export type DisplayMode = 'both' | 'english-only' | 'arabic-only';

export function parseDisplayMode(value: string | null | undefined): DisplayMode | null {
  return value === 'both' || value === 'english-only' || value === 'arabic-only' ? value : null;
}

// Edition titles attached to a post (the relation may come back as an array or a single object)
export function getPostEditionTitles(post: { editions?: any } | null | undefined): string[] {
  const eds = post?.editions;
  if (!eds) return [];
  const list = Array.isArray(eds) ? eds : [eds];
  return list.map((e: any) => e?.title).filter(Boolean);
}

export function postHasEdition(post: { editions?: any } | null | undefined, editionTitle: string) {
  const target = editionTitle.toLowerCase();
  return getPostEditionTitles(post).some((t) => t.toLowerCase() === target);
}
