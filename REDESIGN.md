# KASANE (重ね) — COMPLETE REDESIGN SPECIFICATION

## 0. PROJECT MISSION

Redesign my existing personal website:

https://udayveersingh.vercel.app & the currently built site in environment

This is a visual and structural redesign of an existing React portfolio, not a greenfield replacement.

The design identity is **KASANE (重ね)** — a Japanese-inspired visual system built around layering, colour, depth, photography, and considered composition.

**Core philosophy: Building systems. Seeing things differently.**

The website represents three dimensions of my identity:

1. **Engineering** — AI systems, backend engineering, infrastructure, and software development.
2. **Photography** — nature, astrophotography, composition, colour, and visual exploration.
3. **Games** — personal gaming interests, favourites, and gaming experiences.

These must coexist under one visual identity without looking like three unrelated websites. The goal is a distinctive personal website, not another generic developer portfolio.

### Non-negotiable priorities

1. Preserve all existing content and functionality.
2. Implement the complete KASANE design system.
3. Make Shironeri light mode the default and Sumi dark mode the alternative.
4. Build a concise Bento-style homepage.
5. Make every page genuinely mobile-optimized.
6. Preserve existing animations, especially navbar and project-filter highlight bars.
7. Preserve all photography without cropping.
8. Implement progressive blur as a visible, deliberate design feature. It is currently missing and must not be treated as complete.
9. Use the full palette confidently. The current implementation's colours are too lackluster; merely assigning the palette to a few subtle accents is not sufficient.
10. Validate the complete redesign against the original website.

A Git checkpoint has already been created. Do not ask me to create another one. Do not reset, force-push, or discard existing work.

If a visual decision conflicts with content preservation, accessibility, responsiveness, or performance, preserve those requirements.

---

# 1. DESIGN IDENTITY

KASANE draws inspiration from contemporary Japanese editorial design, Japanese traditional colour families, contemporary/semi-Western editorial art direction, minimalist composition, natural materials and textures, layered translucent surfaces, contemporary photography portfolios, and modern typography.

The aesthetic should feel:
- Clean but not bland.
- Modern but not excessively futuristic.
- Visually expressive without being cluttered.
- Personal rather than template-generated.
- Technically credible.
- Photography-oriented without compromising engineering presentation.

Avoid stereotypical Japanese decorations, random kanji, cherry blossom graphics, and unnecessary cultural motifs. Japanese influence should primarily come through composition, colour, typography, materiality, and visual restraint.

## 1.1 Themes and complete mode-specific palettes

**DEFAULT: LIGHT — SHIRONERI**

**ALTERNATE: DARK — SUMI**

First-time visitors must see Shironeri light mode. Do not default to the operating system's dark preference if that would make the first visit dark.

Visitors can explicitly switch to Sumi. Persist an explicitly selected theme across routes and future visits. Avoid flashing the wrong theme before the page loads.

Art-direct the two themes independently; do not simply invert every colour. Build and document two complete, coordinated palette sets: one for Shironeri and one for Sumi. Each set must define page backgrounds, alternate section backgrounds, primary/secondary/raised surfaces, text levels, borders, accents, interactive states, glass layers, shadows, overlays, and focus states.

- **Shironeri:** warm editorial paper, not generic white. Use dark, warm, high-contrast text; coloured surfaces should feel intentional and tactile.
- **Sumi:** deep ink, not generic pure-black UI. Re-map every text and UI token for dark surfaces. Do not leave dark text, dark icons, dark borders, dark input text, or low-contrast disabled states from the light theme. Lighten or otherwise re-art-direct headings, body copy, metadata, icons, controls, borders, placeholders, form fields, selected states, focus rings, and hover states for legibility.

Theme switching must change the entire interface coherently: fonts/text colours, icons, SVGs, borders, dividers, controls, form fields, menus, cards, charts, image captions, overlays, shadows, and progressive-glass treatments. Audit every component for hard-coded colours that fail to switch. Use semantic tokens rather than conditional one-off styling wherever possible.

Do not blindly make every dark-mode element white. Preserve hierarchy with multiple text/surface levels and use the KASANE accents in theme-appropriate values. Check actual contrast in both modes, including hover, focus, selected, disabled, placeholder, and error/success states.

---

# 2. COLOUR SYSTEM — MAKE IT VISIBLY EXPRESSIVE

Use the complete KASANE palette.

| Name | Hex | Intended role |
|---|---|---|
| Sumi | #171B1C | Dark foundation |
| Tetsu | #252D2C | Dark elevated surfaces |
| Shironeri | #EAE5D9 | Light foundation |
| Seiji | #617C79 | Primary identity accent |
| Bengara | #A94F43 | Warm emphasis |
| Kohaku | #B49A69 | Highlights |
| Ruri | #344C64 | Secondary blue |
| Matcha | #879477 | Botanical green |
| Usuzumi | #C6B8A3 | Warm muted neutral |

## 2.1 Important visual correction

The current implementation's colours are **too lackluster**. Correct this decisively.

Do not interpret "restrained" as "barely use colour." I want the palette to be visibly present and to shape the composition.

Use stronger, more confident colour blocking and contrast:
- Large and medium colour fields where composition supports them.
- Distinctive coloured section backgrounds and alternating surface families.
- Accent rails, borders, labels, selected states, buttons, metadata, and image-adjacent surfaces.
- Purposeful combinations of Seiji, Bengara, Kohaku, Ruri, Matcha, and the neutral foundations.
- More visible contrast between adjacent sections and content groups.
- Colour should be a structural part of the design, not a few decorative details.

Do not produce either a random colour mash-up or a nearly monochromatic website. Build a coherent, recognisable colour rhythm across the site. Do not force arbitrary percentage distributions.

### Practical colour hints — guidance, not rigid assignments

Treat these as useful starting associations, not fixed laws. Adapt them to existing content, imagery, layout, and component behaviour when a different treatment creates a stronger, more coherent result.

| Element / purpose | Useful starting colour direction | Notes |
|---|---|---|
| Editorial page headings | Bengara, Sumi, or a strong theme-aware foreground | Bengara can make a heading distinctive, but do not force it on every H1. Keep long headings readable. |
| Main body copy | Sumi in light mode; warm light neutral in dark mode | Prioritise legibility over accent colour. |
| Eyebrows / section identifiers | Seiji, Ruri, or IBM Plex Mono in a suitable contrast token | Use colour to establish page family and hierarchy. |
| Primary action | Seiji or Ruri surface with a contrasting label | Keep one clear primary action per composition where possible. |
| Secondary action | Outline or transparent surface with a strong border/text token | Must remain distinguishable in both themes. |
| Warm emphasis / important highlight | Bengara | Useful for selected headings, callouts, active markers, or meaningful moments. Not every heading needs it. |
| Highlights / small metadata accents | Kohaku | Useful for dates, small markers, and selected details; check contrast before using it for text. |
| Cool technical emphasis | Ruri | Useful for engineering sections, technical labels, diagrams, and selected project states. |
| Identity / calm accent | Seiji | A recurring anchor across the site, including navigation and selected controls. |
| Botanical / secondary accent | Matcha | Use for supporting categories, secondary states, and natural/photographic context. |
| Muted neutral / divider | Usuzumi in light mode; a theme-adjusted neutral in dark mode | Do not use the same raw hex for every border in both themes. |
| Cards and panels | Rotate through theme surface families; add coloured rails, headers, or edge accents | Avoid a page full of identical neutral cards. |
| Navigation active state | Seiji, Ruri, or Bengara according to page family | Preserve the existing animated indicator. |
| Forms and inputs | Theme-specific raised surface, readable text, visible border and focus ring | Placeholder text must not be mistaken for entered text. |
| Status colours | Semantic success/warning/error/info tokens derived from KASANE where contrast allows | Never communicate status by colour alone. |

