import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "たけとら - 京都・東山のアンティークショップ | Taketora Antique Shop Kyoto",
    short_name: "たけとら Taketora",
    description:
      "京都に3店舗（高台寺・清水寺・亀屋町）のアンティークショップ。骨董品、古道具、アニメフィギュア、ポケモンカード。Antique shop with three locations in Kyoto.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
