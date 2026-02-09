# PRD.md — PRNTD Website Rebrand

**Version:** 1.0
**Date:** 2026-02-08
**Owner:** Mustafa Boorenie
**Target Launch:** March 11, 2026
**Live URL:** prntdbybdq.com
**Repo:** mustafa-boorenie/plain-mufasa (Shopify Liquid theme)

---

## 1. Executive Summary

Full rebrand of PRNTD's Shopify storefront from a rigid, template-feeling theme into an immersive, editorial, high-fashion digital experience. The site must feel like a designer portfolio meets fashion film — where storytelling and interaction are the centerpiece, while still supporting product discovery and purchase.

**Core principle:** If it feels like a Shopify theme, redo it.

---

## 2. Brand Context

PRNTD is a heritage-inspired fashion brand rooted in Levantine (Middle Eastern) culture. The pieces blend traditional motifs — tatriz embroidery, keffiyeh patterns, Arabic calligraphy, watermelon symbolism — with contemporary streetwear and high-fashion silhouettes.

### Season Two Collection (Launch Drop)
- **Burning Night Shirt** — Painted art button-down with expressionist night scene
- **Chaquet** — Heritage-inspired jacket with tatriz embroidery
- **Keffiyeh Dress** — Strapless dress constructed from keffiyeh fabric
- **Tatriz Top** — Embroidered crop/top with cross-stitch patterns
- **Watermelon Print T-Shirt** — Graphic tee with watermelon motif

### Previous Collections (Archive)
- **ELEMENTICS** — Qamar oversized tee, Noor cropped tee, Moon/Sun-zipped hoodies, joggers
- **NEOLITHIUM** — Hoodies, pants, caps, tanks with "SEEKER", "SOLITUDE", "SOUL", "WEALTH" themes
- **FORSAN** — Aladdin pants, harem pants, warrior jacket
- **GENESIS** — Timeless collection
- **GILGAMESH** — Babylonic hoodie, Enik's vest

