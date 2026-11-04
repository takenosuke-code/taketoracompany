import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-shop px-4 pb-24 pt-16 sm:px-6">
      <p className="text-[15px] font-bold text-ink-soft">404</p>
      <h1 className="mt-2 text-[32px] font-black sm:text-[40px]">ページが見つかりません</h1>
      <p className="mt-3 max-w-[36rem] text-[16px] leading-[1.9] text-ink-soft">
        URLが変わったか、ページが削除された可能性があります。
        <br />
        <span lang="en">This page doesn&apos;t exist or has moved.</span>
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn">
          トップページへ <span lang="en" className="font-medium opacity-80">Home</span>
        </Link>
        <Link href="/collection" className="btn-line">
          商品一覧へ <span lang="en" className="font-medium text-ink-soft">All items</span>
        </Link>
      </div>
      <div className="shelf mt-16" />
    </div>
  );
}
