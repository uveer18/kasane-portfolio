# Existing content and functionality audit

This inventory records the current application before the KASANE redesign. Keep it as the preservation checklist during refactoring.

## Application structure and routes

- Next.js 15 App Router application. Only `/` is currently implemented; navigation uses same-page anchors.
- Homepage section order: Hero, Activity, About, Projects, Photography, Contact, StatusBar, Footer.
- `Blog` exists as a component with four entries but is not rendered by `app/page.tsx`.
- No project detail, photography collection, games, about, contact, or colophon routes currently exist.
- No experience timeline entries or Games data are present in the source.

## Homepage and identity

- Name: Udayveer Singh.
- Hero role: “Aspiring Agentic AI Systems Engineer”.
- Rotating text: “Building AI That Thinks & Acts”; “IT ’28 @ NIT Jalandhar”; “View Projects ↓”.
- Rotating descriptions: “Agentic AI systems with real-world utility”; “Computer vision meets creative expression”; “From raw data to aesthetic intelligence”; “Tools that critique, enhance, and create images”; “Not just models, complete AI pipelines”.
- Hero supporting text: “AI systems meet visual storytelling.”
- About paragraphs describe IT at NIT Jalandhar (Class of 2028), agentic AI / multimodal LLM workflows, orchestration, retrieval, memory, performance, reliability, scalability, practical utility, and photography's influence on perception and system design.
- Technical skill groups: AI & ML (RAG, Vector Embeddings, LangChain, LangGraph, Ollama, LLMs, scikit-learn, OpenCV); Backend & Persistence (Python, FastAPI, Supabase, ChromaDB, FAISS); Frontend (React, Next.js, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui); Tools & Platforms (Git, Linux, Docker, Codex, Vercel, Render, Kaggle, Raycast); Coursework (DSA, OS, DBMS, CSA, CN).

## Education

- National Institute of Technology, Jalandhar — B.Tech in Information Technology, 2024–Present, Current CGPA: 8.07/10. Description: “Focused on Agentic AI systems and LLMs while maintaining my interests in photography and creative projects.”
- Police DAV Public School, Jalandhar — Grade 12, Science Stream, 2022–2024, Percentage: 93.4%. Description: “School foundation built through mathematics, physics, chemistry, and analytical problem solving.”

## Projects (10 entries, preserve descriptions, technologies, links, images, and availability state)

1. SAAB Doors — high-performance conversion-optimised platform for custom entrance and internal doors; interactive Quote Estimator, dynamic catalog, WhatsApp-first customer acquisition. React 19, Vite, Tailwind v4, Framer Motion, Zustand. `https://saabdoors.vercel.app`; `/images/projects/saabdoors.webp`.
2. Winder — semantic desktop search Raycast extension powered by Gemini embeddings and ChromaDB; text and image query modes; two-phase hybrid search (BM25 + RRF). Node.js, Gemini API, ChromaDB, Raycast, TypeScript. `https://github.com/uveer18/winder`; `/images/projects/winder.webp`.
3. RogNidhi — AI health treasury centralizing medical histories into structured timelines; HackMol 7.0 finalist; multi-stage cRAG pipeline (FAISS + LLMs) for clinical data extraction from scans and prescriptions. React, Django, FAISS, LLMs, cRAG, TypeScript. `https://github.com/royalmaddy07/RogNidhi`; `/images/projects/rognidhi.webp`.
4. Portfolio Site — Next.js 15 / React 19 portfolio, animated typewriter hero, live GitHub and LeetCode heatmaps via API, photography lightbox, Lenis scrolling, dark/light theme, Framer Motion interactions. Next.js 15, React 19, Tailwind v4, Framer Motion, Supabase. `#hero` (legacy anchor); `/images/projects/portfolio.webp`.
5. EXIF EV Predictor — ML exposure prediction analyzing scene lighting and recommending camera settings. Python, OpenCV, Scikit-learn, Pandas, Numpy, PiEXIF. `https://github.com/uveer18/lensiq-1-ev-predictor`; `/images/projects/exif-ev.webp`.
6. ColorFlow — image mood classification analyzing photo palettes and emotional tones with ML. Python, Scikit-learn, Pandas, Numpy, Matplotlib, Google Colab. `https://github.com/uveer18/lensiq-3-colorflow`; `/images/projects/colorflow.webp`.
7. AutoQA — “Automated website testing for AI-generated and E-commerce websites”. TypeSript, Next.js, FastAPI, LangChain. Link/image are `#` (concept phase, no asset).
8. PhotoCompAI — composition analysis AI evaluating framing, rule of thirds, and visual balance. PyTorch, CNN, CLIP, React, Node.js. Link/image are `#` (concept phase, no asset).
9. NoiseSense — AI image denoising preserving detail while removing noise from high ISO and low-light photos. PyTorch, U-Net, Python, CUDA. Link/image are `#` (concept phase, no asset).
10. StyleLens — neural style transfer applying artistic styles while maintaining photorealistic quality. Python, GANs, PyTorch, Docker. Link/image are `#` (concept phase, no asset).