### Brand Identity
- **Logo:** "P." mark (bold italic P with period) + "PRNTD" wordmark
- **Color palette:** Monochrome base (black, white, light gray #E5E5E5) with imagery providing color
- **Typography direction:** Elegant serif for brand (Playfair Display / Canela family), clean sans for UI
- **Tone:** Minimal, premium, culturally rich, intentional

---

## 3. Design Vision

### 3.1 The Storytelling Journey

The current site is a static catalog. The rebrand introduces a **narrative arc**:

1. **ARRIVAL** (Hero) — Full-screen immersive moment. The brand introduces itself through imagery + interaction. No scroll needed to understand the vibe.
2. **DISCOVERY** (Scroll) — Editorial product reveal. Large imagery, cultural context, minimal copy. Each piece has breathing room.
3. **CONNECTION** (Collection/PDP) — Deep dive into individual pieces. Origin stories, detail shots, the "why" behind the design.
4. **COMMITMENT** (Cart/Checkout) — Clean, fast, frictionless.

### 3.2 Signature Interaction: Circular Reveal Cursor

The homepage hero features a **dual-layer image reveal** that defines the brand's digital identity:

- Full-viewport hero with Image Layer 1 (campaign shot) as the **base layer** (always visible)
- Mouse cursor becomes a circular spotlight (~200px diameter with 50px soft feather)
- Spotlight reveals Image Layer 2 **drawn onto a canvas** within spotlight regions (alternate grade / B&W / texture variant)
- **Motion echoes:** Fast movement leaves soft, fading circular ghosts (premium feel, not gaming UI). Max 10 echoes, spawning at >6px/frame velocity.
- **Background grid:** Faint animated grid (opacity ~0.035) reacts subtly to cursor position. Grid lines shift proportional to cursor offset from center.
- **Dynamic inversion:** All UI elements (logo, nav, social icons) invert color when spotlight passes within threshold distance
- **Light parallax:** UI elements drift up to 10px opposite to cursor movement
- **Smooth transitions:** 300ms easing on all state changes, cursor position smoothed via lerp (factor 0.1)
- **Performance target:** 60fps, no jank

#### Technical Architecture of Reveal (v2)

The original v1 approach (canvas overlay with `mix-blend-mode: multiply` + `destination-out` compositing) was **fundamentally broken** — it could not actually reveal Layer 2 through Layer 1 because the canvas sat on top and only affected its own pixels.

**Correct approach (v2):**
1. **Layer 1** (base image) is a standard `<img>`, always visible (z-index 1)
2. **Layer 2** is hidden in DOM. JS loads it as an `Image` object.
3. **Reveal Canvas** (z-index 2) sits between Layer 1 and UI elements. Each frame:
   - Soft radial gradients are drawn at spotlight + echo positions (white with alpha)
   - `globalCompositeOperation = 'source-in'` ensures subsequent draw only appears where alpha exists
   - Layer 2 image is drawn full-canvas, clipped to the spotlight regions
4. **Grid Canvas** (z-index 3) draws subtle animated grid lines
5. **UI Elements** (z-index 10) float on top with parallax + inversion

**Touch support:** Tap-and-drag reveals on mobile. Spotlight disappears on touch-end. Reduced spotlight radius (70px vs 100px desktop).

### 3.3 Visual Language
- Clean base, near-zero UI chrome
- Imagery does the talking
- Generous whitespace
- Slow, intentional transitions
- No template vibes — every pixel should feel considered

---

## 4. Page Requirements

### 4.1 Homepage (index.liquid)

**Above the fold (full viewport):**
- Full-screen hero with dual-layer reveal interaction
- Top-left: PRNTD wordmark (elegant serif)
- Top-right: Single nav link — "Shop" or "Archive"
- Bottom-right: Social icons (Instagram + X) as solid SVG, high-contrast
- No scroll required to understand the brand

**Below the fold (scroll reveals):**
- Editorial product showcase for current drop
- Large product tiles with lots of whitespace
- Slow fade-in transitions on scroll
- Minimal copy — let imagery speak
- Cultural storytelling moments between products (optional: short poetry, Arabic text fragments)

### 4.2 Collection Page (collection.liquid)
- Editorial grid layout (not a standard Shopify grid)
- Large imagery, minimal product info on hover
- Subtle hover effects (scale, overlay)
- Filter by collection if multiple drops exist
- Maintains the premium, minimal aesthetic

### 4.3 Product Detail Page (product.json)
- Hero-sized product imagery (editorial layout)
- Minimal, elegant CTA ("Add to Bag" not "Add to Cart")
- Product story / cultural context section
- Detail shots gallery
- Size selector + quantity (clean, inline)
- Related pieces at bottom

### 4.4 Cart (cart.liquid)
- Clean slide-out drawer or minimal page
- Product thumbnails, quantities, totals
- Express checkout if available
- Matches the premium aesthetic

### 4.5 Supporting Pages
- **About / Culture** — Brand story, heritage narrative
- **Lookbook** — Full-screen editorial imagery
- **Contact** — Minimal form

---

## 5. Technical Architecture

### 5.1 Stack
- **Platform:** Shopify (existing store at prntdbybdq.com)
- **Theme:** Custom Liquid theme (evolving from Plain Jane 2.0 base)
- **Animation:** GSAP (lightweight, proven for this type of interaction)
- **No build step:** Pure Shopify Liquid + vanilla JS + GSAP CDN
- **Fonts:** Google Fonts (Playfair Display for brand, Inter for UI)

### 5.2 New/Modified Files

**Assets (new):**
- `assets/hero-interaction.js` — v2 circular reveal (source-in compositing), motion echoes, grid animation, parallax, inversion
- `assets/scroll-animations.js` — Intersection Observer-based fade-ins, parallax scrolling
- `assets/rebrand.css` — New design system styles (full hero, editorial, collection, PDP, footer)
- `assets/hero/hero-layer-1.png` — AI-generated hero base image (placeholder)
- `assets/hero/hero-layer-2.png` — AI-generated hero reveal image (placeholder)
- ~~`assets/gsap.min.js`~~ — **Removed dependency.** All animations are pure vanilla JS (requestAnimationFrame + IntersectionObserver). No GSAP needed.

**Templates (modified):**
- `templates/index.liquid` — Complete rewrite for immersive hero + editorial scroll
- `templates/collection.liquid` — Editorial grid overhaul
- `templates/product.json` — Editorial PDP layout

**Sections (new/modified):**
- `sections/hero-immersive.liquid` — Full-screen dual-layer hero with schema for image uploads
- `sections/editorial-products.liquid` — Below-fold product showcase
- `sections/product-editorial.liquid` — PDP editorial layout

**Layout:**
- `layout/theme.liquid` — Updated font loading, GSAP inclusion, updated CSS

### 5.3 Performance Requirements
- Hero interaction: 60fps
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Images: lazy-loaded below fold, hero images preloaded
- GSAP loaded async/deferred

### 5.4 Mobile Considerations
- Circular cursor reveal → touch-based reveal on mobile (tap + hold, or replaced with swipe gesture)
- Parallax reduced on mobile
- Full-screen hero retained
- Touch-friendly product tiles

---

## 6. Assets Available

### Product Photography (carousel/)
- 8 product shots on neutral gray backgrounds (1-8.jpg)
- Pieces: P. logo, cropped tee with heart key, tatriz jacket, watermelon tee, keffiyeh dress, embroidered top, burning night shirt, product detail

### Season Two Tech Packs (PDFs)
- Burning_Night_Shirt.pdf
- Chaquet.pdf
- Keffiyeh_Dress.pdf
- Tatriz_Top.pdf
- Watermelon_Print_T-Shirt.pdf

### Brand Assets
- Brand Guidelines.ai (Illustrator file — need exported assets)
- P. logo mark
- Previous collection design files (Elementics, Neolithium, Forsan, Genesis, Gilgamesh)

### Assets Generated (AI — Placeholder/Development)
- [x] Hero Image Layer 1 — Editorial fashion shot, woman in tatriz-embroidered garment, chiaroscuro lighting (1536x1024, GPT Image 1)
- [x] Hero Image Layer 2 — B&W abstract keffiyeh textile close-up, high contrast (1536x1024, GPT Image 1)
- Located at: `assets/hero/hero-layer-1.png`, `assets/hero/hero-layer-2.png`
- **Note:** These are AI-generated placeholders. Final production images should be real campaign photography.

### Assets Still Needed
- [ ] **Real campaign photography** to replace AI hero placeholders
- [ ] High-resolution product photography (beyond the carousel mockups)
- [ ] PRNTD wordmark in SVG
- [ ] Social icons in SVG (or we generate clean ones)

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1) ← CURRENT
- [x] Download and catalog all assets
- [x] Write PRD
- [x] Implement hero interaction v1 (broken — canvas compositing approach incorrect)
- [x] **Fix hero interaction v2** — Complete rewrite with correct `source-in` compositing
- [x] New homepage layout (`index.liquid`) with hero + editorial scroll + storytelling
- [x] New typography (Playfair Display brand + Inter UI) + color system (`rebrand.css`)
- [x] Generate AI placeholder hero images (Layer 1 + Layer 2) via GPT Image 1
- [x] Scroll animations (`scroll-animations.js`) — IntersectionObserver-based fade-ins
- [ ] Set up development branch
- [ ] Test hero interaction in live Shopify dev environment
- [ ] Mobile touch interaction testing

