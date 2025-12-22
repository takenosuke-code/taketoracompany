# Taketora - Japanese E-commerce Site with Silo Architecture

A Next.js e-commerce application implementing the **Silo Architecture (Hub and Spoke Model)** for optimal SEO. This structure organizes content so search engines understand exactly what you sell, prevents orphan pages, and maximizes link juice flow.

## Architecture Overview

### Silo Structure

```
Root: Homepage (/)
├── Hub: Anime Figures (/anime-figures)
│   ├── Spoke: One Piece (/anime-figures/one-piece)
│   │   └── Leaf: Luffy Gear 5 Figure (/anime-figures/luffy-gear-5)
│   └── Spoke: Demon Slayer (/anime-figures/demon-slayer)
└── Hub: Traditional Souvenirs (/traditional-souvenirs)
    ├── Spoke: Kimonos (/traditional-souvenirs/kimonos)
    └── Spoke: Snacks (/traditional-souvenirs/snacks)
```

### File Structure

```
app/
├── layout.tsx                    # Root layout (Header/Footer)
├── page.tsx                      # Homepage (The Root)
├── [category]/                   # The Hub (e.g., /anime-figures)
│   ├── page.tsx                 # Category Landing Page
│   └── [product]/               # The Leaf (e.g., /anime-figures/luffy-gear-5)
│       └── page.tsx             # Product Detail Page
└── shipping/
    └── page.tsx                 # Shipping Policy Page
```

## Features

### SEO Optimizations

- ✅ **Dynamic Meta Tags**: Uses Next.js `generateMetadata` for dynamic titles and descriptions
- ✅ **JSON-LD Structured Data**: Product schema for rich snippets in Google Search
- ✅ **Breadcrumbs**: Auto-generated breadcrumb navigation for better SEO
- ✅ **Logical URLs**: Clean, hierarchical URL structure
- ✅ **Performance**: Optimized images with Next.js Image component (WebP/AVIF)

### Conversion Rate Optimization (CRO)

- ✅ **Currency Converter**: Automatic currency detection and conversion
- ✅ **Sticky Add to Cart**: Mobile-optimized sticky cart button
- ✅ **Shipping Calculator**: Real-time shipping cost calculation
- ✅ **Trust Signals**: Authenticity badges, original box indicators, copyright stickers
- ✅ **Core Web Vitals**: Optimized for fast loading

### Inbound Marketing Features

- ✅ **Authenticity Focus**: Emphasizes "Authentic", "Direct from Japan", "Original Box"
- ✅ **Shipping Transparency**: Detailed shipping policy page targeting shipping keywords
- ✅ **Collector-Friendly**: Mint condition, copyright stickers, authenticity proof

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Key Files

- `app/[category]/page.tsx` - Category hub pages with SEO metadata
- `app/[category]/[product]/page.tsx` - Product detail pages with JSON-LD schema
- `components/Breadcrumbs.tsx` - Breadcrumb navigation component
- `components/CurrencyConverter.tsx` - Currency conversion widget
- `components/ShippingCalculator.tsx` - Shipping cost calculator
- `components/ProductDetail.tsx` - Product detail with sticky cart button
- `lib/data.ts` - Sample product and category data
- `types/product.ts` - TypeScript types for products and categories

## Customization

### Adding New Products

Edit `lib/data.ts` and add products to the `products` array:

```typescript
{
  id: 'product-slug',
  slug: 'product-slug',
  name: 'Product Name',
  category: 'anime-figures', // Must match category slug
  subcategory: 'one-piece',  // Optional subcategory
  price: 8500,
  // ... other fields
}
```

### Adding New Categories

Edit `lib/data.ts` and add categories to the `categories` array.

### Currency Exchange Rates

Update exchange rates in `lib/currency.ts`. In production, fetch from a live API.

### Shipping Costs

Customize shipping calculation logic in `lib/shipping.ts`.

## SEO Checklist

- [x] Structure: Next.js App Router with `[category]/[product]` folders
- [x] Meta: `generateMetadata` for dynamic titles/descriptions
- [x] Schema: JSON-LD Product schema on all product pages
- [x] Content: Focus on "Authentic", "Direct from Japan", "Mint Condition"
- [x] Speed: Next.js Image component for optimized loading
- [ ] Analytics: Add Google Analytics or similar
- [ ] Sitemap: Generate XML sitemap
- [ ] Robots.txt: Configure search engine crawling

## Performance

This app is optimized for Core Web Vitals:

- **LCP (Largest Contentful Paint)**: Optimized images with Next.js Image
- **FID (First Input Delay)**: Client components only where needed
- **CLS (Cumulative Layout Shift)**: Stable layouts with proper dimensions

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.
