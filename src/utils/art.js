import manifest from "./art-manifest.json";

// Image attributes for an artwork, keyed by its original path in
// artworks.json. `src` is the full-size file the viewer shows; `srcSet` lets
// the browser pick a smaller copy wherever that is still sharp on the screen.
export function artImage(path) {
  const entry = manifest[path];
  if (!entry) return { src: path };
  const srcSet = [
    ...entry.sizes.map((s) => `${s.src} ${s.width}w`),
    `${entry.full} ${entry.width}w`,
  ].join(", ");
  return { src: entry.full, srcSet, width: entry.width, height: entry.height };
}

// Full-size file for the viewer and the sitemap.
export const fullImage = (path) => manifest[path]?.full ?? path;

// The five pieces on the home page; the loader waits for these.
export const FEATURED = [
  "/art/NOfW88G.png",
  "/art/i4d67of.jpg",
  "/art/bora-besiktepe-adsiz-resim.jpg",
  "/art/EV7wJGa.png",
  "/art/S6Gf6so.png",
];

// A home panel is a fifth of the width and the full height, and the image
// covers it, so at 4:5 it is drawn about 0.8 × the panel height wide.
export const HOME_SIZES = "max(20vw, calc((100vh - 56px) * 0.8))";
