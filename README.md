# LADO — Fine Artificial Jewelry & 18K Anti-Tarnish Luxury

An ultra-luxury e-commerce storefront for **LADO Fine Artificial Jewelry**, inspired by [PRAO](https://prao.com/). Built with modern Vanilla JS, HTML5, rich Vanilla CSS, and powered by Vite.

---

## 🌟 Key Features

1. **Brand Identity & Luxury Aesthetic**:
   - Signature **LADO** royal diamond and filigree tiara branding.
   - Deep royal purple velvet (`#1b0a2a`) and warm champagne gold accents (`#e2b047`).
   - High-fashion editorial hero imagery featuring royal chokers and statement jewelry.

2. **Inspired by prao.com**:
   - **Top Announcement Bar**: Rotating offers, live countdown timer, and promo codes (`LADO10`, `PREPAID10`).
   - **Category Stories Carousel**: Circular quick-access navigation (Necklaces, Anti-Tarnish, Earrings, Rings, Bracelets, Bridal Sets, Under ₹499).
   - **Anti-Tarnish & Waterproof Spotlight**: Comparison table comparing standard artificial jewelry against LADO 18K PVD waterproof gold with waterproof splash imagery.
   - **"✨ Complete Your Look" Bundle Widget (FoxKit Style)**: Interactive combo builder pairing chokers and matching chandbalis with live 15% discount calculation.

3. **Full E-Commerce Interactive Flow**:
   - **Product Filtering & Sorting**: Filter by category, tags, or price under ₹499; sort by price or rating.
   - **Live Search Modal (`Cmd + K` / `Ctrl + K`)**: Instant predictive search across jewelry titles and materials.
   - **Quick View Modal**: Zoomed image preview, material specs, finish selections, and direct add to bag.
   - **Wishlist System**: Persistent ❤️ favorites saved in `localStorage` with quick-access view.
   - **Slide-out Bag Drawer**:
     - Dynamic **Free Shipping Progress Bar** (Free delivery above ₹499).
     - Quantity increments (`+` / `-`) and item removal.
     - Interactive Coupon Code box (`LADO10` for 10% off, `SPARKLE200` for ₹200 off).
   - **Multi-Step Checkout Flow**:
     - Address collection, prepaid extra 10% off vs. COD selection.
     - Order placement simulation with unique Order ID generation (`#LADO-XXXX`).

---

## 📁 Project Structure

```
lado/
├── index.html              # Semantic HTML5 markup, SEO meta tags & modals
├── package.json            # Vite configuration & scripts
├── vite.config.js          # Vite dev server settings (Port 5173)
├── public/
│   ├── lado-logo.png       # Official LADO Brand Logo
│   └── images/             # Studio photography assets
│       ├── hero-banner.jpg
│       ├── anti-tarnish.jpg
│       ├── emerald-choker.jpg
│       ├── chandbali-earrings.jpg
│       ├── diamond-ring.jpg
│       ├── solitaire-necklace.jpg
│       ├── tennis-bracelet.jpg
│       └── kundan-hasli.jpg
└── src/
    ├── style.css           # Luxury design system, CSS tokens & responsive styles
    ├── products.js         # Comprehensive jewelry catalog data & bundles
    └── main.js             # Reactive store logic, drawer state, search & checkout
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd "/Users/neelamvishwanatham/Documents/lado"
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Build for Production
```bash
npm run build
```
Outputs optimized assets into the `dist/` directory.