A heading may be Bengara on one page, Seiji on another, and the normal foreground on a third. Make the choice based on hierarchy, content, contrast, and visual rhythm. Do not turn these hints into mechanical rules.

### Suggested palette sets by colour mode

These are starting token mappings, not a mandate to use every listed value unchanged. Tune derived tints, shades, alpha values, and contrast-safe variants while keeping the named KASANE palette recognisable.

**Shironeri / Light set**
- Foundation: Shironeri `#EAE5D9`.
- Alternate paper/surface: a lightened or warmed Shironeri variant.
- Raised surface: a distinct warm neutral surface, not pure white by default.
- Main text: Sumi `#171B1C`.
- Secondary text: Tetsu `#252D2C` or a tested muted dark-neutral derivative.
- Identity accent: Seiji `#617C79`.
- Warm editorial emphasis: Bengara `#A94F43`.
- Highlight / metadata accent: Kohaku `#B49A69`, with a contrast-safe darker variant for small text.
- Technical / cool accent: Ruri `#344C64`.
- Botanical / secondary accent: Matcha `#879477`, with a contrast-safe variant where needed.
- Muted neutral: Usuzumi `#C6B8A3`.
- Borders: warm neutral derivatives with enough definition to separate surfaces.
- Glass: warm translucent paper with layered edge gradients and subtle warm shadows.

**Sumi / Dark set**
- Foundation: Sumi `#171B1C`.
- Alternate foundation / raised section: Tetsu `#252D2C`.
- Main text: Shironeri `#EAE5D9` or a softened warm-light derivative.
- Secondary text: a tested light neutral between Shironeri and Usuzumi.
- Identity accent: a lighter, contrast-safe Seiji tint derived from `#617C79`.
- Warm editorial emphasis: a lighter Bengara tint derived from `#A94F43`; retain original Bengara for large fields or decorative accents where contrast permits.
- Highlight: a lighter Kohaku tint derived from `#B49A69`.
- Technical / cool accent: a lighter Ruri tint derived from `#344C64`.
- Botanical accent: a lighter Matcha tint derived from `#879477`.
- Muted neutral: a lightened Usuzumi-derived neutral.
- Borders: visible Tetsu/Usuzumi-derived edges, not invisible near-black lines.
- Glass: layered translucent Sumi/Tetsu surfaces with controlled light edge highlights and deep shadows.

For dark mode, create actual contrast-safe derived variants rather than merely reusing light-mode accent hex values. Document each derived value and purpose in the token/contrast matrix. Preserve the identity of the original palette while adapting luminance for the background.

### Page-family colour direction

**Home / Global**
- Shironeri or Sumi foundation.
- Seiji as the primary identity accent.
- Confident, intentional Bengara or Kohaku emphasis.
- Controlled colour fields and typography-led compositions.

**Engineering / Work**
- Ruri and Seiji as visible anchors.
- Neutral paper/ink surfaces.
- Kohaku for selected metrics or highlights.
- Bengara for meaningful emphasis.

**Photography**
- Let photographs dominate.
- Shironeri and Usuzumi neutrals.
- Seiji and Kohaku editorial accents.
- Occasional Bengara.
- Avoid saturated overlays on the photographs themselves.

**Games**
- Stronger use of Ruri, Bengara, and Kohaku.
- Cinematic but controlled.
- Maintain readable text and consistent global controls.

**Colophon**
- Display the complete palette through substantial swatches and large colour fields.
- Interactive swatches and contrast demonstrations.
- Live colour experiments.

### Colour implementation rules

1. Every palette colour must have a meaningful, visible use.
2. Build a documented colour-pairing matrix.
3. Define recommended foreground/background combinations for both themes.
4. Calculate contrast ratios.
5. Aim for WCAG AA: 4.5:1 for normal text and 3:1 for large text and relevant UI graphics.
6. Do not assume every accent is suitable for small text.
7. Use colour fields, split backgrounds, accent rails, borders, selected states, labels, and image-adjacent surfaces where appropriate.
8. Alternate neutral sections with expressive colour moments.
9. Avoid rainbow gradients, random multicolour blobs, and decorative colour confetti.
10. Do not force arbitrary percentage distributions.

Treat Japanese cultural inspiration and modern digital colour calculations separately. Do not claim automatically calculated colour relationships are historical Japanese colour theory.

### Theme tokens

Implement reusable semantic CSS variables for:
- Page background.
- Primary, secondary, and raised surfaces.
- Primary and secondary text.
- Muted text.
- Borders.
- Primary, secondary, warm, and cool accents.
- Highlights.
- Glass background, borders, and shadows.
- Focus, hover, selected, disabled, and status colours.

Map them separately under light and dark themes. Components should use semantic tokens rather than scattered hard-coded colours.

---

# 3. TYPOGRAPHY

Use four typefaces deliberately.

- **Newsreader:** editorial headings, photography titles, large homepage statements, creative section introductions.
- **Geist:** navigation, body text, engineering, buttons, and UI components.
- **IBM Plex Mono:** camera settings, dates, technical metadata, project identifiers, coordinates, and eyebrow labels.
- **Noto Serif JP:** Japanese typography and closing signature 終.

Photography should lean towards Newsreader. Engineering should lean towards Geist. Metadata should use IBM Plex Mono. Do not use every typeface everywhere.

## 3.1 Typography scale

Use these as initial design tokens. Adjust only where actual composition requires it.

### Desktop

| Element | Font | Size | Weight |
|---|---|---:|---:|
| Home hero | Newsreader | 64–80px | 500–600 |
| Page H1 | Newsreader | 52–64px | 500–600 |
| Section H2 | Newsreader/Geist | 32–40px | 500–600 |
| Project title | Geist | 20–24px | 550–650 |
| Photography title | Newsreader | 24–36px | 400–500 |
| Page subtitle | Geist | 17–19px | 400–450 |
| Body | Geist | 15–17px | 400 |
| Navigation | Geist | 13–15px | 500–600 |
| Eyebrow | IBM Plex Mono | 10–12px | 500 |
| Metadata | IBM Plex Mono | 11–13px | 400–500 |
| Button | Geist | 13–15px | 550–600 |
| Footer | Geist | 12–14px | 400–500 |
| 終 | Noto Serif JP | 36–48px | 400 |

