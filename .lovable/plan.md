# Add the three real cakes to the hero ribbon + video on Portfolio

## What the uploads contain

- `image.png` — Safari/jungle "Wild One" birthday cake: white buttercream drum, chocolate-crumb top, fondant monstera/palm leaves, giraffe, lion and elephant figurines, gold "Wild" topper, "Happy Birthday" plaque. Captured as a screenshot: it has a website header strip, a "WENDY'S BAKEHOUSE" caption and body text below, plus a carousel arrow on the right edge. Needs cropping to the cake only before use.
- `image-2.png` — Black textured square Baileys bottle cake: matte black buttercream, silver piped "Happy Birthday" script, silver foil wrap accents, silver horizontal line detailing, on a silver board. Has a WB logo watermark top-right; crop to the cake, keep the clean white studio background.
- `image-3.png` — Red heart-shaped ruffle cake in a white box: deep red buttercream rosette border and ruffled sides, silver dragee sprinkles on top. Lowest resolution of the three (small, slightly soft); use it as-is at the ribbon's crop size, which it can carry.
- `vid.mp4` — 27.8s vertical 720x1280 clip with audio, for the Portfolio page.

## Hero ribbon changes

Keep `HeroCarousel.tsx`'s existing infinite Framer Motion loop, sizing, caption styling and duplicated-ribbon technique exactly as-is — only the slide list changes. Add the three real cakes so the ribbon runs seven slides, interleaved so no two similar finishes sit next to each other:

1. Multi-Tiered Wedding Cakes (existing)
2. The Wild One Safari Cake — "Hand-sculpted jungle figurines, fondant foliage"
3. Bespoke Celebration Cakes (existing)
4. The Baileys Black Edition — "Matte black texture, silver script and foil"
5. Themed Cupcakes (existing)
6. Ruby Heart Ruffle — "Piped rosette border, silver dragee finish"
7. Iced Custom Sugar Cookies (existing)

Each new slide gets a real title/caption in the same voice as the current copy, `alt` text describing the cake, and the same lazy-loading rule.

## Portfolio page changes

Replace the placeholder body of `src/routes/portfolio.tsx` with a cinematic film section that fits the cream/champagne/charcoal system, while leaving the route's existing `head()` metadata intact:

- Eyebrow + heading retained, then a framed vertical player (`max-w-sm`, 9:16) centred on cream, with a thin border and the champagne accent used sparingly.
- Video renders `playsInline`, `loop`, `muted` and `autoPlay` so it behaves like motion editorial rather than a media player, with `controls` available on interaction and a caption line beneath ("From the studio — Etobicoke, Toronto").
- The note that the interactive gallery and flavour grid arrive in a later step stays, moved below the film.

## Technical notes

- All four uploads go to the Lovable CDN via `lovable-assets create` and are referenced through `.asset.json` pointers — no binaries added to the repo.
- `image.png` and `image-2.png` are cropped with `ffmpeg` in `/tmp` first (remove header/caption chrome and watermark), then uploaded; the originals in `user-uploads://` are untouched.
- Crops are re-encoded to JPEG at the ribbon's aspect (roughly 4:5) to match the existing generated slides; the video ships as-is (6.4 MB, h264/aac) with `preload="metadata"`.
- No changes to the Atelier step machine, header, footer, or design tokens.
