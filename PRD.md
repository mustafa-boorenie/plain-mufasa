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

- Full-viewport hero with Image Layer 1 (campaign shot) as background
- Mouse cursor becomes a circular spotlight (~150px diameter)
- Spotlight reveals Image Layer 2 beneath (alternate grade / B&W / texture variant)
- **Motion echoes:** Fast movement leaves soft, fading circular ghosts (premium feel, not gaming UI)
- **Background grid:** Faint animated grid reacts subtly to cursor position
- **Dynamic inversion:** All UI elements (logo, nav, social icons) invert color when spotlight passes over them
- **Light parallax:** UI elements drift 2-10px opposite to cursor movement
- **Smooth transitions:** 300ms easing on all state changes
- **Performance target:** 60fps, no jank

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
- `assets/hero-interaction.js` — Circular reveal cursor, motion echoes, grid animation, parallax
- `assets/scroll-animations.js` — Intersection Observer-based fade-ins, parallax scrolling
- `assets/rebrand.css` — New design system styles
- `assets/gsap.min.js` — GSAP core (or CDN)

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

### Assets Needed
- [ ] Hero Image Layer 1 (campaign/lifestyle shot — full resolution)
- [ ] Hero Image Layer 2 (alternate grade / B&W variant)
- [ ] High-resolution product photography (beyond the carousel mockups)
- [ ] PRNTD wordmark in SVG
- [ ] Social icons in SVG (or we generate clean ones)

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1) ← CURRENT
- [x] Download and catalog all assets
- [x] Write PRD
- [ ] Set up development branch
- [ ] Implement hero interaction (circular reveal + echoes + grid + parallax)
- [ ] New homepage layout with placeholder images
- [ ] New typography + color system

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

*Last updated: 2026-02-08 22:45 UTC*