### Mobile

| Element | Font | Size | Weight |
|---|---|---:|---:|
| Home hero | Newsreader | 40–52px | 500–600 |
| Page H1 | Newsreader | 36–44px | 500–600 |
| Section H2 | Newsreader/Geist | 25–30px | 500–600 |
| Project title | Geist | 18–21px | 550–650 |
| Photography title | Newsreader | 21–28px | 400–500 |
| Page subtitle | Geist | 15–17px | 400–450 |
| Body | Geist | 14–16px | 400 |
| Navigation | Geist | 13–14px | 500–600 |
| Eyebrow | IBM Plex Mono | 9–11px | 500 |
| Metadata | IBM Plex Mono | 10–12px | 400–500 |
| Button | Geist | 13–15px | 550–600 |
| Footer | Geist | 11–13px | 400–500 |
| 終 | Noto Serif JP | 34–40px | 400 |

Use responsive CSS variables and `clamp()` where appropriate. Define line-height and text-width rules alongside font sizes. Do not make every heading enormous.

---

# 4. PAGE HEADINGS AND SUBHEADINGS

Every major page should have a consistent introduction structure:
1. Optional eyebrow/section identifier.
2. Main heading.
3. Short subheading.
4. Optional compact metadata or action.

Suggested direction:

| Page | Heading | Subheading direction |
|---|---|---|
| Home | Building systems. Seeing things differently. | Brief introduction to who I am and what I explore. |
| Work | Engineering, made tangible. | Systems, software, infrastructure, and selected work. |
| Photography | A way of paying attention. | Photography and visual exploration. |
| Games | Worlds worth staying in. | A personal gaming journal. |
| About | A little beyond the work. | My background, interests, and perspective. |
| Experience | Where the work has taken me. | A concise introduction to the timeline. |
| Contact | Have something in mind? | A short invitation to get in touch. |
| Colophon | A study in colour, light and structure. | The decisions and processes behind KASANE. |

Refine based on actual existing content. Keep heading/subtitle lengths balanced. Avoid generic filler and repeated identical subtitles.

---

# 5. HOMEPAGE — BENTO-LED AND CONCISE

The homepage is a carefully designed Bento launchpad, not a second copy of every dedicated page.

### First viewport and content partition

Treat the first viewport as a deliberate composition, not a container that clips content.

- The primary identity/hero content should be visible in the initial viewport at common desktop and mobile sizes, adapting sensibly to browser chrome and actual device height.
- The initial viewport should contain the essential first impression: name/identity, main statement, concise introduction, and the most important actions, including the existing Resume/CV destination and a route into the work.
- After this main introduction, create a clear visual partition—whitespace, a colour-field transition, divider, or controlled section boundary—then continue the remaining Bento previews and homepage sections below.
- Do not force every Bento tile into the first viewport.
- Do not set fixed heights that cut off text or content. Do not use line clamping, ellipsis, hidden overflow, or clipped containers to make the design fit.
- The hero may use `min-height` or viewport-aware sizing, but its height must grow naturally when text wraps or the viewport is short.
- On mobile, recompose and reorder the hero rather than shrinking desktop content until it fits. Let supporting content continue below the fold.
- The first viewport should feel complete, not cramped. The lower page should feel like a deliberate continuation, not leftover content.

Use the viewport as a composition guide, never as a clipping boundary.


Its purpose is to introduce me, establish the visual identity, show small previews of the main areas, and direct visitors to dedicated pages.

Suggested content roles:
- **Identity / Hero:** name, “Building systems. Seeing things differently.”, one concise introduction, accurate NIT Jalandhar / IT metadata, Work and Photography links, and a visible **Resume / Download CV** action. Use the existing resume file and exact destination. The resume must be visible on Home, preferably in the hero or first Bento group; never only in the footer.
- **Photography:** one or a few strong real photographs, short introduction, direct link.
- **Selected Engineering:** one or two projects maximum, very short descriptions, direct link.
- **Currently:** verified current focus/activity only; no fabricated live statistics.
- **Games:** one current or favourite game only if actual data supports it; direct link.
- **About:** one short personal detail and direct link.
- **Contact:** direct contact action.

These are content roles, not a requirement for seven equally sized cards. Combine or omit tiles if they create repetition.

**Creative freedom:** Do not reproduce a rigid wireframe or force every existing element into these examples. You may reinterpret, combine, split, resize, reposition, or visually transform existing sections and components when doing so improves the KASANE composition. Preserve their underlying information, functionality, and destination. The specification defines the identity, constraints, and outcomes—not a pixel-by-pixel template. Prefer a strong design decision that fits the real content over mechanically following a suggested component arrangement.

### Bento rules
- One or two dominant tiles, several supporting tiles.
- Intentional asymmetry, negative space, varied spans, clear reading order.
- Real photographs, typography-led tiles, purposeful colour fields.
- Restrained glass surfaces.
- No excessive borders around every tile.
- Do not fill every grid cell.
- Every tile must have a clear purpose.

Keep the headline prominent but supporting copy to one or two short sentences. Each tile should have a short title, at most one brief supporting line, and a clear destination/action where appropriate. Use composition, typography, colour, and photography for impact rather than paragraphs. Home must not become a résumé.

---

# 6. PRESERVE EXISTING NAVBAR AND PROJECT-FILTER ANIMATIONS

This is strict.

The existing navbar has an animated highlight bar. Project filters also have an animated highlight/active indicator.

**Do not remove, flatten, or replace these animations with static underlines or instant colour changes.**

Inspect the actual implementation first. Preserve motion and behaviour while redesigning colours, thickness, radius, blur, easing, timing, surrounding navigation, filter surfaces, typography, and spacing.

Navbar indicator:
- Correct active route.
- Work on direct page loads and browser back/forward.
- Transition smoothly between destinations.

Project filter indicator:
- Move between selected filters.
- Stay synchronised with filtered results.
- Work on desktop and mobile.

Prefer transform/opacity animation. Use semantic controls and accessible selected states. Respect `prefers-reduced-motion` while retaining a clear active state. Verify both animations in both themes and on mobile.

If an animation cannot technically be preserved, explain why and ask before removing it.

---

# 7. PROGRESSIVE BLUR AND GLASSMORPHISM — REQUIRED, CURRENTLY MISSING

Progressive blur is one of KASANE's defining visual signatures.

**It has not been implemented adequately in the current website. Treat it as unfinished work. Do not claim that it is complete merely because a basic translucent background or ordinary `backdrop-filter: blur()` exists.**

Implement a genuinely visible, layered progressive-blur system. The blur should transition spatially and/or through multiple layers rather than appearing as one uniform blur applied to an entire component.

Create reusable treatments such as:
- `edge-fade`
- `surface-glass`
- `image-caption`
- `floating-control`
- `section-transition`

