import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ja', 'en'],
  defaultLocale: 'ja',
  // Japanese (default) is served at the root with no prefix (e.g. "/antique");
  // English keeps its "/en" prefix. This removes the homepage/locale redirects
  // that Search Console reported as "Page with redirect".
  localePrefix: 'as-needed',
  // Do NOT auto-redirect "/" based on Accept-Language: that would turn the
  // Japanese homepage into a redirect for Googlebot (which crawls as en-US).
  // Visitors can switch language with the in-page switcher instead.
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
