// 店内で撮った写真（Supabase の site-assets バケット）。
// alt は「写っているもの」をそのまま書く。生成画像・イメージ画像は使わない。

const BASE =
  "https://raemfaxgstoezqgbtdry.supabase.co/storage/v1/object/public/site-assets";

export interface ShopPhoto {
  src: string;
  altJa: string;
  altEn: string;
}

export const PHOTOS = {
  /** 器の棚の手前にフィギュアが並ぶ（店の特徴がいちばんわかる1枚） */
  potteryAndFigures: {
    src: `${BASE}/IMG_8706%20(1).jpg`,
    altJa: "器が並ぶ木の棚の手前に、ワンピースのフィギュアが置かれた店内",
    altEn: "Wooden shelves of pottery, with One Piece figures on the counter in front",
  },
  aisle: {
    src: `${BASE}/IMG_8736.jpg`,
    altJa: "奥に長い店内。左は器、右はフィギュアの箱の棚",
    altEn: "A long, narrow shop: pottery on the left, boxed figures on the right",
  },
  figureWall: {
    src: `${BASE}/IMG_8739%20(1).jpg`,
    altJa: "壁一面の棚に積まれた箱入りのフィギュア",
    altEn: "A whole wall of boxed figures",
  },
  potteryShelves: {
    src: `${BASE}/IMG_8741.jpg`,
    altJa: "木の棚に並ぶ花瓶、碗、皿、たぬきの置物",
    altEn: "Vases, bowls, plates and a tanuki figurine on wooden shelves",
  },
  figureBoxes: {
    src: `${BASE}/IMG_8745.jpg`,
    altJa: "床から天井まで積まれたフィギュアの箱",
    altEn: "Figure boxes stacked from floor to ceiling",
  },
  pokemonShelf: {
    src: `${BASE}/IMG_8759.jpg`,
    altJa: "壁の棚に置いたポケモンカードの未開封BOX",
    altEn: "Sealed Pokémon card boxes on a wall shelf",
  },
  windowShelf: {
    src: `${BASE}/antique2.JPG`,
    altJa: "窓ぎわの棚に並ぶ湯のみ、急須、面",
    altEn: "Teacups, teapots and masks on a shelf by the window",
  },
  figureRows: {
    src: `${BASE}/rows%20of%20anime%20figs.JPG`,
    altJa: "段ごとに並んだフィギュアと、その下の箱",
    altEn: "Rows of figures on shelves, with their boxes below",
  },
} satisfies Record<string, ShopPhoto>;

export function photoAlt(photo: ShopPhoto, locale: string): string {
  return locale === "ja" ? photo.altJa : photo.altEn;
}
