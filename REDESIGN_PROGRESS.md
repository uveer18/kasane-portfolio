# KASANE redesign progress

## Implemented

- Shironeri is the first-visit theme; an explicitly selected dark theme is persisted and applied before hydration.
- KASANE palette variables and separate light/dark semantic token maps; layered blur utilities and fallback styles.
- Concise homepage hero/launchpad with résumé, Work, real photo preview, current focus, Games placeholders, About, and Contact destinations.
- Work page retains every original project, current/Soon filters, existing activity APIs, and Blog entries.
- About page retains existing education, skills, and About copy, plus a clearly marked experience placeholder.
- Dedicated Games, Contact, Photography, and Colophon pages.
- Intrinsic-ratio photo grid, accessible lightbox controls, keyboard focus return/trap, swipe, zoom, image counter, mobile metadata sheet.
- One collapsed Add Photos entry near the end of Photography; server-only key session, progress/status UI, signature and size validation, basic rate limits, and Supabase production storage path.
- Design references, palette, type specimens, photo equipment, design-process notes, and implementation decisions documented in the Colophon.
- Preservation and design decision records added.

## Validation recorded

- `npm run test:helpers`: passed (3 cases for PNG signature, AVIF compatible brands, and image dimension limits).
- `npx tsc --noEmit`: passed after the production build generated route types.
- `npm run build`: passed; Next.js compiled and prerendered all public pages and reported the three photo API routes.
- Production route smoke check: `/`, `/work`, `/photography`, `/games`, `/about`, `/contact`, and `/colophon` each returned HTTP 200.
- `npm run lint`: unavailable as a non-interactive check. The repository has no ESLint configuration; `next lint` opened its interactive setup prompt.
- Browser screenshots and actual mobile blur checks require a browser surface; none was available during the code pass.

## Known deployment requirements and limitations

- Persistent production photo uploads require `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PHOTOGRAPHY_UPLOAD_KEY`, and a public Storage bucket.
- The process-local rate limit is suitable only as a basic single-process safeguard; use shared storage for multi-instance production.
- Image dimensions are read in the browser and validated server-side as bounded integers, but are not decoded from the image stream on the server.
- The README documents the server variables and local upload behaviour. `.env.local` is ignored by Git; never commit the upload key.
