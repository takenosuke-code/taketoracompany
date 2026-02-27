import Link from 'next/link';
import { BreadcrumbItem } from '@/types/product';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto">
      <ol className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm min-w-max">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center flex-shrink-0">
            {index > 0 && (
              <svg
                className="mx-1.5 sm:mx-2 w-3.5 h-3.5 text-[#D4AF37]/30 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            {index === items.length - 1 ? (
              <span
                className="text-[#F2E8DC]/80 font-medium truncate max-w-[180px] sm:max-w-none"
                aria-current="page"
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[#F2E8DC]/40 hover:text-[#D4AF37] transition-colors duration-300 truncate max-w-[120px] sm:max-w-none font-light"
                title={item.label}
              >
                {index === 0 ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
