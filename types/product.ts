export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number; // Price in JPY
  currency: 'JPY';
  image: string;
  images?: string[];
  brand?: string;
  stock: number;
  condition: 'New' | 'Used' | 'Mint';
  authenticityProof?: string; // URL to authenticity proof image
  copyrightSticker?: boolean;
  originalBox?: boolean;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
    unit: 'cm' | 'inches';
  };
  weight?: number; // in grams
  tags?: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}
