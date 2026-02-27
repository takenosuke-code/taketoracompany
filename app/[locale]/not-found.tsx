import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Decorative top */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
          <div className="text-[#D4AF37]/30 text-sm">◆</div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
        </div>

        {/* 404 number */}
        <h1 className="text-8xl sm:text-9xl font-serif text-shimmer tracking-wider mb-4 leading-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl font-serif text-[#F2E8DC]/80 mb-4 tracking-wide">
          ページが見つかりません
        </h2>
        <p className="text-sm sm:text-base text-[#F2E8DC]/50 mb-3 font-light leading-relaxed">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <p className="text-sm sm:text-base text-[#F2E8DC]/40 mb-10 font-light leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="btn-gold-filled group inline-flex"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="tracking-widest text-xs sm:text-sm uppercase font-bold">
            ホームに戻る / Return Home
          </span>
        </Link>

        {/* Decorative bottom */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/20" />
          <p className="text-[10px] text-[#D4AF37]/30 tracking-[0.3em] uppercase">Taketora</p>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/20" />
        </div>
      </div>
    </div>
  );
}
