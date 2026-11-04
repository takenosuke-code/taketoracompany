import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-10 text-center">
      <h1 className="sec-title text-[17px]">ページが見つかりません（404）</h1>
      <p className="mt-5 text-[13px]">
        URLが変わったか、ページが削除された可能性があります。
        <br />
        <span lang="en">This page doesn&apos;t exist or has moved.</span>
      </p>
      <p className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className="s-btn">
          トップページへ / Home
        </Link>
        <Link href="/collection" className="s-btn">
          商品一覧へ / All items
        </Link>
      </p>
    </div>
  );
}