## Photography

- Six existing photographs: `/images/gallery/photo-1.jpg` through `photo-6.jpg`; retain all files and gallery access.
- Existing title / alt pairs:
  - “Solitary Mountain Peak Rising Above Quiet Valley at Golden Hour” / “Snow-capped mountain peak under clear blue sky with rugged surrounding mountains”.
  - “Misty Himalayan Peaks Framed by Dark Pine Trees in Morning Light” / “Snow-covered mountain peak partially hidden by mist and framed by tall pine trees”.
  - “Golden Wild Grass Swaying Gently Against Clear Blue Autumn Sky” / “Tall golden grass plants blowing in wind under bright blue sky”.
  - “Soft Waterfall Cascading Down Mossy Cliff in Mountain Forest” / “Long exposure photograph of waterfall flowing down rocky cliff face”.
  - “Delicate White Daisy Flowers Blooming Among Deep Green Leaves” / “Close-up of white daisy flowers with dark centers surrounded by green foliage”.
  - “Sunlit River Flowing Over Rocky Streambed Through Forest Clearing” / “Small river with rocks reflecting sunlight surrounded by trees”.
- Current description: “A curated collection of nature and macro photography capturing the beauty and intricacy of the natural world.”
- No capture dates, equipment metadata, locations, source thumbnails, or image variants are stored in the current application.
- Current lightbox: opens selected gallery image, Escape close, blocks body scroll, hides status bar; no previous/next, focus management, zoom, touch navigation, or full image metadata.

## Activity, data sources, and integrations

- GitHub contributions loaded from `https://github-contributions-api.jogruber.de/v4/uveer18?y=last`, cached in localStorage for 12 hours; displayed as contribution heatmap with streak/active day/total summaries; links to `https://github.com/uveer18`.
- LeetCode submissions loaded from `https://leetcode-api-faisalshohag.vercel.app/udayveersiingh`, cached in localStorage for 12 hours; heatmap plus total/easy/medium/hard solved counts; links to `https://leetcode.com/u/udayveersiingh/`.
- Supabase client uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; status bar calls `increment_views` RPC with row label `page_views`.
- Status bar shows current India time (IST, UTC+5:30), visit count, and scroll-to-top control.
- Project list has `All`, `Current`, `Soon` filters and a responsive See All / Show Less control.
- ThemeProvider supports dark/light theme, defaults dark, and persists preference in localStorage.
- Hero has cycling headline text and an animated rotating subtitle.
- Contact form builds a mailto message. Existing social destinations: GitHub `https://github.com/uveer18`; LinkedIn `https://linkedin.com/in/udayveersiingh`; email link `mailto:uveer.work@gmail.com`; X `https://twitter.com/CS13231`; photography Instagram `https://instagram.com/soltragrv`. Form recipient is `uday.work@gmail.com`.
- Resume: `/resume.pdf`.

## Blog entries (currently not mounted on homepage)

- “Building Better Exposure Models with Deep Learning” — “Exploring how convolutional neural networks can predict optimal camera settings from scene analysis.” — Coming Soon — Machine Learning.
- “The Art of Macro Photography” — “Tips and techniques for capturing stunning close-up shots of nature's smallest details.” — Coming Soon — Photography.
- “Understanding Neural Style Transfer” — “A deep dive into how AI can apply artistic styles to photographs while maintaining realism.” — Coming Soon — AI & Art.
- “Color Theory for Photographers” — “How understanding color palettes can improve your photography and post-processing workflow.” — Coming Soon — Photography.

