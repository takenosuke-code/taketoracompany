import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-site px-4 pt-10 sm:px-6">
      <h1 className="bar-title text-[22px]">ページが見つかりません（404）</h1>
      <p className="mt-4 text-[14px] text-ink-soft">
        URLが変わったか、ページが削除された可能性があります。
        <br />
        <span lang="en">This page doesn&apos;t exist or has moved.</span>
      </p>
      <p className="mt-6 flex flex-wrap gap-2">
        <Link href="/" className="btn">
          トップページへ / Home
        </Link>
        <Link href="/collection" className="btn-sub">
          商品一覧へ / All items
        </Link>
      </p>
    </div>
  );
}
