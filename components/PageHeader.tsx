import Breadcrumbs from "@/components/Breadcrumbs";
import { BreadcrumbItem } from "@/types/product";

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}

/** 下層ページ共通の見出し。左揃えで、パンくず・見出し・短い説明だけを置く */
export default function PageHeader({ breadcrumbs, title, intro, children }: PageHeaderProps) {
  return (
    <div className="border-b border-line">
      <div className="mx-auto max-w-shop px-4 pb-8 pt-5 sm:px-6 sm:pb-10">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-[32px] font-black sm:text-[44px]">{title}</h1>
        {intro && (
          <div className="mt-3 max-w-[40rem] text-[16px] leading-[1.9] text-ink-soft">{intro}</div>
        )}
        {children}
      </div>
    </div>
  );
}