### Phase 2: Commerce (Week 2)
- [ ] Editorial collection page
- [ ] Editorial PDP
- [ ] Cart redesign
- [ ] Mobile optimization for hero interaction

### Phase 3: Polish (Week 3)
- [ ] Scroll animations + transitions
- [ ] Storytelling content sections
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Replace placeholders with final campaign imagery

### Phase 4: Launch Prep (Week 4 → March 11)
- [ ] QA on staging
- [ ] Load testing
- [ ] SEO setup
- [ ] Analytics
- [ ] Push to production

---

## 8. Success Criteria

- [ ] Hero interaction feels "expensive and intentional" (per brief)
- [ ] No element feels like a Shopify template
- [ ] 60fps on hero interactions
- [ ] < 3s page load
- [ ] Mobile experience is premium (not a degraded desktop)
- [ ] Clear purchase flow: hero → browse → product → buy
- [ ] Mustafa says "this is fire" 🔥

---

## 9. Open Questions for Mustafa

1. **Hero images:** The carousel mockups are product-on-gray. Do you have campaign/lifestyle shots (model wearing pieces, editorial photography)? The hero needs a full-bleed campaign image, not a product flat lay.
2. **Brand name:** Is it "PRNTD" or "PRNTD." (with period)? The P. logo suggests the period is part of the identity.
3. **Pricing:** What's the price range for Season Two? Affects positioning cues.
4. **Shopify plan:** Are you on Basic, Shopify, or Advanced? Affects checkout customization options.
5. **Domain:** Keeping prntdbybdq.com or moving to something cleaner (prntd.com)?
6. **Existing products in Shopify:** Are Season Two products already created in Shopify admin, or do they need to be set up?

---

*Last updated: 2026-02-09 06:10 UTC*
