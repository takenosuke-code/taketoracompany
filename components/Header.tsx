import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-amber-900/10">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="font-cinzel text-3xl font-bold text-amber-900 tracking-wide hover:text-amber-800 transition-colors"
          >
            Taketora
          </Link>
          <nav className="flex items-center gap-8">
            <Link 
              href="/" 
              className="font-noto text-sm font-medium text-slate-700 hover:text-amber-900 transition-colors tracking-wide uppercase"
            >
              Our Collection
            </Link>
            <Link 
              href="/visit" 
              className="font-noto text-sm font-medium text-slate-700 hover:text-amber-900 transition-colors tracking-wide uppercase"
            >
              Visit Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
