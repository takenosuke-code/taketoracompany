import { ImageResponse } from "next/og";
import { locales } from "@/i18n/request";

// The Edge runtime fetches its default font over the network instead of reading
// it from disk, which avoids a fileURLToPath crash in @vercel/og during builds
// on Windows. It also matches how Vercel serves this route in production.
export const runtime = "edge";

// Route segment config
export const alt = "たけとら Taketora — Kyoto Higashiyama Antique Shop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render one OG image per locale at build time.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isJa = locale === "ja";
  const tagline = isJa
    ? "Antique shop in Higashiyama, Kyoto"
    : "Antique shop in Higashiyama, Kyoto";
  const subline = "Pokemon cards, anime figures and Japanese antiques";
  // 店の看板（ロゴ）をそのまま載せる
  const logo = await fetch(
    new URL("../../public/assets/taketora_logo.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  // 看板のロゴと店名に、サイトのメニュー帯と同じ水色・茶色の帯を添える
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#ffffff",
          color: "#1e2329",
          padding: "0 80px",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={logo as unknown as string}
          width={150}
          height={150}
          style={{ position: "absolute", top: 64, left: 72 }}
        />
        <div style={{ fontSize: 128, fontWeight: 800, letterSpacing: 2, display: "flex" }}>
          Taketora
        </div>
        <div style={{ marginTop: 4, fontSize: 40, display: "flex" }}>{tagline}</div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#5a6169", display: "flex" }}>
          {subline}
        </div>
        <div
          style={{
            marginTop: 56,
            marginLeft: -80,
            marginRight: -80,
            height: 24,
            background: "#aeddf3",
            borderTop: "8px solid #5a3d24",
            display: "flex",
          }}
        />
        <div
          style={{
            height: 64,
            marginLeft: -80,
            marginRight: -80,
            padding: "0 80px",
            fontSize: 24,
            color: "#5a6169",
            display: "flex",
            alignItems: "center",
          }}
        >
          taketora-antique.com
        </div>
      </div>
    ),
    { ...size }
  );
}
