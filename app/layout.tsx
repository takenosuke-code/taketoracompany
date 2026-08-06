import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "たけとら（Taketora）｜京都・東山のアンティークショップ",
  description:
    "京都のアンティークショップ「たけとら」。高台寺・清水寺・亀屋町の3店舗で、骨董品、古道具、アニメフィギュア、ポケモンカードなど厳選コレクションを販売。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
