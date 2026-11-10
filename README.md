# Aditya Thakur — Portfolio

A personal site for a frontend engineer, built so the site itself is the work
sample: scroll-driven motion, a WebGL hero, a DevTools-style inspect mode, and
a command palette — all of it measured against real accessibility and
performance constraints rather than asserted.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind
CSS v4 · shadcn/ui · GSAP + ScrollTrigger · Lenis · React Three Fiber · Zustand
· TanStack Query · React Hook Form + Zod · Resend · next-themes

---

## Requirements

> [!IMPORTANT]
> **Node >= 20.19 is required.** Tailwind v4's Node bridge `require()`s an
> ESM-only dependency, and `require(esm)` only landed in Node 20.19 / 22.12.
>
> On older Node you get an `ERR_REQUIRE_ESM` stack that blames
> `src/lib/fonts.ts` or `globals.css`. **That is a red herring** — the font file
> is fine, the runtime is too old. `npm run dev` and `npm run build` fail fast
> with a readable message instead (`scripts/check-node.mjs`).

The repo pins a known-good version in `.nvmrc`:

```bash
nvm use          # → 22.18.0  (nvm install, the first time)
```

---

## Run it

```bash
nvm use
npm install
cp .env.example .env.local     # fill in RESEND_API_KEY to enable the form
npm run dev                    # http://localhost:3000
```

| Script | Does |
|---|---|
| `npm run dev` | Dev server (runs the Node version check first) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Editing content

**No component contains hardcoded copy.** Everything renders from typed modules
in `src/data/` — edit these and the page, the case-study routes, the command
palette, the sitemap and the JSON-LD all update together.

| File | Holds |
|---|---|
| `src/data/profile.ts` | Name, title, bio, email, location, stats, social links |
| `src/data/projects.ts` | The seven case studies: problem / solution / impact, stack, links, art |
| `src/data/experience.ts` | Timeline entries — roles, dates, achievements |
| `src/data/skills.ts` | Skill groups for the orbit, plus the marquee list |
| `src/data/how-built.ts` | The "How this site was built" cards and their snippets |
| `src/data/site.ts` | Canonical URL, nav order, SEO defaults |

### Things to replace before launch

These are the only placeholders left in the project:

1. **LinkedIn URL** — `src/data/profile.ts`, marked `[PLACEHOLDER]`.
2. **Project screenshots** — `public/projects/*.svg` are generated abstract
   mockups. Drop real screenshots in and update `image` in `projects.ts`
   (`.png`/`.webp` is fine; `next/image` handles both).
3. **Live / source links** — every project has `liveUrl: null` and
   `repoUrl: null`, which renders a disabled button reading *"Private client
   work — link available on request."* Set a URL to turn it into a real link.
4. **`NEXT_PUBLIC_SITE_URL`** — defaults to `https://adityathakur.dev`.

`public/resume.pdf` is already wired to the Download Résumé button and the
command palette.

---

## Architecture

```
src/
├─ app/
│  ├─ layout.tsx              Providers, fonts, metadata, JSON-LD, shell
│  ├─ page.tsx                Section composition (server component)
│  ├─ globals.css             Design tokens, glass/aurora utilities, keyframes
│  ├─ opengraph-image.tsx     OG image generated at build time (Satori)
│  ├─ sitemap.ts / robots.ts  Generated from /data
│  ├─ api/contact/route.ts    Zod re-validation → rate limit → Resend
│  └─ projects/[slug]/        Pre-rendered case studies (generateStaticParams)
├─ components/
│  ├─ sections/               Hero, About, Skills, Experience, Projects, …
│  ├─ three/                  R3F scene, glass knot, static fallback
│  ├─ inspect/                Inspect mode: data attrs + one delegated overlay
│  ├─ command/                ⌘K palette
│  ├─ layout/                 Navbar, Footer, Preloader, FloatingDock
│  └─ ui/                     shadcn primitives + Aurora, GlassCard, Magnetic…
├─ hooks/                     useLenis, useMousePosition, useReducedMotion, …
├─ lib/                       gsap (plugin registration), fonts, validations, json-ld
├─ store/                     Zustand UI store (device state only)
└─ data/                      ← all content lives here
```

### Decisions worth knowing

**One ticker drives everything.** Lenis ships its own `requestAnimationFrame`
loop. Running it alongside GSAP's means two loops race each frame and
scrub-linked timelines drift. `useLenis` drives `lenis.raf` from the GSAP
ticker instead, so pinning, parallax and scrub stay frame-synced.

**Server state vs device state.** TanStack Query owns anything from the
network; Zustand owns what belongs to this browser tab (theme, inspect mode,
palette visibility, whether the intro has played). They never overlap.

**Inspect mode costs nothing until used.** `<Inspectable>` is a server
component that only writes `data-*` attributes. A single client overlay
resolves the nearest one by event delegation, so adding a section adds no
listeners and no JavaScript.

**3D knows when to quit.** The hero scene is `next/dynamic` + `ssr: false`, and
is skipped entirely on coarse pointers, ≤4 GB device memory, ≤4 cores, Data
Saver, reduced motion, or viewports under 1024px — replaced by a pure-CSS
gradient. The canvas also pauses its frameloop when scrolled out of view.

**Motion is a preference.** `prefers-reduced-motion` is read once and threaded
everywhere: Lenis is never instantiated, no ScrollTrigger is built, the 3D
scene is skipped, and reveals render as static content.

**Gradient text is never split.** GSAP's SplitText moves glyphs into child
elements that inherit `color: transparent` without the clipped background, so
`background-clip: text` paints nothing. Gradient headings use `<MaskedText>`
(one element, masked) instead of `<SplitTextReveal>`.

---

## The contact form

One Zod schema in `src/lib/validations.ts` is imported by both the client form
and the route handler, so the browser and the server can't disagree about what
counts as valid. The handler also:

- rejects a filled **honeypot** field by returning `200` (telling a bot it was
  caught just teaches the author to stop filling it in);
- **rate limits** to 5 submissions per IP per 10 minutes — in-memory, so it's a
  speed bump for casual abuse, not a security control. Swap in Upstash Redis
  if it ever needs to hold under real traffic;
- sets `replyTo` to the sender, so replying from your inbox reaches them.

Without `RESEND_API_KEY` the endpoint returns `503` and the UI tells the
visitor to email directly, rather than pretending the message was sent.

---

## Deploy to Vercel

1. Push to GitHub, then **Import Project** on Vercel.
2. Set **Node.js Version → 22.x** in *Settings → General*. This matters for the
   same Tailwind v4 reason as local development.
3. Add environment variables (*Settings → Environment Variables*):

   | Key | Value |
   |---|---|
   | `RESEND_API_KEY` | From [resend.com/api-keys](https://resend.com/api-keys) |
   | `CONTACT_TO_EMAIL` | Where enquiries land |
   | `CONTACT_FROM_EMAIL` | Must be a **domain you verified in Resend** |
   | `NEXT_PUBLIC_SITE_URL` | Your production origin, no trailing slash |

4. Deploy. Build settings are the Next.js defaults — nothing to change.

> `onboarding@resend.dev` works without domain verification but can **only**
> deliver to the address that owns the Resend account. Verify a domain before
> launch or the form will look like it works while silently going nowhere.

---

## Keyboard

| Key | Does |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette |
| `I` | Toggle inspect mode |
| `Esc` | Close palette / exit inspect / skip the intro |
| `Tab` | Full keyboard navigation, with a skip link and visible focus rings |
