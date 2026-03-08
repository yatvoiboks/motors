# Product Catalog - Static B2B Catalog Website

A production-ready static product catalog website built with Astro. Designed for B2B companies that want to showcase products and receive quote requests via email. Optimized for deployment on Cloudflare Pages.

## Features

- **Static site** - No backend or database required
- **Search** - Client-side search by product name and description
- **Category filtering** - Filter by motors, propellers, ESCs, etc.
- **Pagination** - 12 products per page, scales to 100+ products
- **Product gallery** - Multiple images with thumbnail selector
- **Spec table** - Structured specification display
- **Modern B2B design** - Clean typography, professional layout
- **Product catalog** - Filter by category, browse products
- **Request Quote** - mailto links for quote requests
- **SEO optimized** - Meta tags, Open Graph, sitemap, robots.txt
- **Responsive** - Mobile-first design with TailwindCSS
- **Performance** - Lazy-loaded images, minimal JavaScript

## Project Structure

```
/src
  /components     - Reusable UI components
  /layouts        - Page layouts
  /pages          - Astro pages and routes
  /data           - JSON product and category data
/public
  /images         - Site images
  /products       - Product images
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### 3. Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

### 4. Preview Production Build

```bash
npm run preview
```

## Deploy to Cloudflare Pages

### Option A: Connect Git Repository (Recommended)

1. Push this project to a Git repository (GitHub, GitLab)
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Go to **Pages** → **Create a project** → **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 18 (in Environment variables: `NODE_VERSION` = `18`)
6. Click **Save and Deploy**

### Option B: Direct Upload via Wrangler

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy
wrangler pages deploy dist
```

### Option C: Cloudflare Pages with NPM

1. In Cloudflare Pages, create a new project
2. Choose "Direct Upload"
3. Run `npm run build` locally
4. Upload the `dist` folder

## Configuration

### Site URL (for sitemap & Open Graph)

Update `astro.config.mjs` with your production URL:

```js
export default defineConfig({
  site: 'https://yourdomain.com',
  // ...
});
```

Update `public/robots.txt`:

```
Sitemap: https://yourdomain.com/sitemap-index.xml
```

### Contact Email

Replace `sales@company.com` with your email in:

- `src/components/Footer.astro`
- `src/pages/contact.astro`
- `src/pages/product/[id].astro` (Request Quote mailto)

### Adding Products

Edit `src/data/products.json`. Each product:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "category": "motors",
  "image": "/products/your-image.jpg",
  "images": ["/products/image1.jpg", "/products/image2.jpg"],
  "description": "Product description",
  "specs": {
    "kv": "1950KV",
    "weight": "33g",
    "voltage": "6S"
  }
}
```

- `image` (required): Main product image
- `images` (optional): Array of images for product gallery. If omitted, single `image` is used.
- `specs` (required): Object with at least one key-value pair.

Add product images to `public/products/`. **Validation:** Run `npm run validate:products` to validate products.json. Validation runs automatically before `npm run build` via the prebuild hook. Required fields: `id`, `name`, `category`, `image`, `description`, `specs` (object with at least one entry).

### Adding Categories

Edit `src/data/categories.json`. Ensure category IDs match product categories.

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [TailwindCSS](https://tailwindcss.com) - Styling
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) - Sitemap generation

## License

MIT