### Required placements
1. Floating/sticky navigation.
2. Navigation ambient edge transition.
3. Hero image edges.
4. Photography tile boundaries, where composition supports it.
5. Image captions.
6. Photography metadata panels.
7. Fullscreen lightbox backdrop.
8. Photography filters.
9. Project filter bar.
10. Project image caption overlays.
11. Selected Bento tile transitions.
12. Section boundaries.
13. Floating theme switch.
14. Back-to-top and utility controls.
15. Games artwork captions.
16. Colophon specimens.
17. Footer transitions.

Do not add blur everywhere. Do not blur text or obscure photographs. Use different strengths and directions depending on composition.

### Theme treatment
- **Shironeri:** light translucent surfaces, warm borders, subtle shadows.
- **Sumi:** deep translucent ink surfaces, controlled highlights, darker glass layers.

Use layered `backdrop-filter`, multiple blur strengths, CSS masks, linear/radial gradients, and SVG filters only where justified. Provide solid fallbacks. Check stacking contexts, contrast, pointer events, GPU cost, and mobile performance.

Glassmorphism should enhance the design, not become the design.

### Acceptance test for progressive blur
A reviewer must be able to identify the progressive effect visually on the live site. Verify it in screenshots and on real browser rendering. A uniform blur alone does not satisfy this requirement. If a browser does not support a particular technique, use a graceful fallback without making the effect disappear on all supported browsers.

---

# 8. WORK / ENGINEERING

Route: `/work`

Engineering must remain professional, structured, and technically credible, distinct from Photography.

Use Geist typography, structured layouts, technical hierarchy, architecture diagrams, application screenshots, benchmark visualizations, code examples, technical metadata, project case studies, and repository/demo links.

Potential projects to consider, only where they are actual existing content:
- Infeared.
- Winder.
- Relyed.
- RogNidhi.
- SAAB Doors.

These examples are not permission to remove or replace existing projects. Every original project must remain represented.

Project presentations should communicate name, problem, description, technical approach, technologies, actual contributions, measured outcomes where available, and GitHub/demo links. Do not fabricate metrics.

Avoid nature-photography backgrounds, decorative collages, excessive serif typography, overly artistic project layouts, and excessive glass surfaces. Subtle glass navigation, filters, and controls are acceptable.

Redesign existing project cards and filter controls. Preserve all project content, links, filter functionality, filter animation, active state, and responsive behaviour. Do not merely recolour the existing cards. Clearly distinguish title, description, metadata, technologies, and actions.

---

# 9. PHOTOGRAPHY — HIGHEST CREATIVE PRIORITY

Route: `/photography`

Primary reference: https://www.nuevo.tokyo/photo

Study image-first composition, asymmetry, image density, varied aspect ratios, minimal captions, editorial layout, whitespace, visual rhythm, image transitions, and viewing experience.

The page should feel like an independent photographic journal. Use asymmetric layouts, varied natural image proportions, large photographs, minimal captions, intentional whitespace, progressive image-edge blur where appropriate, smooth transitions, and Newsreader typography. Do not use conventional project-card styling.

## 9.1 Absolute rule: do not crop photographs

This is non-negotiable.

Photography cards and homepage Photography Bento tiles must adapt to actual image dimensions.

- Never use `object-fit: cover` for actual photographs.
- Use `object-fit: contain` or intrinsic image sizing.
- Preserve original aspect ratios.
- Portrait remains portrait; landscape remains landscape; square remains square.
- The tile adapts to the image, not the image to the tile.
- Use aspect-ratio-aware CSS Grid, intrinsic sizing, or justified/masonry layout.
- Tall photographs get taller tiles; wide photographs get wider tiles.
- The surrounding layout reflows accordingly.
- Thumbnails preserve the complete original frame.
- No generated cropped thumbnails, distorted images, or unwanted lightbox cropping.
- Letterboxing or a suitable background is acceptable.
- Blur may soften boundaries but must never obscure the photograph.

If a layout cannot accommodate an image without cropping, change the layout.

## 9.2 Photography data structure

Support image path, thumbnail path, title, description, collection, capture date, camera, lens, focal length, aperture, shutter speed, ISO, location, and aspect ratio.

Do not fabricate missing metadata.

Potential collections, only where actual photographs support them: Nature, Astrophotography, Places, Details, Experiments.

Use actual existing photographs only. Never use stock or generated imagery to replace existing photographs. Optimize previews using AVIF/WebP where appropriate. Lazy-load offscreen images. Preserve original files and metadata.

## 9.3 Custom lightbox

Create a custom full-screen lightbox:
- Full viewport and complete image visible.
- Correct image fitting; no unnecessary cropping.
- Smooth gallery-to-lightbox transition.
- Darkened progressive-blur backdrop.
- Floating glass metadata panel.
- Previous/next navigation and image counter.
- Keyboard navigation and Escape-to-close.
- Touch/swipe support and zoom capability.
- Mobile bottom-sheet metadata.
- Accessible controls, focus management, focus restoration, and safe-area handling.

Metadata stays secondary to the photograph.

## 9.4 Photography upload access

There must be exactly **one discreet “Add Photos” / login entry near the bottom of the Photography page**. Do not place multiple login controls around the site.

The flow:
1. Visitor reaches the bottom of `/photography`.
2. They see one understated Add Photos entry styled in KASANE.
3. Selecting it reveals a compact login/key prompt.
4. The configured key unlocks the upload interface.
5. Authenticated user can select and upload photographs.
6. Show validation, upload progress, success, and error states.
7. New photographs must enter the gallery data flow and preserve their natural aspect ratios. Do not crop them.

The user-selected access key is `Uday@3241`.

**Security requirements:**
- Configure the key as a server-only environment variable in ignored `.env.local` for local development.
- Never hardcode the key in client-side JavaScript, public source, HTML, or committed files.
- Never expose it through a `NEXT_PUBLIC_` or other public environment variable.
- For production, configure the equivalent server-side secret in the hosting provider.
- Validate authentication and uploads server-side.
- Apply reasonable rate limiting and file type/size validation.
- Store uploaded files in persistent production storage. Do not rely on ephemeral deployment filesystem storage.
- If Supabase is used, service-role credentials must remain server-side and the target bucket must be configured appropriately.
- The shared key is a basic private uploader gate, not strong account authentication. Do not overstate its security.

The current implementation report says a key-protected uploader already exists and the key is configured locally. Audit and verify that implementation; improve it if needed. Do not create a duplicate uploader.

---

# 10. GAMES

Route: `/games`

Create a personal gaming journal, not a competitive gaming dashboard.

Possible sections:
- **Currently Playing:** artwork, title, platform, actual status, short personal note.
- **All-time Favourites:** image-led collection.
- **Recently Played:** artwork, title, platform, completion status where known, optional rating only if supplied.
- **Game Notes:** short impressions, favourite mechanics, memorable moments, personal observations.

Use cinematic artwork, restrained glass overlays, and clean typography. Create a data-driven game library.

Do not invent playtime, completion status, ratings, or current activity. Keep the homepage Games preview compact.

---

# 11. ABOUT, EXPERIENCE AND CONTACT

Preserve every existing meaningful piece of information.

