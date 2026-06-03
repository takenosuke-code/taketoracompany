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

/**
 * Complete, consistent Open Graph + Twitter metadata for a page.
 *
 * Pages that define their own `openGraph` in generateMetadata replace (rather
 * than merge with) the layout's — which is why the file-based opengraph-image
 * is dropped on those routes. Spreading this helper guarantees every page
 * carries og:image, og:type and og:site_name.
 */
export function ogMeta(
  locale: string,
  opts: { title: string; description: string; path?: string; type?: "website" | "article" }
) {
  const isJa = locale === "ja";
  const image = localeUrl(locale, "/opengraph-image");
  return {
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: localeUrl(locale, opts.path ?? ""),
      siteName: isJa ? "たけとら Taketora" : "Taketora",
      type: opts.type ?? ("website" as const),
      locale: isJa ? "ja_JP" : "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
