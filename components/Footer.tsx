export default function Footer() {
  return (
    <footer className="mt-24 border-t border-amber-900/10 bg-slate-900/5">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <p className="font-cinzel text-amber-900 text-lg font-semibold mb-2">Taketora</p>
          <p className="font-noto text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Taketora. All rights reserved.
          </p>
          <p className="font-noto text-xs text-slate-500 mt-2">
            Tokyo, Japan
          </p>
        </div>
      </div>
    </footer>
  );
}
