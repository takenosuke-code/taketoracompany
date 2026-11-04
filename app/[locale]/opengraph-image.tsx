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
  const subline = "Old pottery, tea tools, anime figures and Pokemon cards";
  // 店の看板（ロゴ）をそのまま載せる
  const logo = await fetch(
    new URL("../../public/assets/taketora_logo.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  // 店の白い壁と白木の棚、看板の水色だけで組む
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
          color: "#22262a",
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
        <div style={{ marginTop: 16, fontSize: 28, color: "#565c62", display: "flex" }}>
          {subline}
        </div>
        <div
          style={{
            marginTop: 56,
            marginLeft: -80,
            marginRight: -80,
            height: 36,
            background: "#d3af7c",
            borderBottom: "10px solid #b58a52",
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
            color: "#565c62",
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
