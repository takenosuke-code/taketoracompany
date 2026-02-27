import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "たけとら - 京都・東山のアンティークショップ | Taketora Antique Shop Kyoto",
    short_name: "たけとら Taketora",
    description:
      "京都・東山区五条坂のアンティークショップ。骨董品、古道具、アニメフィギュア、ポケモンカード。Authentic antique shop in Kyoto Higashiyama.",
    start_url: "/ja",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
