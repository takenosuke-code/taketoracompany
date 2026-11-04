import Breadcrumbs from "@/components/Breadcrumbs";
import { BreadcrumbItem } from "@/types/product";

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}

/** 下層ページの見出し。パンくず、中央寄せの小さな見出し、短い説明だけ */
export default function PageHeader({ breadcrumbs, title, intro, children }: PageHeaderProps) {
  return (
    <div className="pt-3">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="sec-title mt-6 text-[17px]">{title}</h1>
      {intro && <div className="mx-auto mt-4 max-w-[40rem]">{intro}</div>}
      {children}
    </div>
  );
}
