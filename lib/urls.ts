// Centralized URL/path builders for the "as-needed" locale prefix strategy.
//
// Japanese ("ja", the default locale) is served at the root with NO prefix,
// e.g. https://taketora-antique.com/antique
// Other locales keep their prefix, e.g. https://taketora-antique.com/en/antique
//
// Use these helpers everywhere canonical URLs, hreflang alternates, JSON-LD
// `item`/`@id` values, sitemap entries, or internal <Link> hrefs are built so
// the whole site stays consistent and crawlers never see a self-redirect.

export const BASE_URL = "https://taketora-antique.com";
export const DEFAULT_LOCALE = "ja";

/** Locale-aware prefix ("" for ja, "/en" for en, etc.). */
function prefix(locale: string): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Absolute, canonical URL for a path in a given locale.
 * `path` must start with "/" (or be "" for the homepage).
 */
export function localeUrl(locale: string, path = ""): string {
  return `${BASE_URL}${prefix(locale)}${path}`;
}

/**
 * Locale-aware in-app path (for <Link href> / breadcrumb hrefs).
 * Returns "/" for the localized homepage.
 */
export function localePath(locale: string, path = ""): string {
  const p = `${prefix(locale)}${path}`;
  return p === "" ? "/" : p;
}

/**
 * hreflang alternates map for the Next.js `alternates.languages` field.
 * x-default points at the Japanese (default-locale) URL.
 */
export function hreflang(path = ""): Record<string, string> {
  return {
    ja: `${BASE_URL}${path}`,
    en: `${BASE_URL}/en${path}`,
    "x-default": `${BASE_URL}${path}`,
  };
}
