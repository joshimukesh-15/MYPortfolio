# Mukesh Joshi — React Portfolio

This is a React + Vite conversion of the existing HTML/CSS/JavaScript portfolio. It retains the original design, GSAP/ScrollTrigger reveal animations, smooth anchor scrolling, scroll progress, mobile navigation, and interactive project figures.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Notes

- The existing design and CSS are intentionally preserved rather than redesigned during migration.
- GSAP and ScrollTrigger are installed through npm rather than loaded from external CDN script tags.
- Keep your resume PDF in the `public/` folder using the existing filename `Mukesh_Joshi_Resume_1.pdf` so the download link works.
- Test the project on mobile and desktop before deploying. Animation timing can vary slightly when changing from script-tag globals to npm modules.