About may include education, engineering interests, personal philosophy, photography, guitar, and other genuine interests. Do not duplicate the résumé.

Experience must preserve all existing entries, achievements, roles, dates, and contributions.

Contact must preserve email, GitHub, LinkedIn, resume, existing contact methods, forms, and integrations. Do not remove working functionality.

Where content is missing or the user has not yet supplied updated wording, use clearly identifiable editable placeholders, for example:
- `[ADD PERSONAL INTRODUCTION]`
- `[ADD PROJECT DESCRIPTION]`
- `[ADD EXPERIENCE DETAILS]`
- `[ADD PHOTOGRAPHY STORY]`
- `[ADD GAME IMPRESSIONS]`

Placeholders must be easy to find and replace, ideally in centralized content/data files. Keep the final layout and typography designed around realistic content lengths. Do not invent personal claims or fill gaps with generic filler. Do not leave ambiguous placeholder text scattered through unrelated components.

Create or update `CONTENT_AUDIT.md` to list every placeholder, its file/location, and the information the user needs to provide.

---

# 12. COLOPHON — INTERACTIVE DESIGN JOURNAL

Route: `/colophon`

Do not include Colophon in primary navigation. Make it discoverable through the footer link:

`DESIGN NOTES / COLOPHON ↗`

Opening heading: **A study in colour, light and structure.**

It should feel like an interactive editorial design journal, not technical documentation or another About page.

Visual direction: editorial typography, asymmetric composition, large colour fields, minimal text, photography-led layouts, progressive blur, subtle glass, generous whitespace, interactive specimens, and minimal conventional card UI.

## 12.1 Design philosophy

Introduce KASANE and explain layering, visual depth, colour relationships, Japanese-inspired design, and photography and engineering as distinct disciplines. Keep writing personal and specific.

## 12.2 Interactive colour laboratory

Use actual production palette. For every colour display name, Japanese name where appropriate, HEX, RGB, HSL, intended role, inspiration, relationships, and contrast information.

Provide clickable swatches, live preview, editorial/interface/photography modes, copy HEX, copy CSS variable, foreground/background contrast calculations, and complementary/analogous suggestions.

Allow experimentation without modifying the persistent website theme. Use actual design tokens and fonts.

## 12.3 Typography laboratory

Show actual specimens of Newsreader, Geist, IBM Plex Mono, and Noto Serif JP. Allow font switching using identical sample text. Include family, weight, character samples, uppercase/lowercase, numerals, Japanese glyph samples, and typical usage. Do not use approximations.

## 12.4 Photography process

Document actual equipment:
- Sony A7 II.
- Sony FE 28–70mm.
- Tamron 70–300mm.

Include actual workflow details where known: composition, framing, exposure, colour grading, post-processing, and astrophotography stacking. Use genuine photographs and metadata. Before/after comparisons only where both versions exist.

## 12.5 Design process

Present an editorial timeline:
1. Observation — collecting references.
2. Colour — building the palette.
3. Typography — selecting typefaces.
4. Composition — establishing layouts.
5. Layering — progressive blur and glass.
6. Implementation — React and CSS.
7. Iteration — refining the result.

## 12.6 Reference wall

Include:
- Nuevo.Tokyo — https://www.nuevo.tokyo/photo
- Anup Tiwari — https://www.anuptiwari.me/
- Xevrion — https://xevrion.dev/
- Mohith — https://www.mohith.xyz/#top
- Rishi Ahuja — https://rishia.in/

Briefly explain what each reference contributed. Do not copy their websites wholesale.

---

# 13. NAVIGATION AND ROUTES

Primary navigation:

**HOME / WORK / PHOTOGRAPHY / GAMES / ABOUT**

Contact remains accessible through a CTA and footer. Colophon is not in primary navigation.

Potential routes:
- `/`
- `/work`
- `/work/[project]`
- `/photography`
- `/photography/[collection]`
- `/games`
- `/about`
- `/contact`
- `/colophon`

Adapt to existing routing architecture. Preserve existing routes, redirects, query behaviour, and destinations. Do not break old links.

Use floating/translucent desktop navigation and compact, accessible mobile navigation. Preserve the existing navbar highlight-bar animation.

---

# 14. JAPANESE CLOSING SIGNATURE

Every page must end with **終**, centered immediately above the footer.

- Noto Serif JP.
- 36–48px desktop.
- 34–40px mobile.
- Muted Seiji or Shironeri, with adequate contrast.
- Generous vertical spacing.
- Subtle opacity/blur reveal.
- Consistent placement.

No random Japanese characters elsewhere as decoration.

---

# 15. ANIMATION

Use Motion or the existing animation solution for page transitions, scroll reveals, navigation interactions, photography transitions, lightbox, project interactions, progressive UI transitions, and Colophon previews.

Preserve existing navbar and project-filter highlight animations.

Avoid excessive parallax, scroll hijacking, unnecessary animated backgrounds, and animation on every element. Respect `prefers-reduced-motion`. Keep interactions responsive and do not delay content visibility.

---

# 16. RESPONSIVE AND MOBILE REQUIREMENTS

Mobile optimization is a release requirement. Do not design desktop first and shrink it afterwards.

Test:
- 320px.
- 360–375px.
- 390–430px.
- 768px.
- 1024px.
- 1280px.
- 1440px and above.

Mobile rules:
- Compact navigation.
- Explicit Bento reordering and spans.
- No horizontal overflow.
- Readable text and comfortable spacing.
- Touch targets around 44×44px where practical.
- No hover-only interactions.
- Responsive typography.
- Natural image proportions.
- Mobile lightbox bottom sheet.
- Safe-area support.
- No fixed elements covering content.
- Touch-friendly Colophon controls.
- Reduce blur if needed for performance, but do not omit progressive blur entirely.

Check landscape orientation and browser zoom where practical. At every viewport, check clipping, overlap, horizontal scrolling, inaccessible controls, broken layouts, and both themes.

**No-truncation rule:** Never truncate meaningful headings, body copy, project descriptions, labels, metadata needed to understand an item, form labels, or buttons to satisfy a fixed viewport/card height. Do not hide overflow to conceal layout problems. Allow text to wrap, components to grow, grids to reflow, and lower-priority content to move below the fold. If space is tight, simplify the composition or move content down; do not cut content off. Only truncate genuinely optional decorative/preview text when the full content remains clearly accessible through an obvious, accessible interaction.

A website that technically fits on a phone is not necessarily mobile-optimized.

---

# 17. TECHNICAL IMPLEMENTATION

Preserve the existing framework and architecture wherever practical.

Potential technologies, subject to the existing project:
- React.
- Existing routing solution.
- Tailwind/CSS variables.
- Motion.
- Lucide.
- CSS Grid.
- Custom React lightbox.
- AVIF/WebP derivatives.

Do not add dependencies unnecessarily. Create reusable components and centralized design tokens.

Potential organisation (adapt to the actual repository; do not impose blindly):

