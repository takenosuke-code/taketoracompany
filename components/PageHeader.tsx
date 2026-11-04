import Breadcrumbs from "@/components/Breadcrumbs";
import { BreadcrumbItem } from "@/types/product";

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}

/** 下層ページの見出し。パンくず、赤い帯の見出し、短い説明 */
export default function PageHeader({ breadcrumbs, title, intro, children }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-site px-4 pt-4 sm:px-6">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="bar-title mt-5 text-[22px] sm:text-[26px]">{title}</h1>
      {intro && <div className="mt-3 max-w-[46rem] text-[14px] text-ink-soft">{intro}</div>}
      {children}
    </div>
  );
}
