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
    ? "Kyoto · Higashiyama Antique Shop"
    : "Authentic Japanese Antiques · Kyoto";
  const subline = isJa
    ? "Antiques · Folk Tools · Anime Figures · Pokemon Cards"
    : "Antiques · Folk Tools · Anime Figures · Pokemon Cards";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 30%, #2a2622 0%, #1c1917 60%, #0c0a09 100%)",
          color: "#f5f0e6",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #b8860b, #e6c66e, #b8860b)",
          }}
        />
        <div
          style={{
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: 18,
            color: "#e6c66e",
            display: "flex",
          }}
        >
          TAKETORA
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 40,
            letterSpacing: 6,
            color: "#d6cdb8",
            display: "flex",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 26,
            letterSpacing: 2,
            color: "#a89f8a",
            display: "flex",
          }}
        >
          {subline}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            letterSpacing: 4,
            color: "#8a8270",
            display: "flex",
          }}
        >
          taketora-antique.com
        </div>
      </div>
    ),
    { ...size }
  );
}
