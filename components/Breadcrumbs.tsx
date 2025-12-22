import Link from 'next/link';
import { BreadcrumbItem } from '@/types/product';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto">
      <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-[#F2E8DC]/70 min-w-max">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center flex-shrink-0">
            {index > 0 && <span className="mx-1 sm:mx-2 text-[#D4AF37]/50">/</span>}
            {index === items.length - 1 ? (
              <span className="text-[#F2E8DC] font-medium truncate max-w-[150px] sm:max-w-none" aria-current="page" title={item.label}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#D4AF37] transition-colors duration-300 truncate max-w-[100px] sm:max-w-none"
                title={item.label}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
