# Advanced Portfolio v2 (`advanced-portfolio-nextjs-v2`)

Personal engineering portfolio for **Sowmik Shovon Karmakar** — Cloud, DevSecOps & QA Automation Engineer (MSc @ LUT University). Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **Resend**.

Live demo: [sowmik-portfolio-nextjs.vercel.app](https://sowmik-portfolio-nextjs.vercel.app)

---

## Key Features & UI/UX Pro Max Refinements

- **Accessibility & Reduced Motion**:
  - Keyboard skip link (`Skip to main content`) at the top of `<body>` in `app/layout.tsx`.
  - Accessible `focus-visible:ring` focus indicators across navigation links, CTAs, filter controls, project action buttons, theme toggle, and form fields (zero raw `outline-none` without focus rings).
  - Semantic filter controls using `role="group"` and `aria-pressed` (instead of `tablist`/`tab` roles) with `min-h-10` touch targets and `cursor-pointer`.
  - Explicit `<label htmlFor="senderEmail">` / `<label htmlFor="message">` associations, `autoComplete="email"`, and automatic form reset on successful submission in `components/contact.tsx`.
  - Global `<MotionConfig reducedMotion="user">`, `useReducedMotion()` guards in `components/project.tsx`, and `@media (prefers-reduced-motion: no-preference | reduce)` rules in `app/globals.css`.
- **Dark Mode & Zero-FOUC Theme Persistence**:
  - Synchronous inline `<head>` script reads `localStorage` and `prefers-color-scheme` before first paint to prevent dark-mode flash of unstyled content (FOUC).
  - Native dark-mode surface tokens on form inputs (`dark:bg-white/5`, `dark:text-white`, `dark:border-white/15`) and high-contrast primary CTAs (`dark:bg-white dark:text-gray-950`).
- **Typography, Layout & Responsive Polish**:
  - Loads `Inter` (`--font-sans`) and `JetBrains_Mono` (`--font-mono`) via `next/font/google`, applying `font-mono` to technical skill chips, category badges, and domain pillars.
  - 1:1 circular hero portrait, mobile-safe header width (`w-[min(22rem,92vw)]`), and `overflow-x-hidden` background container to prevent horizontal scroll on narrow screens.
  - Project cards include mobile-visible preview thumbnails (`sm:hidden`), responsive `<Image sizes="..." />`, and dedicated **GitHub** and **Live Demo** action links.
- **Career Storytelling & Asset Hygiene**:
  - Reverse-chronological **Experience & Education** timeline (`MSc` at LUT University first, omitting high school SSC/HSC entries) and curated project metadata (`githubUrl`, `liveUrl`) in `lib/data.ts`.
  - Unused legacy images and duplicate resume PDFs removed from `public/`.

---

## Web CV (`/cv`) & Download Endpoint (`/api/cv`)

- **`/cv` (`app/cv/page.tsx`)**: Dedicated, print-ready A4 web CV powered by `cvProfile` in `lib/cv-data.ts`. Supports one-click **Print / Save as PDF** with dedicated `@media print` styles in `app/globals.css`.
- **`/api/cv` (`app/api/cv/route.ts`)**: Dynamic `307` redirect route (`force-dynamic`, `Cache-Control: no-store, max-age=0`) that resolves `NEXT_PUBLIC_CV_URL` (or `cvConfig.externalUrl` in `lib/data.ts`) via `resolveDirectCvUrl`—converting Google Drive `/file/d/<id>` or Dropbox `?dl=0` links into direct download URLs, and safely falling back to `/SowmikShovonKarmakarCV.pdf` in `public/`.

---

## TDD Test Suite (`npm test`)

Automated tests run via Node's built-in test runner (`node --test tests/*.test.mjs`):

```bash
npm test
```

- **`tests/data-and-cv.test.mjs`**: Transpiles and unit-tests `lib/utils.ts` (`validateString`, `validateEmail`, `getErrorMessage`), `lib/cv-data.ts` (`resolveDirectCvUrl`, `cvProfile.education`), and `lib/data.ts` (`educationData` reverse-chronological ordering and omission of SSC/HSC, `projectsData` `githubUrl`/`liveUrl` and `public/` asset existence, and `skillsData` vs. `skillCategories` completeness without duplicates).
- **`tests/ui-ux-pro-max.test.mjs`**: Verifies UI/UX Pro Max Priorities 1–9 across source files (focus rings, `aria-pressed`, skip link, reduced-motion checks, touch targets, legacy asset cleanup, `<Image sizes>`, FOUC script, typography, dark-mode contrast, form labels/reset, `Skills` scroll threshold, and strict CI configuration).

---

## Local Development Setup

### Prerequisites

- **Node.js** `>=20.0.0` (see `package.json` `engines`)
- **npm**

### Installation & Running Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root (`.env*` files are gitignored):

   ```env
   # Required for the contact form Server Action (actions/sendEmail.ts)
   RESEND_API_KEY=re_your_api_key

   # Optional: Override the CV download URL used by /api/cv
   # Supports Google Drive, Dropbox, direct HTTPS PDF URLs, or a local /path.pdf
   NEXT_PUBLIC_CV_URL=https://drive.google.com/file/d/10Eeuk0-Sefn8RYVn4oB3ggZg-BI24QRs/view?usp=drive_link
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the main portfolio and [http://localhost:3000/cv](http://localhost:3000/cv) for the web CV.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm test` | Runs the unit & UI/UX Pro Max test suite (`node --test tests/*.test.mjs`) |
| `npm run lint` | Runs ESLint across the repository (`eslint .`) |
| `npm run build` | Builds the optimized production bundle (`next build`) |
| `npm start` | Serves the production build (`next start`) |

---

## CI/CD Pipeline

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes and pull requests to `main` and `master` (plus manual `workflow_dispatch`):

1. Checks out the repository and sets up Node.js 20.
2. Installs dependencies (`npm ci || npm install`).
3. Runs `npm test`.
4. Runs `npm run lint` (strict — lint errors fail the pipeline).
5. Runs `npm run build`.

---

## Deploy on Vercel

1. Push `advanced-portfolio-nextjs-v2` to GitHub and import the repository in the [Vercel Dashboard](https://vercel.com/new).
2. Keep the default **Next.js** framework preset (`npm run build` / `.next`).
3. Add environment variables under **Project Settings -> Environment Variables**:
   - `RESEND_API_KEY` *(required for contact form email delivery)*
   - `NEXT_PUBLIC_CV_URL` *(optional custom CV redirect target for `/api/cv`)*
4. Deploy. Production security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) are configured in `next.config.js`.
