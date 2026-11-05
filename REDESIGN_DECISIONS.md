# KASANE redesign decisions

## Design direction

KASANE uses Japanese-inspired editorial composition with a practical engineering interface. Its recognizable anchor is the warm paper-to-ink theme pair, the very large serif hero statement, a layered colour-field illustration, and an intrinsic-ratio photography sequence.

**DFII (design feasibility and impact):** impact 5 + context fit 5 + feasibility 4 + performance safety 4 − consistency risk 3 = **15** (strong direction; maintain tokens and page-family rules to control consistency risk).

## References consulted

- [Nuevo.Tokyo Photography](https://www.nuevo.tokyo/photo): image-led sequence, varied proportions, low-caption density, generous rhythm.
- [Anup Tiwari](https://www.anuptiwari.me/): direct introduction, restrained navigation, clear project entry.
- [Xevrion](https://xevrion.dev/): specific personal identity and compact technical credibility.
- [Mohith](https://www.mohith.xyz/#top): engineering hierarchy and case-study direction. Text extraction was unavailable during research; retained as a user-supplied reference without attributing detailed observations.
- [Rishi Ahuja](https://rishia.in/): distinct information groups and chronological structure.

No implementation is copied wholesale. The photo flow is based on the broad image-first/editorial principle; its layout and interactions are bespoke to this repository.

## Type, spacing, and motion

- Newsreader carries editorial titles and photo captions.
- Geist carries body copy, navigation, engineering, and controls.
- IBM Plex Mono carries small labels and metadata.
- Noto Serif JP carries Japanese glyphs and the `終` signature.
- Spacing follows page-gutter and content-width CSS variables; headings use `clamp()` and sections have deliberate paper, ink, blue, green, and warm fields.
- Motion uses existing Framer Motion plus restrained entrance, shared filter/navigation indicators, hover lift, gallery transitions, and a single uploader disclosure. Global reduced-motion handling remains enabled.

## Palette and contrast

Original KASANE palette values remain in CSS custom properties. Light and dark themes have distinct semantic mappings and contrast-adjusted text accents. WCAG contrast ratios below use the implemented semantic text tokens on each theme's main page background (normal text target: 4.5:1).

| Semantic text token | Shironeri page `#EAE5D9` | Sumi page `#171B1C` | Use |
|---|---:|---:|---|
| Main ink `#171B1C` / `#EAE5D9` | 13.81:1 | 13.81:1 | Body and headings |
| Muted `#4C5754` / `#B5B6AA` | 5.97:1 | 8.46:1 | Secondary copy |
| Seiji `#405F5A` / `#A1BBB4` | 5.56:1 | 8.50:1 | Identity/wayfinding |
| Bengara `#803A31` / `#E39A8A` | 6.51:1 | 7.65:1 | Editorial emphasis |
| Kohaku `#72582D` / `#DCC58F` | 5.31:1 | 10.27:1 | Small highlights |
| Ruri `#344C64` / `#9BB5D1` | 7.07:1 | 8.20:1 | Engineering emphasis |
| Matcha `#536342` / `#B3C69F` | 5.17:1 | 9.50:1 | Natural/supporting accent |

The original raw accent values are not always suitable as small text. The Colophon lab reports the original palette's calculated ratios on Shironeri and Sumi and distinguishes that calculation from the culture-inspired colour naming. Light theme uses paper, ink, and colored section fields; dark mode maps every semantic foreground, surface, border, focus, and glass token separately.

## Progressive blur

Reusable masked layers (`edge-fade`, `progressive-blur`, `image-caption`, `surface-glass`, `nav-glass`, `project-filter-glass`, `section-transition`, `footer-transition`) provide varied spatial blur. The interface includes fallbacks when backdrop filters are unsupported. Text is never itself filtered. Actual browser and device rendering still needs manual review.

## Photography and games

Photographs use measured source dimensions and preserve the original ratio. The Gallery is not forced into a uniform aspect grid. The lightbox keeps controls keyboard-accessible, restores focus, supports arrows/Escape, image zoom, and touch swipes. Unknown capture details stay as placeholders.

The Games page avoids fabricated game artwork and play records. Its journal fields are ready to be replaced by real titles, platforms, notes, and completion details.
