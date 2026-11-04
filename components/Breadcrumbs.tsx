import Link from "next/link";
import { BreadcrumbItem } from "@/types/product";
import JsonLd from "./JsonLd";

const BASE_URL = "https://taketora-antique.com";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${BASE_URL}${item.href}`,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="overflow-x-auto">
        <ol className="flex min-w-max items-center text-[13px] text-ink-soft">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="mx-2 text-[#9aa0a5]">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span
                  aria-current="page"
                  className="max-w-[16rem] truncate font-bold text-ink"
                  title={item.label}
                >
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="py-2 underline-offset-4 hover:text-ink hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
