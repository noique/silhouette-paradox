# 《轮廓悖论》The Silhouette Paradox

## Mission
一份顶奢级交互数据可视化报告，揭示北美 DTC 女装/塑形衣品牌的"暗黑数据"——前端投射奢感美学，后端被 CAC 通胀、退货黑洞、欺诈吞噬。

## Tech Stack
- **Framework**: Next.js 16 App Router + TypeScript strict
- **Hosting**: Vercel Pro (Edge Network + Data Cache + ISR)
- **Database**: Supabase (PostgreSQL + pgvector + Realtime)
- **3D**: Three.js / React Three Fiber + @react-three/postprocessing
- **Animation**: GSAP + ScrollTrigger + @gsap/react + Lenis
- **Data Viz**: @visx/sankey + d3-sankey + d3-format
- **CDN**: Cloudflare R2 (assets)
- **Styling**: Tailwind CSS v4 + CSS custom properties

## Architecture: MVP Three-Section Layout
1. **HeroFabric** — R3F full-screen silk shader, scroll-triggered tear
2. **ExecutiveSummary** — 4 KPI cards, DOM + GSAP count-up
3. **SankeyAct** — $5M GMV profit destruction flow
4. **Closing** — Contrarian insight + CTA

## Design System

### Colors (CSS custom properties in globals.css)
- Revenue warmth: `--color-peach: #FFBE98`, `--color-gold: #E8C57A`
- Luxury grays: `#F5F0EB` → `#D3D3D3` → `#A9A9A9` → `#808080`
- Loss scale: `#FF6B6B` → `#722F37` → `#8B0000` → `#800000`
- Background: `--color-bg: #0A0A0A` (with subtle blue-purple noise, NOT pure black)

### Typography
- **Serif (narrative/titles)**: Playfair Display via next/font/google
- **Sans (data/labels)**: Inter with tabular numerals via next/font/google
- No system fonts. No fallback stacks in visible UI.

### Motion Language
- ALL transitions: slow, intentional. Cubic-bezier with long tails.
- NO bounces, NO springs, NO playful overshoots.
- Standard duration: 0.8–1.2s. Count-up: 1.5–2s. Stagger: 0.05–0.1s.
- 40%+ negative space at all times.

## Performance Budget
- FCP < 1.5s, LCP < 2.5s, CLS < 0.1
- Scroll animations: 55–60 FPS
- No Long Tasks > 50ms during scroll
- R3F: `dpr` max `[1, 1.5]`, bloom `resolutionScale={0.5}`
- Lazy load Canvas (`dynamic(() => import(...), { ssr: false })`)

## Critical Technical Patterns

### Lenis + GSAP Singleton (MUST follow exactly)
1. `GSAPProvider` registers `ScrollTrigger` ONCE at root layout
2. `gsap.ticker.lagSmoothing(0)` — always disabled
3. Lenis binds: `lenis.on('scroll', ScrollTrigger.update)`
4. GSAP drives Lenis: `gsap.ticker.add(time => lenis.raf(time))`
5. Lenis `autoRaf = false` — GSAP ticker is the single RAF owner
6. All animations use `useGSAP` hook from `@gsap/react`

### Supabase Tables
- `financial_flow_nodes` (scenario_id, period, node_key, label, node_type, sort_order)
- `financial_flow_links` (scenario_id, period, source_key, target_key, value, link_type, meta JSONB)
- RLS: anon read-only, authenticated write

## Coding Conventions
- File naming: kebab-case for files, PascalCase for components
- Use `@/*` import alias exclusively
- Server Components by default; `'use client'` only when needed
- `cn()` helper from `@/lib/utils` for className merging (clsx + tailwind-merge)
- GLSL shaders in `src/shaders/` as `.glsl` files
- No `console.log` in production code

## Data Source
Research PDFs in `/Volumes/Noique/0.0.3 数据艺术/调研报告/`
Key PDF: `功能女装痛点与欺诈模型.pdf` — contains complete $5M GMV financial flow model