```text
src/
  components/
    navigation/
    layout/
    projects/
    photography/
      PhotoGrid
      PhotoItem
      PhotoLightbox
      PhotoMetadata
    games/
    colophon/
      ColorLab
      ColorSwatch
      TypographySpecimen
      DesignTimeline
    timeline/
    ui/
  sections/
    Hero
    SelectedWork
    PhotographyPreview
    Currently
    GamesPreview
    AboutPreview
    ExperiencePreview
    Contact
  pages/
  data/
    projects
    photography
    games
    experience
  styles/
    tokens
    typography
    globals
```

Performance and accessibility:
- Optimize images.
- Lazy-load offscreen photography.
- Avoid original-resolution gallery thumbnails.
- Preserve image aspect ratios.
- Prevent layout shifts.
- Use semantic HTML.
- Support keyboard navigation.
- Provide visible focus indicators.
- Maintain sufficient contrast.
- Keep animations performant.
- Respect reduced motion.
- Preserve SEO and social metadata.
- Test blur on mobile browsers.
- Provide fallbacks for unsupported effects.

---

# 18. CRITICAL CONTENT-PRESERVATION GUARDRAIL

The existing website is the source of truth. This is a visual and structural redesign, NOT a content rewrite or deletion.

Never delete or silently replace:
- Existing sections.
- Projects and descriptions.
- Achievements.
- Experience entries.
- Education.
- Photographs and image metadata.
- External links and GitHub links.
- Contact details.
- Resume files.
- APIs and integrations.
- Dynamic data fetching.
- Interactive functionality.
- SEO metadata and social metadata.
- Existing routes.

Existing content can be reorganised and restyled, but its underlying information must remain accessible.

Do not introduce fake statistics, placeholder project claims, fake game information, stock photography, generated replacement photographs, fabricated camera settings, or fake API activity.

If uncertain whether something should be removed, preserve it.

Maintain `REDESIGN_AUDIT.md` as the preservation checklist. Inventory every route, page/section, project, description, achievement, experience/education entry, photography asset/metadata, navigation/redirect, external link, API/integration, dynamic data source, interactive feature, SEO/social metadata, animation, resume destination, and existing responsive behaviour.

Before completion, compare the redesigned website against this inventory. If migration risks losing content or functionality, stop and report the issue.

---

# 19. CURRENT IMPLEMENTATION STATUS — BASELINE, NOT ACCEPTANCE

The previous implementation report stated that:
- The KASANE redesign was applied across Home and `/work`, `/photography`, `/games`, `/about`, `/contact`, and `/colophon`.
- The homepage has an editorial hero, asymmetric Work layout, Photography preview, current-focus area, Games preview, and existing About/activity/blog/contact content.
- Existing projects, gallery images, résumé, links, theme control, activity APIs, and Supabase visit counter were retained.
- Missing game, experience, project, and photo details were marked with editable placeholders.
- Photography has an asymmetric gallery and keyboard/touch lightbox with zoom and metadata.
- A key-protected photo uploader exists near the bottom of Photography.
- The uploader key was configured in ignored `.env.local`; local uploads persist to the project. Production uploads require a server-only Supabase service key and public storage bucket.
- Colophon includes palette/type specimens, photo-process placeholders, design timeline, and references.
- Production build and TypeScript passed; all seven main routes returned HTTP 200.
- Photo-gate checks accepted the configured key, restored a session, rejected an invalid key, and blocked unauthenticated uploads.
- No browser screenshots were captured because no browser surface was available.
- `npm run lint` opens an ESLint setup prompt because ESLint is not installed/configured.

Treat these as reported claims that must be verified against the current repository and actual browser behaviour. Do not assume the implementation is complete.

**Known visual defects requiring correction:**
1. The current colours are lackluster and insufficiently expressive. Re-art-direct colour use across the whole website using the full KASANE palette. The correction must be visibly apparent in actual rendered pages, not just in token definitions.
2. Progressive blur has not been implemented. Implement the complete reusable progressive-blur system and visibly apply it to the required placements. Do not mark this requirement complete until verified in screenshots/browser rendering.

The implementation agent previously received the instruction “follow redesign.md”, but the result did not fully implement the specification. This is an iterative correction and completion pass, not a greenfield redesign. Audit the existing result against every requirement in this document, identify the gaps, and correct them without destroying working functionality.

---

# 20. SINGLE DEVELOPMENT PHASE — COMPLETE, AUDITED REDESIGN

There is exactly **one development phase**. Do not split implementation into Phase 0, Phase 1, Phase 2, etc. Do not stop after an audit-only stage or ask for approval between sub-phases. Complete the work end-to-end in one coordinated development pass, while using the ordered workstreams below internally to avoid omissions.

The workstreams are tasks within this one phase, **not separate phases or approval gates**.

The design system is a strong direction, not a cage. Use judgement and creative freedom to adapt existing elements to the new identity. You may depart from illustrative examples, suggested page compositions, component groupings, and colour-role hints when the real content or current implementation calls for a better solution. Do not depart from the non-negotiable constraints: preserve content/functionality, maintain accessibility and responsiveness, keep both theme systems coherent, preserve required animations, never crop photography, implement genuine progressive blur, and keep the homepage concise and professional.

## Single phase: audit, correct, implement, and validate

### A. Establish and inspect the baseline
1. Read this entire `redesign.md` before touching the code.
2. Inspect repository structure, package scripts, framework, routing, styling, assets, Git status, and deployment constraints.
3. Confirm the existing checkpoint. Do not create another one unless genuinely necessary and do not reset/discard work.
4. Run the existing application and baseline build/type checks where possible.
5. Inspect the actual live website if reachable and the local application.
6. Capture screenshots of all routes and relevant states, including both themes and key mobile widths. If browser automation is available, use it. If not, state the limitation honestly and use the strongest available visual verification; do not claim screenshots or browser checks that were not performed.
7. Specifically inspect the navbar highlight animation, project-filter highlight animation, resume destination, photography image fitting, cards, typography, progressive blur, and mobile behaviour.

### B. Complete the preservation and design audit
1. Inventory every route, page, section, project, description, achievement, experience/education entry, image, metadata field, link, API, integration, dynamic data source, interactive feature, SEO/social field, animation, and resume destination.
2. Compare the existing implementation against this entire specification.
3. Record findings in `REDESIGN_AUDIT.md`, including what already works, what is incomplete, what is broken, and the exact files/areas requiring changes.
4. Inspect the five references:
   - https://www.nuevo.tokyo/photo
   - https://www.anuptiwari.me/
   - https://xevrion.dev/
   - https://www.mohith.xyz/#top
   - https://rishia.in/
5. Use references for concrete observations about composition, typography, image presentation, hierarchy, navigation, spacing, and interactions. Do not copy them.
6. Record concise implementation decisions in `REDESIGN_DECISIONS.md`.

