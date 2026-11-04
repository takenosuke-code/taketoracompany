import { notFound } from "next/navigation";

// どのルートにも当たらないURLを [locale]/not-found.tsx に回す（next-intl の推奨構成）。
// これが無いと、トップ直下の存在しないURLで中身のない404が表示される。
export default function CatchAllPage() {
  notFound();
}
