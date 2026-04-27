# NutriLens

**Point. Eat. Improve.**

An AI-first food coach for the **AMD Slingshot Hackathon** — Food & Health challenge.

Snap a photo of any meal and **Gemini 2.5 Pro** identifies every item, estimates portions, calculates macros, and tells you exactly how it fits your goals. A second Gemini agent acts as your 24/7 personal coach.

[![CI](https://github.com/YOUR_GITHUB_USERNAME/nutrilens/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/nutrilens/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Problem Statement

> "Design a smart solution that helps individuals make better food choices and build healthier eating habits by leveraging available data, user behavior, or contextual inputs."  
> — AMD Slingshot Hackathon, Food & Health Track

---

## Our Solution

NutriLens uses multimodal AI to remove every barrier between eating and understanding your food. Photo, voice, barcode, or text — any input works. Gemini Vision identifies South-Asian dishes by their correct names (roti, dal tadka, idli) and returns calibrated portion estimates. A streaming AI coach with full meal context keeps you on track all day.

**Differentiators:**
- Indian-cuisine-aware Gemini prompts (most apps fail on biryani vs. pulao)
- Multimodal: camera + voice + barcode + manual in one app
- WCAG 2.1 AA accessible — voice-first navigation for motor-impaired users
- Offline queue syncs meals when back online
- 8+ Google Cloud services integrated

---

## Features

### MVP
- [x] Google Sign-In (Firebase Auth)
- [x] Onboarding wizard → auto-calculated calorie/macro targets
- [x] **Photo logging** — Gemini 2.5 Pro Vision
- [x] **Voice logging** — Google Speech-to-Text + Gemini
- [x] Manual search with autocomplete
- [x] Daily food diary with MacroRing
- [x] **AI Coach chat** — streaming Gemini 2.5 Flash
- [x] Weekly insights charts
- [x] PWA installable, offline-capable
- [x] Full keyboard navigation + screen reader support

### Stretch
- [ ] Barcode scan (Open Food Facts)
- [ ] Smart swap suggestions
- [ ] Recipe generator for nutrient gaps
- [ ] Daily push reminders (FCM)
- [ ] Weekly PDF report (Cloud Run)

---

## Demo

> **Live:** [https://nutrilens-web-XXXX.run.app](https://nutrilens-web-XXXX.run.app)  
> **Repo:** [https://github.com/YOUR_GITHUB_USERNAME/nutrilens](https://github.com/YOUR_GITHUB_USERNAME/nutrilens)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| State | Zustand + TanStack Query |
| Forms | react-hook-form + zod |
| Auth | Firebase Auth (Google sign-in) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| AI — Vision | Gemini 2.5 Pro (`@google/genai`) |
| AI — Chat | Gemini 2.5 Flash (streaming) |
| Voice | Google Cloud Speech-to-Text |
| OCR fallback | Cloud Vision API |
| Hosting | Cloud Run (container) |
| Scheduled jobs | Cloud Functions + Cloud Scheduler |
| CI/CD | GitHub Actions |
| Testing | Vitest + Playwright + axe-core |

---

## Google Cloud Services Used

- **Firebase Auth** — Google sign-in for secure, passwordless authentication
- **Cloud Firestore** — Real-time NoSQL database for meal logs and user profiles
- **Firebase Storage** — Stores compressed meal photos per user
- **Vertex AI / Gemini 2.5 Pro** — Vision model that identifies food items from photos
- **Gemini 2.5 Flash** — Streaming AI coach with full meal context
- **Google Cloud Speech-to-Text** — Transcribes voice meal descriptions (en-IN, hi-IN)
- **Cloud Vision API** — OCR fallback for barcode and label detection
- **Cloud Run** — Hosts the containerized Next.js app; also runs the PDF report service
- **Cloud Functions** — Daily meal aggregation triggered by Cloud Scheduler
- **Cloud Scheduler** — Fires daily 9pm nudge and aggregation jobs

---

## Architecture

```
CLIENT (Next.js PWA)
  Firebase Auth → Firestore SDK → Service Worker (offline)
        │ HTTPS
        ▼
NEXT.JS API ROUTES (Node.js runtime)
  /api/analyze-meal  → Gemini 2.5 Pro Vision
  /api/voice-log     → Speech-to-Text → Gemini
  /api/coach (SSE)   → Gemini 2.5 Flash streaming
        │
        ▼
GOOGLE CLOUD
  Vertex AI / Gemini   Firestore   Firebase Storage
  Speech-to-Text       Cloud Run   Cloud Scheduler
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Firebase project (hack2skill-494608)
- Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Run the setup bat (Windows)
```
setup.bat
```

### Manual steps

```bash
# 1. Install deps
cd apps/web && pnpm install

# 2. Copy and fill .env.local
cp .env.example .env.local
# Fill in NEXT_PUBLIC_FIREBASE_*, FIREBASE_ADMIN_CREDENTIALS_BASE64, GEMINI_API_KEY

# 3. Start dev server
pnpm dev
```

Or just double-click **`run-local.bat`**.

---

## Deployment

### One-click deploy (Cloud Run)
```
deploy.bat
```

### Manual
```bash
cd apps/web
gcloud run deploy nutrilens-web \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --project hack2skill-494608
```

### Auto-deploy on git push
Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy-cloudrun.yml`) which builds the Docker image and deploys to Cloud Run automatically.

**Required GitHub secrets:**
```
GCP_WORKLOAD_IDENTITY_PROVIDER
GCP_SERVICE_ACCOUNT
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_ADMIN_CREDENTIALS_BASE64
GEMINI_API_KEY
```

---

## Testing

```bash
cd apps/web
pnpm test          # Vitest unit tests
pnpm test:e2e      # Playwright E2E + axe a11y
pnpm typecheck     # TypeScript strict check
pnpm lint          # ESLint
```

---

## Accessibility

WCAG 2.1 AA compliant:
- All interactive elements keyboard-navigable with visible focus rings
- `aria-live` regions on toast + streaming coach responses
- Skip-to-content link on every page
- `prefers-reduced-motion` respected
- axe-core runs in CI on every route

---

## License

MIT — see [LICENSE](LICENSE)