### C. Correct the visual identity
1. Make Shironeri the first-visit default and Sumi the alternative.
2. Ensure theme persistence and no initial theme flash.
3. Rework colour art direction across all routes. The current colours are too lackluster: increase the visible presence and confidence of the palette through deliberate colour fields, section families, accents, and contrasts.
4. Ensure all nine palette colours have meaningful visible roles.
5. Implement semantic tokens and a documented colour-pairing/contrast matrix for both themes.
6. Verify typography and responsive type scales.
7. Redesign cards, tiles, filters, buttons, chips, metadata, timelines, project panels, forms, and loading/empty/error states where necessary. Do not merely recolour existing components.
8. Preserve the navbar and project-filter highlight-bar animations and verify their route/filter synchronisation.

### D. Implement progressive blur — do not defer
1. Build reusable progressive-blur utilities/components, including `edge-fade`, `surface-glass`, `image-caption`, `floating-control`, and `section-transition` treatments as appropriate.
2. Implement spatially layered blur using multiple blur strengths, gradients, masks, and overlays where appropriate. A single uniform `backdrop-filter` is not sufficient.
3. Apply the effect purposefully to the placements specified in Section 7.
4. Ensure the actual browser rendering visibly demonstrates progressive blur in both themes.
5. Provide mobile/performance fallbacks without silently removing the effect.
6. Check text clarity, image fidelity, stacking contexts, pointer events, contrast, GPU cost, and reduced-motion behaviour.
7. Capture and inspect screenshots demonstrating the implemented effect. If screenshot capture is unavailable, report that honestly and do not claim visual verification.

### E. Finish all pages and functionality
1. **Home:** concise Bento launchpad, real photography, short copy, visible existing Resume/CV action, clear links to dedicated pages, no duplicated long-form content.
2. **Work:** preserve every existing project and its details/links; improve technical hierarchy, cards, case studies, filters, and responsive layout.
3. **Photography:** image-first editorial gallery, natural image proportions, no cropping, custom accessible lightbox, keyboard/touch/zoom, mobile metadata sheet, and working uploader.
4. **Uploader:** exactly one discreet login entry near the bottom of Photography. Audit the existing implementation before changing it. Use the user-selected key `Uday@3241` as a server-only environment secret; never expose it in client code or commit it. Verify server-side authentication, upload validation, rate limiting, progress/error/success states, and persistent production storage configuration. Local uploads may use the existing local workflow; production must not depend on ephemeral filesystem storage. Do not create a duplicate uploader.
5. **Games:** personal gaming journal using verified information only.
6. **About / Experience / Contact:** preserve all original content, dates, links, forms, and integrations. Use clear editable placeholders for missing user-supplied copy; do not invent.
7. **Colophon:** interactive colour lab, real typography specimens, genuine photography process/equipment, design timeline, and reference wall.
8. Ensure every page ends with centered `終` immediately above the footer.
9. Preserve existing routes, redirects, query behaviour, external destinations, APIs, integrations, and SEO/social metadata.

### F. Content placeholders
Use explicit, searchable placeholders only where the user must supply updated content, such as:
- `[ADD PERSONAL INTRODUCTION]`
- `[ADD PROJECT DESCRIPTION]`
- `[ADD EXPERIENCE DETAILS]`
- `[ADD PHOTOGRAPHY STORY]`
- `[ADD GAME IMPRESSIONS]`

Centralize content where practical. Keep the design complete around these placeholders. Do not invent details or use generic filler. Maintain `CONTENT_AUDIT.md` with every placeholder, its location, and the exact information needed from the user.

### G. Mobile, accessibility, and performance
Test 320px, 360–375px, 390–430px, 768px, 1024px, 1280px, and 1440px+.

Verify:
- Both themes at all practical breakpoints.
- No horizontal overflow, clipping, or overlap.
- Explicit mobile Bento order and spans.
- Natural photo proportions.
- Usable touch targets and no hover-only actions.
- Mobile lightbox and safe-area behaviour.
- Keyboard access and visible focus.
- Contrast and semantic markup.
- Reduced-motion behaviour.
- Blur fallbacks and mobile performance.
- Lazy loading, image sizing, and layout-shift prevention.
- Fixed elements do not cover content.

### H. Final validation and reporting
Run all applicable:
- Production build.
- Type checks.
- Lint (if configured; do not install/configure a new lint stack without need).
- Tests.
- Route checks.
- Link checks.
- API/integration checks.
- Responsive checks.
- Accessibility checks.
- Theme checks.
- Browser console checks.
- Performance checks.

Compare the final website against `REDESIGN_AUDIT.md` and this entire specification.

Maintain:
- `REDESIGN_AUDIT.md` — preservation and gap audit.
- `REDESIGN_DECISIONS.md` — important design/technical decisions.
- `REDESIGN_PROGRESS.md` — concise record of completed work, validation, and remaining limitations.
- `CONTENT_AUDIT.md` — editable content placeholders and required user input.

Do not claim a check passed unless it was actually run. Report any unverified behaviour or remaining limitation explicitly.

---

# 21. SUBAGENTS AND PARALLEL WORK

Use subagents proactively if the environment supports them.

Suggested roles:
- **Repository auditor:** inventory routes, assets, APIs, content, interactions, tests, and existing behaviour. No code edits.
- **Reference/design researcher:** inspect the five references and return concrete design observations. No code edits.
- **Responsive/accessibility reviewer:** review mobile layouts, keyboard navigation, contrast, and reduced motion.
- **Photography specialist:** inspect image assets, metadata, dimensions, and lightbox requirements.
- **QA/content-preservation reviewer:** independently compare the final website against the original audit.

The primary agent owns architecture and final decisions. Give every subagent a narrow task and explicit output. Avoid simultaneous edits to the same files. Review findings and verify claims. If subagents are unavailable, perform the work directly.

Subagents are collaborators inside the **single development phase**, not separate phases or approval gates.

---

# 22. ANTI-DRIFT RULES

1. Read this entire `redesign.md` before starting.
2. Re-read it after context compaction or when resuming.
3. Treat it as the authoritative implementation contract.
4. This is one end-to-end development phase. Do not create multiple implementation phases or stop for intermediate approval.
5. Do not replace the existing stack or router without evidence.
6. Do not add dependencies without a demonstrated need.
7. Do not delete assets or code without verifying their usage.
8. Do not rewrite user content without approval.
9. Do not introduce fake content.
10. Do not use stock or generated replacement photography.
11. Do not claim tests passed unless they were actually run.
12. If a requirement conflicts with the architecture, explain the conflict and implement the smallest safe adaptation.
13. If uncertain, preserve rather than remove.
14. Do not declare completion with unresolved regressions.
15. Keep the audit, decisions, progress, and content-placeholder documents current.

---

# 23. FINAL ACCEPTANCE CHECKLIST

## Content preservation
- [ ] Every original project remains.
- [ ] Every meaningful section remains.
- [ ] Experience and education remain intact.
- [ ] Every original photograph remains accessible.
- [ ] Photography metadata is preserved.
- [ ] Existing links work.
- [ ] Resume file and destination remain unchanged.
- [ ] APIs and integrations work.
- [ ] Existing functionality remains.
- [ ] SEO and social metadata remain.

