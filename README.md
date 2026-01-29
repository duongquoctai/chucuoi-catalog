# Next.js + MongoDB E-commerce Pattern

This is a production-ready Next.js application with MongoDB integration, optimized for performance and SEO.

## Features

### Database & Models

- **MongoDB Connection**: Optimized connection pooling with caching
- **Mongoose Models**:
  - `Product`: Complete product model with pricing, inventory, SEO fields
  - `Category`: Category model with hierarchical support
- **TypeScript Interfaces**: Full type safety across the application

### API Routes

- `GET /api/products` - List products with filtering, sorting, pagination
- `GET /api/products/[slug]` - Get product details with related products
- `GET /api/categories` - List all active categories

### Pages

- `/products` - Product listing page with filters
- `/products/[slug]` - Product detail page with SEO optimization

### Components

- `ProductList` - Product grid with loading states
- `ProductGallery` - Image gallery with thumbnails
- `CategoryFilter` - Category filtering sidebar
- `ProductFilters` - Price range filters
- `RelatedProducts` - Related products display
- `AddToCartButton` - Quantity selector and cart actions

### Performance Optimizations

- Connection pooling and caching
- Database indexes for common queries
- Image optimization with Next.js Image
- Lazy loading and code splitting
- Server-side rendering for SEO

### SEO Features

- Dynamic metadata generation
- Structured data ready
- Meta tags for social sharing
- Semantic HTML
- Clean URLs with slugs

## Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Schema

### Product Schema

- Pricing: basePrice, currentPrice, salePrice, discountPercentage
- Inventory: sku, stock, lowStockThreshold
- Media: images[], thumbnail
- SEO: metaTitle, metaDescription, metaKeywords
- Status: isActive, isFeatured, isOnSale
- Analytics: viewsCount, salesCount

### Category Schema

- Basic: name, slug, description, image
- Hierarchy: parentCategory
- Status: isActive, displayOrder

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env.local`

3. Run development server:

```bash
npm run dev
```

4. Visit `http://localhost:3000/products`

## API Usage Examples

### Get Products

```
GET /api/products?category=123&minPrice=100000&maxPrice=500000&sort=price-asc&page=1
```

### Get Product Detail

```
GET /api/products/romantic-roses
```

### Get Categories

```
GET /api/categories
```

## Performance Tips

1. **Database Indexes**: Already configured for common queries
2. **Image Optimization**: Use Next.js Image component
3. **Caching**: API routes use `force-dynamic` for fresh data
4. **Connection Pooling**: Configured in lib/mongodb.ts

## Next Steps

1. Add authentication
2. Implement shopping cart
3. Add checkout process
4. Set up payment gateway
5. Add admin dashboard
6. Implement order management
