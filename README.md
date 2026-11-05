# Udayveer Singh — KASANE portfolio

Next.js portfolio redesign using the KASANE visual system. Existing project descriptions, photo assets, education, skills, contact links, activity fetches, theme preference, Supabase view counter, and résumé are retained. See [CONTENT_AUDIT.md](./CONTENT_AUDIT.md) for the migration checklist and [REDESIGN.md](./REDESIGN.md) for the design brief.

## Photography uploads

The photography page includes a key-protected upload form at its bottom. The local `.env.local` uses the access key supplied for this project. In local development, uploads can be saved in the project gallery folder. For a deployment, set these server-side variables in the hosting environment:

- `PHOTOGRAPHY_UPLOAD_KEY` — the private upload key.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only Supabase service role key. Never use a `NEXT_PUBLIC_` prefix for this value.
- `PHOTOGRAPHY_STORAGE_BUCKET` — optional; defaults to `photography`.

Create a public Supabase Storage bucket named `photography` (or the configured bucket name). The API stores uploaded images and JSON sidecar metadata there; the service role key stays on the server. `NEXT_PUBLIC_SUPABASE_URL` is already used by the existing Supabase integration. `.env.example` lists the required variable names without credentials.

## Local development

Install dependencies with `pnpm install`, then run `pnpm dev`.

## Routes

- `/` — editorial homepage
- `/work` — engineering projects
- `/photography` — image journal and photo upload access
- `/games` — editable gaming journal placeholders
- `/about` — existing education, skills, and about content
- `/contact` — contact methods and existing mailto form
- `/colophon` — interactive colour and typography notes
