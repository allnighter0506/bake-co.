# Bake&Co.

A buildless, responsive bakery concept in vanilla HTML, CSS, and JavaScript.

## Preview

From this directory, run:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. No dependency installation or build is required.
The site also works by opening `dist/index.html` directly in a modern browser.

## Design and behavior

- French Vanilla, Pistachio Cream, Deep Olive, Cherry Wine, Honey Butter, and Oat Beige design tokens.
- Locally bundled, generated editorial photography, compressed as WebP. These images are illustrative, not photographs of an actual bakery's products.
- Reusable SVG croissant, strawberry cake, cinnamon bun, wheat, coffee cup, sparkle, and arrow symbols; complementary butter and coffee bean drawings.
- Responsive editorial layout, illustrated product plates, scalloped coffee divider, rotated annotations, a circular butter seal, and fine rules.
- Category filtering, keyboard-accessible native product dialogs, coffee pairing selectors, and mobile navigation.
- A covered pastry plate with a gentle reveal, rotating messages, live announcements, and replay.
- Lightweight scroll reveals, restrained hover effects, decorative drift, and coffee steam that pauses out of view.
- A croissant loading state attached to actual pending image loads. Cached images skip the loader; failures and a 12-second timeout show an illustration fallback. Late successful loads recover normally.
- Reduced motion disables animations and transitions. Content is visible by default if JavaScript or IntersectionObserver is unavailable.

## Content boundaries

This is a presentation concept. Product descriptions and pairing suggestions are illustrative. No prices, stock status, testimonials, real-time production claims, ordering, mailing-list signup, or unverified business details are represented as live services.

## Validation

Chromium checks covered desktop (1440px), tablet (768px), mobile (390px), and narrow mobile (320px), with screenshots and no horizontal overflow or broken images. Interaction checks covered filters, all product dialogs, focus restoration, Escape, mobile menu, coffee options, keyboard treat reveal and replay, reduced motion, delayed and failed images, timeout recovery, and JavaScript-disabled rendering. JavaScript syntax checks passed; no browser JavaScript errors were observed.

## Files

- `dist/index.html`: structure, editorial content, accessible controls, SVG symbol library.
- `dist/style.css`: design tokens, responsive composition, illustration styling, motion.
- `dist/app.js`: progressive enhancement and interactions.
- `dist/assets/`: local photographs and favicon.

Deploy the contents of `dist/` with any static host. There is no backend or data collection.
