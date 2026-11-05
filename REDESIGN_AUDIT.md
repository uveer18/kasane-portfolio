# KASANE redesign audit

## Scope and source of truth

`CONTENT_AUDIT.md` is the pre-change inventory of existing sections, project records and links, education, skills, photographs, API integrations, social destinations, metadata, and features. Existing descriptions and destinations have been retained in the redesigned route structure. This audit records the migration and remaining checks.

## Route and content mapping

| Route | Content and functionality |
|---|---|
| `/` | Existing identity copy, rotating focus line, résumé link, status/view counter; concise launchpad linking to Work, Photography, Games, About, Contact. |
| `/work` | All original project records and filter/expand interaction; existing Activity contribution/LeetCode integrations and Blog entries moved here from the home composition. |
| `/photography` | All six original images with their original title/alt text; intrinsic aspect ratios; keyboard/touch lightbox; one collapsed upload entry. |
| `/games` | Additive journal with explicit `[ADD ...]` fields because no game data existed. |
| `/about` | Existing About paragraphs, skills, and both education records; an additive experience placeholder because no experience record existed. |
| `/contact` | Existing form, mailto flow, and social/contact destinations with a new editorial page introduction. |
| `/colophon` | Additive design journal, colour and type labs, known photo equipment, process notes, reference links. |

Shared navigation and footer retain the resume, social links, contact links, theme toggle, design-notes discovery link, and centered `終` close mark. Existing SEO/social metadata remain in the root layout; individual routes add page metadata.

## API, integrations, and sensitive configuration

- GitHub and LeetCode activity loaders and local cache remain mounted on `/work`.
- Supabase `increment_views` remains on the homepage status bar. View count stays unavailable when the API has no value; it is not replaced with zero.
- Photo administration is server-only. The browser submits the access key to `/api/photography/admin`; only the HttpOnly session cookie is returned. `PHOTOGRAPHY_UPLOAD_KEY` is read by server code and is not placed in client code.
- Login and photo upload endpoints have process-local IP rate limits. The upload endpoint verifies MIME declarations against file magic bytes, checks declared image dimensions and maximum size, and stores the metadata sidecar with the image.
- Local development can write photo files into `public/images/gallery` and `data/photography`. Production requires server-side `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and a public Storage bucket (defaults to `photography`). `.env.example` contains names and sample values only; `.env.local` is ignored.

## Assets and photographs

All six original photographs are still addressed by the gallery data module. Existing source dimensions are recorded there and are used by Next/Image to preserve intrinsic ratios. Uploaded photographs keep dimensions in their metadata. No stock or generated photograph was added. Gallery, hero preview, Colophon, and photo lightbox use `object-contain` or intrinsic dimensions.

## Intentional placeholders

No source content existed for Infeared and Relyed beyond their names; no game library, experience timeline, photo capture metadata, photo workflow, or personal Colophon note was in the repository. Those fields are explicit `[ADD ...]` placeholders in the relevant source modules and are listed in `CONTENT_AUDIT.md`. Do not replace these with invented details.

## Validation limits

Build and TypeScript checks are run after implementation. Route HTTP smoke checks are recorded in `REDESIGN_PROGRESS.md` if performed. The available computer-use surface did not expose an active browser, so no browser screenshots, actual-device blur test, or visual screenshot inspection is claimed. In-memory rate limits are per server process and should be replaced with shared storage if the deployment runs multiple instances.