## Metadata and assets

- Page title “Udayveer Singh”; description and keywords for machine learning, AI, deep learning, photography, computer vision, and image processing; author metadata; favicon `/favicon.svg`; Open Graph title/description/type `website`; viewport theme color `#0a0a0a`.
- Other public assets: `public/resume.pdf`, `public/favicon.svg`, `public/googleaa2da6082a732640.html`, project previews under `public/images/projects/`.
- Existing interactions use Framer Motion, lucide-react, a custom responsive navigation, a gallery lightbox, animated reveal components, and magnetic buttons. Preserve existing dependencies and existing project/images.

## Redesign reference notes

- Nuevo.Tokyo Photography: image-first sequence, dense but varied image proportions, photography presented without conventional project cards, restrained captions, and gallery as an independent visual experience.
- Anup Tiwari: simple navigation, direct introduction, and project presentation.
- Xevrion: a highly specific personal identity with compact, credibility-focused technical project and work details.
- Mohith: use as a reference for engineering hierarchy and case-study presentation; browser text extraction was unavailable.
- Rishi Ahuja: clearly separated research, experience, academics, and updates; concise chronological information structure.

## Preservation risks to resolve during implementation

- Existing contact link and contact form recipient use different email addresses; preserve both unless explicitly corrected.
- Several concept projects have placeholder `#` links and no image; retain their descriptions and mark their current availability without inventing functionality.
- No experience, game, capture metadata, equipment-specific photo attribution, or currently-playing data are present; do not fabricate any.
- Existing homepage navigation points to anchors; retain them as valid anchors while introducing any additive routes.

## Additive placeholders from the redesign brief

- Infeared and Relyed are named in the brief but have no existing source data. They are represented as editable placeholders in the work list; add their real descriptions, technologies, links and imagery when ready.
- Games, active experience entries, and missing per-photo metadata have editable placeholders because the source repository contains no such records.

## Redesign destination and remaining user updates

- `/work` now contains the original complete project list, its All / Current / Soon filters and Show Less / See All interaction. The homepage project destination points here. Activity and the existing Blog component also live on this route so they remain reachable after making Home concise.
- `/about` contains the original About copy, skill groups and both education entries. The new Experience area is an explicit `[ADD EXPERIENCE DETAILS]` placeholder because the audited source had no experience records.
- `/photography` retains `photo-1.jpg` through `photo-6.jpg`, the existing titles and alt descriptions, and now reads measured image dimensions. Capture date, camera, lens, exposure and location remain `[ADD ...]` placeholders until actual metadata is supplied.
- `/games` is additive. `lib/games.ts` centralizes currently-playing, favourite and recently-played records. Each has an explicit `[ADD ...]` string; artwork, playtime, ratings, dates and completion records are not fabricated.
- `/colophon` is additive. Known equipment (Sony A7 II, Sony FE 28-70mm, Tamron 70-300mm) is recorded. Personal notes, actual post-processing choices, astrophotography stacking, and individual capture data remain explicit placeholders.
- The home page is a short launchpad with the résumé link, links to dedicated pages, an actual gallery image, and game placeholders. The actual dynamic activity API panels and all Blog entries remain on Work.
- New photo records use metadata from the upload form. Optional fields are stored as empty values unless supplied. `width` and `height` are measured from the selected file in the browser and checked for positive bounded values by the API.

## Existing destinations and environment

- Contact social/email destinations, including the existing form's `uday.work@gmail.com` recipient and the separately listed `uveer.work@gmail.com` address, remain unchanged.
- The existing résumé remains at `/resume.pdf` and is linked from Home and the footer.
- Existing project preview images and all six gallery JPEGs remain in `public/images`.
- Photo upload authentication uses the provided key only through the server environment variable `PHOTOGRAPHY_UPLOAD_KEY`. Do not write that secret into the source, documentation, or `.env.example`.
