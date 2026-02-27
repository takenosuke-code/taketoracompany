import { Product, Category, Subcategory } from '@/types/product';

// Sample data - In production, this would come from a database or CMS
export const categories: Category[] = [
  {
    id: 'anime-figures',
    slug: 'anime-figures',
    name: 'Anime Figures',
    description: 'Authentic Japanese anime figures curated in Kyoto. All items are official releases with original boxes and copyright stickers.',
    image: '/images/anime-figures.jpg',
    subcategories: [
      {
        id: 'one-piece',
        slug: 'one-piece',
        name: 'One Piece',
        description: 'Official One Piece figures and collectibles',
        category: 'anime-figures',
      },
      {
        id: 'demon-slayer',
        slug: 'demon-slayer',
        name: 'Demon Slayer',
        description: 'Official Demon Slayer: Kimetsu no Yaiba figures',
        category: 'anime-figures',
      },
    ],
  },
  {
    id: 'traditional-souvenirs',
    slug: 'traditional-souvenirs',
    name: 'Traditional Souvenirs',
    description: 'Authentic Japanese traditional items and souvenirs.',
    image: '/images/traditional-souvenirs.jpg',
    subcategories: [
      {
        id: 'kimonos',
        slug: 'kimonos',
        name: 'Kimonos',
        description: 'Traditional Japanese kimonos',
        category: 'traditional-souvenirs',
      },
      {
        id: 'snacks',
        slug: 'snacks',
        name: 'Japanese Snacks',
        description: 'Authentic Japanese snacks and treats',
        category: 'traditional-souvenirs',
      },
    ],
  },
];

export const products: Product[] = [
  {
    id: 'luffy-gear-5',
    slug: 'luffy-gear-5',
    name: 'Luffy Gear 5 Figure - Banpresto',
    description: 'Authentic Banpresto One Piece figure featuring Monkey D. Luffy in his powerful Gear 5 transformation. This premium collectible is a must-have for any One Piece fan. Curated for Taketora Kyoto with original box and official copyright sticker. Mint condition, never opened.',
    category: 'anime-figures',
    subcategory: 'one-piece',
    price: 8500, // JPY
    currency: 'JPY',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800',
    ],
    brand: 'Banpresto',
    stock: 15,
    condition: 'New',
    copyrightSticker: true,
    originalBox: true,
    dimensions: {
      height: 20,
      width: 15,
      depth: 10,
      unit: 'cm',
    },
    weight: 300,
    tags: ['one-piece', 'luffy', 'gear-5', 'banpresto', 'authentic'],
  },
  {
    id: 'tanjiro-kamado',
    slug: 'tanjiro-kamado',
    name: 'Tanjiro Kamado Figurine - Aniplex',
    description: 'Official Aniplex Demon Slayer figure of Tanjiro Kamado. Direct import from Japan with authenticity guarantee. Original packaging and copyright sticker included. Perfect for collectors seeking authentic Japanese imports.',
    category: 'anime-figures',
    subcategory: 'demon-slayer',
    price: 12000,
    currency: 'JPY',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    brand: 'Aniplex',
    stock: 8,
    condition: 'New',
    copyrightSticker: true,
    originalBox: true,
    dimensions: {
      height: 25,
      width: 18,
      depth: 12,
      unit: 'cm',
    },
    weight: 450,
    tags: ['demon-slayer', 'tanjiro', 'aniplex', 'authentic'],
  },
  {
    id: 'traditional-kimono-silk',
    slug: 'traditional-kimono-silk',
    name: 'Traditional Silk Kimono - Kyoto Made',
    description: 'Authentic handcrafted silk kimono made in Kyoto. Perfect traditional Japanese souvenir. Includes obi belt and instructions for wearing.',
    category: 'traditional-souvenirs',
    subcategory: 'kimonos',
    price: 45000,
    currency: 'JPY',
    image: 'https://images.unsplash.com/photo-1583144576325-d389083f7a8c?w=800',
    stock: 5,
    condition: 'New',
    originalBox: true,
    tags: ['kimono', 'traditional', 'kyoto', 'silk'],
  },
];

// Helper functions to get data
export function getCategory(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getSubcategory(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
  const category = getCategory(categorySlug);
  return category?.subcategories?.find((sub) => sub.slug === subcategorySlug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string, subcategorySlug?: string): Product[] {
  if (subcategorySlug) {
    return products.filter(
      (p) => p.category === categorySlug && p.subcategory === subcategorySlug
    );
  }
  return products.filter((p) => p.category === categorySlug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getAllProducts(): Product[] {
  return products;
}
