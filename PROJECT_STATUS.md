# SafeTrace — Project Status

**Live:** https://safetrace-ai.vercel.app
**Owner:** Sumit Kumar ([@Sumitkr28](https://github.com/Sumitkr28))
**Company:** xorvion
**Status as of:** 2026-05-29
**Version:** v1.5-beta

---

## 1. What this project is

SafeTrace is a free web tool that classifies any URL as **Safe / Suspicious / Phishing / Malware / Defacement** in under five seconds and explains the verdict with concrete evidence.

Most existing URL checkers look only at the URL string. SafeTrace does that AND opens the page in a real headless browser to inspect the content itself. Two independent verdicts run side-by-side — a stacking-ensemble ML classifier and a 4-layer deep forensic analyzer — so the user can see them agree (high confidence) or disagree (worth manual review).

The product is positioned as a real security tool, not a college demo. Reference points: VirusTotal, urlscan.io, Cloudflare Radar.

## 2. How it works

### 2.1 End-to-end flow

```
┌───────────────────┐     ┌──────────────────────┐     ┌────────────────────┐
│  Next.js (Vercel) │ ──► │  FastAPI (HF Space)  │ ──► │  HF Model repo     │
│  UI / dashboard   │     │  ML + 4 analyzers    │     │  2 GB stacked.pkl  │
└───────────────────┘     └──────────────────────┘     └────────────────────┘
```

1. User pastes a URL into the Scan page.
2. Frontend `POST /scan` on the FastAPI backend.
3. Backend:
   - Normalises the URL, resolves DNS, fetches WHOIS.
   - Extracts ~80 lexical/host features and runs the stacking ensemble.
   - Spins up Playwright Chromium, navigates, takes a full-page screenshot.
   - Runs the 4-layer deep analyzer (Network, HTML, JavaScript, Visual).
   - Queries threat-intel feeds (Google Safe Browsing, URLhaus, PhishTank, OpenPhish).
   - Fuses everything into a final verdict + sub-scores + SHAP explanations.
4. Response is returned with the screenshot inlined as base64 — no extra fetch.
5. Frontend renders the verdict hero, sub-scores, screenshot, and the evidence accordion.

### 2.2 The ML model

| Component | Detail |
|---|---|
| Type | Stacking ensemble (level-0: XGBoost + LightGBM + CatBoost + RandomForest; level-1: LogisticRegression) |
| Features | ~80 lexical + host features (URL length, entropy, TLD, subdomain count, has-IP, suspicious tokens, WHOIS age, etc.) |
| Training data | ~500k labelled URLs (Kaggle malicious-URLs dataset, augmented with PhishTank + OpenPhish) |
| Explainability | SHAP — top 5 features shown per prediction |
| Artifact | `stacked_model.pkl` (~2 GB) stored on Hugging Face Model Hub |

### 2.3 The deep site analyzer (4 layers)

| Layer | What it checks | Examples of flags |
|---|---|---|
| **Network & Identity** | DNS, WHOIS, SSL cert, IP, hosting ASN | New domain (<30 days), self-signed cert, hosting in known abuse ASN |
| **HTML inspection** | DOM, forms, iframes, meta tags | Hidden/external POST forms, iframe to suspicious origin, meta-refresh redirect |
| **JavaScript inspection** | Inline + remote JS, obfuscation patterns | `eval`, `unescape`, packed strings, base64 blobs, anti-debugger code |
| **Visual analysis** | Screenshot + perceptual hash | Brand-logo pHash match (PayPal/Amazon/SBI/etc.) but domain mismatch → impersonation |

### 2.4 Threat-intel feeds

- **Google Safe Browsing** (10k req/day free)
- **URLhaus** (free, unlimited)
- **PhishTank** (CSV pulled hourly)
- **OpenPhish** (community feed)

### 2.5 Tech stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 14 (App Router) · TypeScript · TailwindCSS · react-simple-maps · jspdf |
| Backend | FastAPI · Python 3.11 · Uvicorn · Playwright (headless Chromium) |
| ML | scikit-learn · XGBoost · LightGBM · CatBoost · SHAP |
| Brand match | imagehash (perceptual hash) |
| Hosting | Vercel (frontend) · Hugging Face Spaces (backend, Docker SDK, 16 GB RAM, free tier) |
| Analytics | Vercel Web Analytics |

### 2.6 Cost

| Service | Tier | Monthly |
|---|---|---|
| Hugging Face Spaces (Docker CPU basic) | Free, 16 GB RAM, 2 vCPU, always-on | **$0** |
| Vercel (Hobby) | Free, 100 GB bandwidth | **$0** |
| Google Safe Browsing API | Free, 10k req/day | **$0** |
| URLhaus | Free, unlimited | **$0** |
| **Total** | | **$0/month** |

## 3. What's done

### Frontend (Next.js)

- [x] Scan page (empty / scanning / result states) with stepper progress
- [x] Bulk scan page — CSV drag-drop, live row-by-row processing, KPI cards
- [x] Threat dashboard — KPI cards, time-series, world map, recent-phishing table
- [x] About / Methodology page
- [x] Top nav with route highlighting, version chip, GitHub icon
- [x] Footer with Contact / Terms / Privacy / Status / API links
- [x] Theming, splash screen, particle background
- [x] Verdict chip / risk bar / sub-score / evidence accordion / URL chip / code block components
- [x] Toast system
- [x] Vercel Web Analytics enabled
- [x] Contact email (xorvion.ai@gmail.com) in footer
- [x] **New logo** (shield + magnifying glass) wired into TopNav and Footer
- [x] **"By xorvion"** branding tagline under SafeTrace wordmark

### Backend (FastAPI, on Hugging Face Spaces)

- [x] `POST /scan` — single URL → ScanResult with inline base64 screenshot
- [x] `POST /bulk` — CSV upload, SSE stream of progress events
- [x] `GET /dashboard/stats` — aggregate stats (in-memory ring buffer, last 200 scans)
- [x] `GET /healthz` — liveness probe
- [x] CORS locked to the Vercel origin
- [x] Stacking ensemble loaded into memory on startup
- [x] Playwright Chromium baked into the Docker image
- [x] 4-layer deep analyzer (network / HTML / JS / visual)
- [x] WHOIS lookup with caching
- [x] Trusted-domains allowlist (cuts noise on top 1k Tranco domains)
- [x] SHAP explainability surfaced in the response

### ML

- [x] Dataset augmentation pipeline (`augment_dataset.py`)
- [x] Stacking ensemble training (`malicious_stack.py`)
- [x] Evaluation harness (`evaluate.py`)
- [x] Final model — ~96% accuracy on holdout, F1 ≈ 0.94

### Deployment

- [x] Vercel project `safetrace-ai` live at https://safetrace-ai.vercel.app
- [x] Hugging Face Space running the backend
- [x] HF Model Hub hosting `stacked_model.pkl` (2 GB via LFS)
- [x] CORS / secrets configured on both ends

## 4. What's pending / next

### Short term

- [ ] Move from in-memory ring buffer to a tiny KV store so dashboard stats survive Space restarts (Upstash Redis free tier)
- [ ] PDF export of a scan result (button is already in the UI — wire up `jspdf`)
- [ ] Share-link generator for a scan result (currently a placeholder button)
- [ ] Real GitHub repo link in the TopNav GitHub button (currently a toast)
- [ ] Mobile polish — bulk scan currently shows a "use desktop" message; trim it down to be usable on phones
- [ ] Add Terms / Privacy real pages instead of toasts

### Medium term

- [ ] User accounts (optional) — let returning users see their scan history
- [ ] API keys + a `/v1` REST surface for programmatic use
- [ ] Rate limiting on `/scan`
- [ ] Webhook on verdict (for SIEM/SOAR integrations)
- [ ] Browser extension that scans the active tab on click

### Long term / research

- [ ] Continual learning — retrain the model weekly on the URLs the deep analyzer flagged that the model missed
- [ ] LLM-as-judge layer for tie-breaking when ML and deep analyzer disagree
- [ ] Multilingual phishing detection (current model is English-centric)
- [ ] Mobile app (React Native) sharing the same FastAPI backend

## 5. Repositories

| Repo | Purpose |
|---|---|
| https://github.com/Sumitkr28/Project--SafeTrace | Frontend (Next.js) — what's deployed to Vercel |
| https://github.com/xorvion-ai/project--safetrace | Mirror under the xorvion organisation |
| https://huggingface.co/spaces/Sumitkr28/safetrace-api | Backend (FastAPI + Playwright) |
| https://huggingface.co/Sumitkr28/safetrace-model | Stacking-ensemble model artifact |

## 6. Built by

**Sumit Kumar** — AI/ML Engineer, founder of **xorvion**.

- Email: sumitchoudhary2812@gmail.com · xorvion.ai@gmail.com
- LinkedIn: https://www.linkedin.com/in/sumitkr28
- GitHub: https://github.com/Sumitkr28
