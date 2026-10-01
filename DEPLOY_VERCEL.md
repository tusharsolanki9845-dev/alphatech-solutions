# AlphaTech Solutions — Vercel deployment checklist

Use this list when publishing the static site (HTML/CSS/JS + PWA) to [Vercel](https://vercel.com).

---

## 0. Before you start

- [ ] Unzip the project so the folder contains `index.html`, `style.css`, `script.js`, `sw.js`, `manifest.webmanifest`, and `assets/`
- [ ] Open the site locally (`npx serve .` from the project folder) and smoke-test: nav, WhatsApp links, form → WhatsApp, modal, mobile menu
- [ ] Confirm WhatsApp number in the site is correct (`916396015608` / +91 63960 15608)
- [ ] Optional: put the folder in a GitHub/GitLab/Bitbucket repo (recommended for updates)

---

## 1. Create / log in to Vercel

- [ ] Account at [vercel.com](https://vercel.com) (GitHub login is simplest)
- [ ] Install Vercel CLI only if you prefer terminal deploy: `npm i -g vercel`

---

## 2. Import the project

### Option A — Git (best)

- [ ] Push the **Alpha Tech** folder contents to a repo (root of the repo = folder that has `index.html`)
- [ ] Vercel → **Add New… → Project** → import that repo
- [ ] **Framework Preset:** Other (or leave blank)
- [ ] **Root Directory:** `.` (or the subfolder if `index.html` is not at repo root)
- [ ] **Build Command:** leave empty (static site — no build)
- [ ] **Output Directory:** leave empty / `.`
- [ ] **Install Command:** leave empty
- [ ] Click **Deploy**

### Option B — CLI

```bash
cd "Alpha Tech"    # folder that contains index.html
npx vercel
```

- [ ] Link to your account / team when prompted
- [ ] Confirm project settings (static; no build)
- [ ] Production deploy: `npx vercel --prod`

### Option C — Drag and drop

- [ ] Vercel dashboard → **Add New… → Project** → upload the folder that contains `index.html`
- [ ] Deploy and note the `*.vercel.app` URL

---

## 3. Project settings (after first deploy)

- [ ] **Settings → General:** project name (e.g. `alphatech-solutions`)
- [ ] **Settings → Build & Development:**
  - Framework: Other
  - Build command: *(empty)*
  - Output directory: *(empty)*
- [ ] **Settings → Domains:** add custom domain when ready (see §6)

---

## 4. Post-deploy functional checks

Open the live `https://….vercel.app` URL (HTTPS is required for PWA).

- [ ] Homepage loads over **HTTPS**
- [ ] All sections: About, Work, Services, Process, Packages, FAQ, Contact
- [ ] Mobile menu opens/closes
- [ ] **WhatsApp for Quote** opens with prefilled text
- [ ] Contact form opens WhatsApp with name / contact / message
- [ ] Service **Learn more** modal opens, traps focus, closes on Escape / overlay
- [ ] Founder image loads (`assets/founder.jpg`)
- [ ] Portfolio links open `tushar-portfolio-live.vercel.app`
- [ ] No mixed-content warnings in the browser console

### PWA (on HTTPS only)

- [ ] `manifest.webmanifest` returns 200
- [ ] `sw.js` returns 200
- [ ] Application → Service Workers: status **activated**
- [ ] Optional: Install / Add to Home Screen on mobile
- [ ] Optional: offline reload still shows shell (after one online visit)

---

## 5. SEO & sharing

- [ ] View page source: meta description and Open Graph tags present
- [ ] Share URL in WhatsApp/Telegram once and confirm preview looks acceptable
- [ ] Optional: [Google Search Console](https://search.google.com/search-console) → add property → sitemap later if you add one
- [ ] Update `canonical` and JSON-LD `url` in `index.html` to your **final production domain** (not only the portfolio URL)

---

## 6. Custom domain (optional)

- [ ] Domain purchased (any registrar)
- [ ] Vercel → Project → **Domains** → add `www.yourdomain.com` and/or apex
- [ ] Add DNS records Vercel shows (usually A/CNAME)
- [ ] Wait for SSL (automatic on Vercel)
- [ ] Re-test WhatsApp links and PWA on the custom domain
- [ ] Set canonical + JSON-LD URLs to the custom domain and redeploy

---

## 7. Headers (optional but professional)

In the project root (same level as `index.html`), you can add `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/manifest.webmanifest",
      "headers": [
        { "key": "Content-Type", "value": "application/manifest+json" }
      ]
    }
  ]
}
```

- [ ] Add `vercel.json` if desired → commit / redeploy
- [ ] Confirm site still loads and SW updates after deploy

---

## 8. After every content update

- [ ] Change copy/images locally and verify
- [ ] Bump service worker cache name in `sw.js` if you changed shell assets (e.g. `alphatech-v3`) so clients drop old caches
- [ ] Deploy (`git push` or `vercel --prod`)
- [ ] Hard-refresh production URL and re-check WhatsApp + one project link

---

## 9. Go-live acceptance (client-ready)

- [ ] Live URL works on phone and desktop
- [ ] Quote path (WhatsApp) works from India number
- [ ] No broken images or 404s in Network tab
- [ ] Footer contact info matches what you answer on WhatsApp
- [ ] You can explain packages + FAQ on a call without contradicting the site

---

## Quick troubleshooting

| Issue | Check |
|--------|--------|
| 404 on refresh of a path | This is a single `index.html` app — use `/` only unless you add routes |
| SW not registering | Must be HTTPS (or localhost); not `file://` |
| Old site showing | Bump `CACHE` in `sw.js`; hard refresh; unregister SW in DevTools |
| WhatsApp doesn’t open | Test on a real phone; desktop needs WhatsApp Web / app |
| Styles missing | Confirm `style.css` deployed next to `index.html`; check Network 200 |

---

*AlphaTech Solutions · static deploy · no Node build step required*


---

## TypeScript workflow (advanced)

Source of truth for site logic: `src/main.ts` (strict TypeScript).

```bash
cd "Alpha Tech"
npm install          # esbuild + typescript
npm run build        # compiles src/main.ts → script.js
npm run typecheck    # tsc --noEmit
```

Deploy the folder **after** `npm run build` so `script.js` is up to date.
On Vercel you can set Build Command to `npm run build` and leave Output empty
if you want CI to compile TypeScript on each push.

