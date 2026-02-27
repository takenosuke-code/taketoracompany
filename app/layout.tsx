import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "たけとら（Taketora）｜京都・東山のアンティークショップ",
  description:
    "京都・東山区五条坂のアンティークショップ「たけとら」。骨董品、古道具、アニメフィギュア、ポケモンカードなど厳選コレクション。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
