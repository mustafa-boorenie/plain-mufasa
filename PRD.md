# PRD.md — PRNTD Website Rebrand & Launch

**Version:** 2.0
**Date:** 2026-02-10
**Owner:** Mustafa Boorenie
**Target Launch:** March 11, 2026 (29 days out)
**Live URL:** prntdbybdq.com
**Repo:** mustafa-boorenie/plain-mufasa (Shopify Liquid theme)
**Handle:** @mustafaboorenie (X/Twitter)

---

## 1. Executive Summary

Full rebrand of PRNTD's Shopify storefront from a rigid template into an immersive, editorial, high-fashion digital experience. The site blends a dark cinematic hero with a clean light editorial body — designer portfolio meets fashion film.

**Core principle:** If it feels like a Shopify theme, redo it.

---

## 2. Brand Context

PRNTD is a heritage-inspired fashion brand rooted in Levantine (Middle Eastern) culture. Traditional motifs — tatriz embroidery, keffiyeh patterns, Arabic calligraphy — meet contemporary streetwear.

### Current Products in Store (6 pieces)
| Product | Price | Notes |
|---------|-------|-------|
| "SUN" Zip-Up Hoodie | $69.99 | ELEMENTICS collection |
| "MOON" Zip-Up Hoodie | $69.99 | ELEMENTICS collection |
| "PRNTD" Pants | $54.99 | Matching set |
| "PRNTD" Hoodie | $69.99 | Matching set |
| "NOOR" Cropped Tee | $59.99 | Graphic tee |
| "QAMAR" Oversized Tee | $54.99 | Graphic tee |

All products have clean white studio photography (32 images total).

### Season Two Collection (Launch Drop — March 11)
- **Burning Night Shirt** — Expressionist painted art button-down
- **Chaquet** — Heritage-inspired jacket with tatriz embroidery
- **Keffiyeh Dress** — Strapless dress from keffiyeh fabric
- **Tatriz Top** — Cross-stitch embroidered top
- **Watermelon Print T-Shirt** — Graphic tee with watermelon motif

### Previous Collections (Archive)
- ELEMENTICS → NEOLITHIUM → FORSAN → GENESIS → GILGAMESH

