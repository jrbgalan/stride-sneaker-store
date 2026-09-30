# AXIS ⚡ Next.js Premium Sneaker & Streetwear Store

AXIS is a high-performance, modern e-commerce storefront for sneakers and streetwear built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Framer Motion**.

---

## ✨ Features & Highlights

### 🎨 Micro-Interactions & Fluid Animations (Framer Motion)
- **3D Card Tilt**: Product cards track cursor coordinates with smooth spring physics (`rotateX`, `rotateY`).
- **Shared-Element Transitions**: Clicking any sneaker card seamlessly morphs its image into the product detail hero via `layoutId`.
- **Fly-to-Cart Animation**: Adding a shoe to your cart clones a mini thumbnail that travels along a quadratic Bézier arc into the navigation cart icon, triggers a badge bounce, and slides open the `MiniCart` drawer.
- **Interactive Detail Gallery**: Mobile drag/swipe with rubberband spring physics, thumbnail crossfades, and a desktop hover-magnifier lens for inspecting textures.
- **Hero & Landing Effects**: Scroll-linked parallax shoe with floating loop animation, staggered headline word reveal, and ambient radial gradient glow.
- **Smooth Filter & Sort Changes**: Category filter chips and sorting use `<AnimatePresence mode="popLayout">` so the product grid reorganizes without jumping or layout shift.
- **Magnetic Buttons**: Interactive primary CTA buttons that gravitate toward the cursor on desktop.
- **Scroll Progress & Count-Up**: 3px spring scroll indicator at the top of the viewport and animated numeric counters for store statistics.
- **Reduced-Motion Compliant**: All animations respect `prefers-reduced-motion` and stay under 600ms.

---

### 🖼️ Automated WebP Image Pipeline
- **Automated Unsplash Ingestion**: Custom CLI script (`scripts/fetch-images.ts`) searches products by category, brand, and color swatches.
- **Sharp Image Optimization**: Images are automatically converted to modern `.webp` format (1200px width, quality 80).
- **Blur Placeholders**: Computes tiny base64 `blurDataURL` strings for instantaneous shimmer previews while loading.
- **Dynamic Swatch Matching**: Selecting a color swatch on product cards or the product page automatically switches to the corresponding sneaker colorway.
- **Graceful Fallbacks & Credits**: `<ProductImage />` wraps `next/image` with error fallbacks and links to photographer credits.

---

### 📱 Responsive & Accessible UI
- **Mobile Bottom Navigation**: Sticky bottom navigation bar on mobile (Home, Shop, Wishlist, Cart, Profile) with active indicators and dynamic cart badge.
- **Mobile Filter Drawer & Slide-in Menu**: Full-featured bottom sheet for faceted filtering on small viewports and clean slide-in menu replacing the desktop mega-menu.
- **Adaptive Breakpoints**: Tested and optimized for 375px (mobile), 768px (tablet), 1024px (laptop), and 1440px (desktop).
- **Dark Mode**: Integrated dark/light theme toggle with persistent storage and system theme detection.

---

### 🛍️ Complete E-Commerce Experience
- **Catalog & Faceted Search**: Filter by brand (Nike, Jordan, Adidas, New Balance, Puma, Converse, Vans), category, gender, size, color, and price range.
- **Global State (Zustand)**: Persistent shopping cart, wishlist, and theme state across browser sessions.
- **Interactive Cart & Checkout**: Slide-out mini cart, full cart page with quantity stepper, promo discount codes, and multi-step checkout.
- **Admin Dashboard**: Comprehensive admin management interface for products, orders, promo codes, customer accounts, and reviews.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) & Modern ESNext |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with Custom Design Tokens |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) with LocalStorage Persistence |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) & [Unsplash API](https://unsplash.com/developers) |

---

## 📂 Project Structure

```text
axis/
├── data/
│   └── product-images.json       # Manifest mapping product slugs to local WebP images & credits
├── public/
│   └── images/products/          # Local optimized .webp product images by slug
├── scripts/
│   └── fetch-images.ts           # Automated image pipeline script (Unsplash API + Sharp)
├── src/
│   ├── app/                      # Next.js App Router (pages & API route handlers)
│   │   ├── (storefront)/         # Shop, product detail, cart, checkout, wishlist
│   │   ├── admin/                # Admin suite (products, orders, customers, reviews)
│   │   └── api/                  # RESTful API handlers (/api/products, /api/orders, etc.)
│   ├── components/               # Reusable UI & design system components
│   │   ├── layout/               # Header, Footer, MobileNav, MiniCart, ScrollProgressBar
│   │   ├── home/                 # Hero, BrandStrip, FeaturedBanner, CategoryChips
│   │   ├── ui/                   # shadcn/ui primitives (Button, Dialog, Sheet, Skeleton, etc.)
│   │   ├── ProductCard.jsx       # 3D tilt card with swatch switching & fly-to-cart
│   │   ├── ProductImage.tsx      # Optimized Next.js image wrapper with blur placeholder
│   │   ├── MagneticButton.tsx    # Cursor attraction wrapper for desktop CTAs
│   │   └── WishlistButton.jsx    # Particle burst heart toggle
│   ├── lib/
│   │   ├── db/                   # Seed data & in-memory product database
│   │   ├── stores/               # Zustand state stores (cartStore, wishlistStore)
│   │   ├── productImages.ts      # Image manifest utilities & swatch resolution
│   │   └── useFlyToCart.js       # Quadratic Bézier curved trajectory hook
│   └── types/                    # TypeScript interfaces (Product, CartItem, Order, User)
├── next.config.mjs               # Next.js configuration (images, Turbopack, aliases)
├── tailwind.config.js            # Tailwind theme tokens & animation keyframes
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd axis
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: Required only if you want to run the automated image download script
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

> **Note**: The repository already includes 26 pre-optimized local `.webp` images in `public/images/products/`, so adding an API key is only needed if you want to fetch new assets.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack on port 3000 |
| `npm run build` | Compiles the production build and pre-renders static routes |
| `npm run start` | Starts the Next.js production server |
| `npm run lint` | Runs ESLint across all codebase files |
| `npx tsc --noEmit` | Runs TypeScript type checking across all typed modules |
| `npx tsx scripts/fetch-images.ts` | Runs the automated image pipeline to fetch & optimize images |

---

## 🧪 Verification & Quality Checks

- **Zero Linter Warnings**: `npm run lint` passes with 0 errors and 0 warnings.
- **Zero Type Errors**: `npx tsc --noEmit` passes with 0 errors.
- **Production-Ready**: `npm run build` compiles all 58 storefront and admin routes.
- **Accessibility**: Tap targets $\ge$ 44px, full keyboard accessibility, semantic ARIA labels.

---

## 📷 Photo Attributions

All footwear imagery used in this project is sourced through [Unsplash](https://unsplash.com) under the Unsplash License. Contributor credits are linked directly in the store footer and on product detail pages.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