## Design
- [ ] First-visit theme is Shironeri light.
- [ ] Sumi dark mode works.
- [ ] Theme preference persists.
- [ ] No initial theme flash.
- [ ] Complete palette is meaningfully and visibly used.
- [ ] Colours are expressive, not lackluster or nearly monochromatic.
- [ ] Colour combinations are deliberate.
- [ ] Page-family colour patterns are consistent.
- [ ] Contrast is verified.
- [ ] Typography follows the defined scale.
- [ ] Progressive blur is visibly implemented and verified, not merely a uniform blur.
- [ ] Cards and components fit KASANE.

## Homepage
- [ ] Bento-led composition.
- [ ] Resume visible on Home.
- [ ] Concise copy.
- [ ] No repetitive page content.
- [ ] Clear routes to dedicated pages.
- [ ] No unnecessary sections.
- [ ] Photography adapts to natural aspect ratio.

## Interactions
- [ ] Navbar highlight-bar animation preserved.
- [ ] Project-filter highlight-bar animation preserved.
- [ ] Active states work correctly.
- [ ] Keyboard interaction works.
- [ ] Mobile interaction works.
- [ ] Reduced-motion behaviour is accessible.

## Photography
- [ ] No photographs cropped.
- [ ] No distorted images.
- [ ] Natural aspect ratios preserved.
- [ ] Thumbnails retain the complete frame.
- [ ] Lightbox shows complete images.
- [ ] Swipe and keyboard controls work.
- [ ] Mobile metadata sheet works.
- [ ] Exactly one discreet uploader/login entry exists near the bottom.
- [ ] Uploader key is server-side only.
- [ ] Uploads are validated and persist in production storage.

## Mobile
- [ ] 320px tested.
- [ ] 360–375px tested.
- [ ] 390–430px tested.
- [ ] 768px tested.
- [ ] 1024px tested.
- [ ] 1280px tested.
- [ ] 1440px+ tested.
- [ ] No horizontal overflow.
- [ ] No overlapping or clipped elements.
- [ ] No hover-only interactions.
- [ ] Touch targets are usable.
- [ ] Both themes work.

## Engineering quality
- [ ] Production build passes.
- [ ] Lint/type checks pass where configured.
- [ ] Tests pass where configured.
- [ ] Browser console reviewed.
- [ ] Routes and links tested.
- [ ] Integrations verified.
- [ ] Performance reviewed.
- [ ] Accessibility reviewed.
- [ ] Audit, decisions, progress, and content documents updated.

---

# 24. DEFINITION OF DONE

One identity, three different experiences, and one design journal explaining how they come together.

- **Engineering:** professional, structured, technically credible.
- **Photography:** immersive, editorial, expressive, image-first, and never cropped.
- **Games:** personal, cinematic, and collectible.
- **Homepage:** concise, Bento-led, visually impactful, and non-repetitive.
- **Colophon:** interactive Japanese-inspired design journal exploring colour, typography, photography, and process.
- **Global identity:** Shironeri light by default, Sumi dark as the alternative, deliberate and expressive use of the complete KASANE palette, genuinely implemented progressive blur, restrained glassmorphism, consistent typography, and centered 終.

The website must be fully responsive and mobile-optimized. Original content, functionality, assets, routes, and identity must remain intact.

The goal is not another developer portfolio.

**The goal is to create a personal website that feels unmistakably mine.**

---

# FINAL EXECUTION PROMPT — FOLLOW THIS CONTRACT

Read `redesign.md` completely. It is the authoritative implementation contract.

The previous prompt was simply: **“follow redesign.md”**. The result did not fully satisfy the specification. In particular, the current colours are lackluster and progressive blur has not been implemented. Treat those as known, confirmed gaps.

**There is only one development phase: complete the audit, correction, implementation, and validation end-to-end. Remove the old multi-phase workflow. Do not stop after an audit-only pass, do not wait for intermediate approval, and do not split the development into multiple phases.** The ordered workstreams in Section 20 are internal task ordering within this single phase.

Use the current implementation as the baseline, not as proof of completion. Inspect the actual live website and local repository. Capture baseline and final screenshots if browser tooling is available. Specifically document and preserve:
- Navbar highlight animation.
- Project-filter highlight animation.
- Existing resume destination.
- Photography image fitting and original assets.
- Existing cards and content.
- Typography.
- Mobile behaviour.
- Existing APIs, integrations, and dynamic data.

Create and maintain `REDESIGN_AUDIT.md` with a complete inventory of existing content and functionality. Also maintain `REDESIGN_DECISIONS.md`, `REDESIGN_PROGRESS.md`, and `CONTENT_AUDIT.md`.

Implement the full KASANE specification. Make the palette visibly more expressive and confident across all pages; do not settle for subtle accent-only usage. Give practical colour-role hints (for example, Bengara can be used for selected editorial headings, Seiji for identity accents, Ruri for technical emphasis, and Kohaku for highlights), but treat them as suggestions rather than fixed assignments. Define complete, coordinated palette sets for Shironeri and Sumi. Dark mode must switch every text, font, icon, border, form field, control, overlay, and component colour appropriately; audit for leftover dark-on-dark or low-contrast elements.

The homepage must be simple yet bold and professional on desktop and mobile. Make the initial viewport a complete first-impression composition containing the essential identity and primary actions. Follow it with a clear visual partition, then let the remaining Bento previews and content flow below. Never truncate or clip meaningful text to force it into a viewport or fixed-height card.

Use creative freedom to adapt, combine, resize, reposition, and reinterpret existing elements to fit KASANE. The specification defines the visual identity, requirements, and outcomes—not a rigid pixel-perfect template. Preserve the actual content and functionality while making considered design decisions.

Implement the missing progressive-blur system with layered, spatially varying effects and verify it in actual browser rendering. A basic uniform blur is not enough.

Use clear editable placeholders for content/text that I still need to update later. Do not fabricate personal details, project claims, game data, photography metadata, or metrics.

Keep exactly one discreet photo-upload login entry near the bottom of the Photography page. Use `Uday@3241` as the server-side configured secret only. Never expose it in client code or commit it. Audit the existing uploader before modifying it; do not create a duplicate. Ensure server-side validation and persistent production storage.

Preserve the existing architecture and all working functionality. Do not reset, force-push, discard work, or replace the stack without evidence. Do not claim tests or visual checks passed unless they were actually run.

Use subagents for repository auditing, reference research, responsive/accessibility review, photography review, and final content-preservation QA where available. Keep responsibilities separate and the primary agent responsible for integration.

At the end, provide a concise but complete report:
1. What was changed.
2. Which original content and functionality were preserved.
3. How the colour system was strengthened.
4. Where and how progressive blur was implemented.
5. How the Photography uploader is secured and configured.
6. Which placeholders still need my content.
7. Routes, themes, and viewport sizes tested.
8. Build, type, lint, test, accessibility, and integration results.
9. Any remaining limitations or unverified behaviour.

Do not declare the redesign complete until the acceptance checklist in this document has been checked against the actual implementation.