### Brand Identity
- **Logo:** PRNTD wordmark (Shopify settings: `enter_screen_logo`, `collection_screen_logo`, `product_screen_logo`)
- **Color:** Dark hero (#0a0a0a) → light body (#f5f5f3) → dark manifesto → light footer
- **Typography:** Playfair Display (brand/editorial) + Inter (UI/commerce)
- **Tone:** Minimal, premium, culturally rich, intentional

---

## 3. Design Vision

### 3.1 Site Architecture (Light Editorial + Dark Hero)

The site follows a narrative arc with intentional color transitions:

1. **ARRIVAL** (Hero) — Full-viewport dark immersive hero with dual-layer circular reveal cursor interaction. PRNTD logo top-left, "SHOP" top-right, social icons bottom.
2. **TRANSITION** — 30% height gradient dissolves hero into off-white (#f5f5f3)
3. **DISCOVERY** (Light sections) — Campaign statement, full-bleed editorial, editorial split, product highlights grid, all looks horizontal scroll
4. **MANIFESTO** (Dark punctuation) — Brand manifesto with texture background, white text — the only dark section in the body
5. **ARCHIVE** — Previous collections with horizontal scroll
6. **FOOTER** — Full 4-column footer with newsletter signup

### 3.2 Signature Interaction: Circular Reveal Cursor

Homepage hero features dual-layer image reveal:
- Layer 1: Campaign editorial photo (always visible)
- Layer 2: Revealed through circular spotlight cursor via canvas `source-in` compositing
- Motion echoes on fast movement, background grid, dynamic UI inversion
- 60fps target, pure vanilla JS + rAF (no GSAP)
- Touch support on mobile (tap-and-drag)

### 3.3 Visual Language
- Dark hero → light body (SSENSE/END Clothing aesthetic)
- White product photography backgrounds (intentional, not a bug)
- Generous whitespace, editorial typography
- Playfair Display italic for headlines, Inter 300/400/500 for everything else
- Slow, intentional transitions via IntersectionObserver

---

## 4. Current Implementation Status

### ✅ COMPLETE

**Homepage (index.liquid):**
- [x] Full-viewport dark hero with dual-layer circular reveal interaction
- [x] Hero gradient dissolve to off-white (#f5f5f3)
- [x] Campaign statement — "FALL / WINTER 2026" + "Roots Reimagined" large typography
- [x] Full-bleed editorial image (16:9, campaign-editorial-wide-01.png)
- [x] Editorial split section (image + text + CTA)
- [x] 2x2 product highlights grid (repeat(2, 1fr), Inter font, prices below)
- [x] Brand manifesto (dark section, texture background, white text)
- [x] All Looks horizontal scroll carousel
- [x] Archive section (previous collections)
- [x] Full footer (4-col: brand, navigate, connect, newsletter)
- [x] Scroll animations (IntersectionObserver fade-ins)
- [x] Mobile 2-column grids (highlights + all looks)

**Collection Page (collection.liquid):**
- [x] Light editorial layout
- [x] 2-column product grid (desktop and mobile)
- [x] Clean Inter font for product names
- [x] PRNTD logo in header + footer
- [x] Scroll animations
- [x] Removed min-height whitespace bug

**Product Detail Page (product.liquid):**
- [x] Split layout (image gallery left, details right)
- [x] Thumbnail image switching
- [x] Variant selection (option buttons → hidden select sync)
- [x] AJAX add-to-cart ("Add to Bag")
- [x] Sticky mobile Add to Bag bar (fixed bottom)
- [x] Accordions (Details, Care, Shipping, Returns)
- [x] Related products section
- [x] All fonts forced to Inter (killed old theme Inconsolata bleed)
- [x] Description clamped (3 lines desktop / 2 mobile)

**Theme Infrastructure:**
- [x] theme.liquid routing — index/collection/product bypass old layout
- [x] CSS kill-switch for old theme elements on all rebranded pages
- [x] Klaviyo popup suppressed
- [x] Cart page redirects to /collections/all (cart drawer replaces it)
- [x] rebrand.css design system (1400+ lines)
- [x] hero-interaction.js, scroll-animations.js, product-page.js

**Cart Drawer (BUILT, NOT WIRED):**
- [x] cart-drawer.js — slide-out AJAX cart overlay
- [x] Shipping progress bar (free shipping at $150)
- [x] Quantity controls, remove buttons
- [x] Add-to-cart interception
- [x] window.PRNTDCart API (.open(), .close(), .refresh())
- [x] CSS in rebrand.css (Playfair italic titles, Inter UI)
- [ ] **NOT loaded in theme.liquid yet** — needs script tag

**Campaign Images:**
- [x] 7 AI campaign images generated (OpenAI GPT Image 1)
- [x] 3 deployed to theme assets (portrait, wide landscape, texture close-up)
- [x] 15 reference images analyzed from prntd-assets/

### 🔧 REMAINING (Pre-Launch Checklist)

#### P0 — Must ship before March 11
1. [ ] **Wire cart drawer** — Add cart-drawer.js to theme.liquid, test full add-to-cart flow
2. [ ] **Season Two products** — Create in Shopify admin with photography, descriptions, pricing
3. [ ] **Real campaign photography** — Replace AI placeholders with actual editorial shots
4. [ ] **Mobile responsive audit** — Full pass at 390px on all pages
5. [ ] **Checkout flow test** — End-to-end: browse → add to bag → checkout → payment
6. [ ] **Domain/SEO** — Meta titles, descriptions, Open Graph images, sitemap
7. [ ] **About page** — Brand story, heritage narrative, founder bio
8. [ ] **Shipping & Returns pages** — Policy content
9. [ ] **Contact page** — Form or email link
10. [ ] **Privacy Policy / Terms** — Legal pages

#### P1 — Should ship before March 11
11. [ ] **Typography audit** — Ensure only Inter + Playfair Display render site-wide
12. [ ] **Image optimization** — Compression, proper srcset, lazy loading below fold
13. [ ] **Core Web Vitals** — LCP < 2.5s, FID < 100ms, CLS < 0.1
14. [ ] **Collection page editorial header** — Hero image or campaign banner at top
15. [ ] **Footer links wired** — About, Shipping, Returns, Contact all linked
16. [ ] **Newsletter integration** — Klaviyo or Shopify email for footer signup form
17. [ ] **Favicon + social sharing image** — PRNTD branded

#### P2 — Nice to have for launch
18. [ ] **Lookbook page** — Full-screen editorial imagery gallery
19. [ ] **Product page related products** — Verify section renders, style to match
20. [ ] **404 page** — Branded, not default Shopify
21. [ ] **Loading state** — Branded page transition or skeleton screens
22. [ ] **Announcement bar** — "Season Two drops March 11" or "Free shipping over $150"

---

## 5. Technical Architecture

### 5.1 Stack
- **Platform:** Shopify (prntdbybdq.com, auto-deploys from GitHub main)
- **Theme:** Custom Liquid (evolved from Plain Jane 2.0 base)
- **Animation:** Pure vanilla JS + rAF + IntersectionObserver (no GSAP)
- **Fonts:** Google Fonts (Playfair Display 400/600/italic, Inter 300/400/500)
- **Build:** No build step — pure Shopify Liquid + vanilla JS

### 5.2 File Map
```
layout/
  theme.liquid          — Routes index/collection/product to custom templates, others to old layout

templates/
  index.liquid          — Full editorial homepage with hero interaction
  collection.liquid     — Light editorial product grid
  product.liquid        — Split-layout PDP with AJAX cart
  cart.liquid           — Redirects to /collections/all (cart drawer handles cart)

assets/
  rebrand.css           — Full design system (1400+ lines)
  hero-interaction.js   — Dual-layer circular reveal with source-in compositing
  scroll-animations.js  — IntersectionObserver fade-in animations
  product-page.js       — Gallery, variants, AJAX add-to-cart, accordions
  cart-drawer.js        — Slide-out AJAX cart (NOT YET LOADED)
  campaign-editorial-01.png      — AI portrait (tatriz hoodie model)
  campaign-editorial-wide-01.png — AI landscape (desert scene)
  campaign-texture-01.png        — AI texture (embroidered fabric close-up)

snippets/
  header-index.liquid   — Homepage header (logo + shop + socials)
  __default-head.liquid — Shared head (fonts, CSS, meta)
  __default-template.liquid — Old theme wrapper (bypassed on rebranded pages)
```

### 5.3 Key Technical Decisions
- `source-in` canvas compositing for hero reveal (v1 multiply/destination-out was broken)
- `product.json` deleted → `product.liquid` for full template control
- Font override with `!important` on all `.pdp-editorial` elements (old theme Inconsolata bleeds through body)
- `object-fit: contain` on product images (white-bg photos need centering, not cropping)
- Cart page redirect + drawer instead of cart template (better UX, no reload)
- Klaviyo blocked via CSS (not JS route blocking) for production safety

### 5.4 Shopify Logo Settings
- `enter_screen_logo` → Homepage + footer
- `collection_screen_logo` → Collection header
- `product_screen_logo` → PDP header

---

## 6. Marketing Strategy & Launch Plan

### 6.1 Timeline (29 days to launch)

**Week 1 (Feb 10-16): Technical Completion**
- Wire cart drawer, complete checkout flow
- Season Two products into Shopify admin
- About/Shipping/Returns/Contact pages
- Mobile responsive fixes
- Domain + SEO setup

**Week 2 (Feb 17-23): Content & Photography**
- Campaign photography (real shoots or source from Mustafa)
- Replace all AI placeholders with real images
- Write product descriptions for Season Two
- Lookbook page if photography allows
- Newsletter setup (Klaviyo integration)

**Week 3 (Feb 24-Mar 2): Pre-Launch Marketing**
- Launch countdown content on social media
- Email list building (capture emails via site + social)
- Teaser content — behind-the-scenes, heritage story, process shots
- Influencer/friend seeding (send pieces for UGC)
- Generate video content with Remotion (tweet-to-video, trending topic takes, product showcases)

**Week 4 (Mar 3-10): Launch Week**
- Final QA pass on all pages
- Load testing
- Pre-launch email to subscribers
- Day-of social media blitz
- Launch day: March 11

### 6.2 What Jarvis Can Do (Automated Marketing Arsenal)

**Content Generation (Remotion Video Skill — BUILT):**
- Turn top-performing tweets into animated video cards for Reels/TikTok/Shorts
- Generate trending topic commentary videos with Mustafa's voice (once cloned)
- Product showcase videos with motion graphics (brand overlays, CTAs)
- Clip assembly from raw footage with branded intro/outro
- Text reveal animations for quotes, stats, announcements

**Social Media Intelligence:**
- Fetch @mustafaboorenie's top tweets by engagement → repurpose as video content
- Scan trending topics in fashion/heritage/entrepreneurship niches
- Generate content calendar aligned with trends + launch timeline

**Brand Asset Generation:**
- AI campaign images (OpenAI GPT Image 1) for social + site
- Social sharing images (Open Graph, Twitter cards)
- Story/Reel templates

**Email Marketing:**
- Newsletter signup already in footer
- Pre-launch email sequence (can draft copy)
- Launch day announcement
- Post-launch follow-up

**SEO & Analytics:**
- Meta titles/descriptions for all pages
- Open Graph + Twitter Card tags
- Structured data (Product schema for Google Shopping)
- Google Analytics / Shopify analytics setup guidance

**Content Writing:**
- Product descriptions (heritage storytelling angle)
- About page copy
- Brand manifesto refinement
- Social media captions
- Press release for launch

### 6.3 Content Pillars for Social

1. **Heritage** — The story behind the patterns. Tatriz embroidery, keffiyeh symbolism, Levantine culture.
2. **Process** — Behind the scenes. Design decisions, fabric sourcing, craftsmanship.
3. **Identity** — Who wears PRNTD. Street style, cultural pride, modern heritage.
4. **Founder** — Mustafa's story. Doctor by day, designer by passion. The $1M vision.
5. **Product** — The pieces themselves. Detail shots, styling ideas, drop announcements.

### 6.4 Launch Day Playbook

**T-7 days:** "One week" teaser across all platforms
**T-3 days:** Behind-the-scenes content + product preview
**T-1 day:** "Tomorrow" countdown + email blast to subscribers
**Launch day (Mar 11):**
- Morning: Instagram/TikTok post with product showcase video
- Midday: X thread — brand story + collection reveal
- Evening: "Thank you" / first customers highlight
**T+1 day:** UGC reshares, restock updates if applicable
**T+7 days:** "First week" recap, customer reviews, restock

---

## 7. Blocked / Needs Input from Mustafa

1. **Season Two product photography** — Do you have editorial shots, or just tech pack flats?
2. **Season Two pricing** — What's the price range?
3. **Season Two products in Shopify** — Are they created in admin yet, or need setup?
4. **Google Drive folder** — For raw video clips (voice clone + content pipeline)
5. **Campaign photoshoot** — Any planned? Even phone shots in good lighting would upgrade the site massively
6. **Shipping details** — Rates, processing time, carrier, international?
7. **Return policy** — Timeframe, conditions, process?
8. **Email marketing** — Using Klaviyo? Mailchimp? Something else?
9. **Social accounts** — Instagram handle? TikTok? (X is @mustafaboorenie)
10. **Budget for ads** — Any paid social planned for launch?

---

## 8. Success Criteria

- [ ] Hero interaction feels "expensive and intentional"
- [ ] No element feels like a Shopify template
- [ ] 60fps on hero interactions
- [ ] < 3s page load
- [ ] Mobile experience is premium (not a degraded desktop)
- [ ] Complete purchase flow works end-to-end
- [ ] Season Two products live and purchasable on March 11
- [ ] At least 100 email subscribers before launch
- [ ] Social media content running 2 weeks before launch
- [ ] Mustafa says "this is fire" 🔥

---

## 9. Lessons Learned

1. **Canvas compositing:** v1's destination-out + multiply couldn't reveal Layer 2. source-in is the correct approach.
2. **Old theme font bleed:** Inconsolata on body requires nuclear `!important` overrides on all rebranded elements.
3. **Mobile grids:** Always keep 2-column on mobile for fashion e-commerce. Single column makes products look sparse.
4. **object-fit contain vs cover:** White-background product photos need `contain` to avoid cropping. `cover` works for editorial/campaign shots.
5. **Klaviyo popup:** Blocks entire site — suppress with CSS, not just JS route blocking.
6. **Git push timeouts:** GitHub API (blob → tree → commit → update ref) is a reliable fallback when HTTPS push hangs.
7. **Shopify deploys:** ~30-60 seconds from GitHub push to live. Can verify via Playwright before telling user to refresh.
8. **Playfair Display italic for product names:** Looks wrong at small sizes on commerce pages. Inter is better for product info. Reserve Playfair for editorial headlines only.

---

*Last updated: 2026-02-10 03:47 UTC*
