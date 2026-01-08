import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel_Decorative, Noto_Sans_JP } from "next/font/google";
import { createClient } from '@/utils/supabase/server';
import "./globals.css";

const cinzel = Cinzel_Decorative({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-cinzel',
});

const notoSans = Noto_Sans_JP({
  weight: ['300', '400', '500', '600'],
  subsets: ["latin"],
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: "Taketora - Premium Japanese Collectibles",
  description: "Discover authentic premium anime figures and artisan souvenirs in the heart of Tokyo",
  verification: {
    google: "8zntccVng7Q4n68XbjNCn5jlx5jAubcc34fw60OrJnc",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the first category from Supabase for navigation (check new table structure)
  const supabase = createClient();
  // Try to get from anime figures table first, fallback to collection page
  const { data: animeProducts } = await supabase.from('animefigure').select('category').limit(1);
  const firstCategory = animeProducts && animeProducts.length > 0 && animeProducts[0].category 
    ? animeProducts[0].category 
    : 'anime-figures'; // fallback

  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${notoSans.variable} font-sans antialiased bg-stone-50`}>
        {/* Header */}
        <header className="border-b border-stone-200 bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 sm:py-2.5 lg:py-3">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-sm flex items-center justify-center">
                  <span className="text-stone-100 font-bold text-lg sm:text-xl font-serif">竹</span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-wide text-amber-100">
                  Taketora
                </h1>
              </Link>
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-6 lg:space-x-8 font-light text-xs sm:text-sm tracking-wider">
                <Link
                  href="/collection"
                  className="hover:text-amber-300 transition-colors duration-300 whitespace-nowrap"
                >
                  Our Collection
                </Link>
                <Link
                  href="/anime-figures"
                  className="hover:text-amber-300 transition-colors duration-300 whitespace-nowrap"
                >
                  Anime Figures
                </Link>
                <Link
                  href="/pokemon"
                  className="hover:text-amber-300 transition-colors duration-300 whitespace-nowrap"
                >
                  Pokémon Cards
                </Link>
                <Link
                  href="/antique"
                  className="hover:text-amber-300 transition-colors duration-300 whitespace-nowrap"
                >
                  Antiques
                </Link>
                <Link
                  href="/visit"
                  className="hover:text-amber-300 transition-colors duration-300 whitespace-nowrap"
                >
                  Visit Us
                </Link>
                <a
                  href="#about"
                  className="hover:text-amber-300 transition-colors duration-300 whitespace-nowrap"
                >
                  About
                </a>
              </nav>
              
              {/* Mobile menu button */}
              <button className="md:hidden text-amber-200 hover:text-amber-300 p-1">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-300 mt-24 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <h3 className="font-serif text-xl text-amber-200 mb-4">Taketora</h3>
                <p className="text-sm font-light leading-relaxed text-stone-400">
                  A curated sanctuary of premium collectibles and artisan treasures in Kyoto.
                </p>
              </div>
              
              {/* Visit */}
              <div>
                <h4 className="font-medium text-stone-200 mb-4 tracking-wide">Visit Our Boutiques</h4>
                <address className="text-sm font-light not-italic leading-relaxed text-stone-400">
                  Higashiyama Ward, Kyoto<br />
                  Open Daily: 10:00 - 20:00<br />
                  English & Japanese spoken
                </address>
              </div>
              
              {/* Connect */}
              <div>
                <h4 className="font-medium text-stone-200 mb-4 tracking-wide">Connect</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.instagram.com/taketora_antiques/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-stone-400 hover:text-amber-300 transition-colors duration-300"
                    aria-label="Follow us on Instagram"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-stone-800 text-center text-sm text-stone-500 font-light">
              © {new Date().getFullYear()} Taketora. Crafted with care for discerning collectors.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}