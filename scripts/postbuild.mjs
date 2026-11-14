// Runs after `vite build`.
//
// GitHub Pages only serves files that exist. Without these copies, /about and
// /artworks fall through to 404.html and answer with HTTP 404, which keeps
// them out of Google. Each route gets its own HTML file with its own title,
// description and canonical URL; 404.html keeps the SPA fallback working.
import { readFileSync, writeFileSync } from "node:fs";

const SITE = "https://borabesiktepe.com";
const base = readFileSync("dist/index.html", "utf8");

const ROUTES = [
  {
    path: "artworks",
    title: "Artworks | Bora Beşiktepe",
    description: "Digital portraits and illustrations by Bora Beşiktepe, a self-taught illustrator from İstanbul.",
  },
  {
    path: "about",
    title: "About | Bora Beşiktepe",
    description: "About Bora Beşiktepe: self-taught digital illustrator and engineer from İstanbul, Türkiye.",
  },
];

const swap = (html, { path, title, description }) =>
  html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${SITE}/${path}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${SITE}/${path}`);

// about.html rather than about/index.html: GitHub Pages serves /about
// straight from about.html, while a folder makes it redirect to /about/
// and the canonical URL would point at a redirect.
for (const route of ROUTES) {
  writeFileSync(`dist/${route.path}.html`, swap(base, route));
}

// The 404 page must not claim to be the home page.
writeFileSync(
  "dist/404.html",
  base.replace(/\s*<link rel="canonical" href="[^"]*">/, "\n  <meta name=\"robots\" content=\"noindex\">"),
);

// Sitemap with every artwork listed as an image of the artworks page, so
// they can show up in Google Images under the name.
const artworks = JSON.parse(
  readFileSync("src/components/artworks-page/artworks.json", "utf8"),
);
const today = new Date().toISOString().slice(0, 10);
const images = artworks
  .map(
    (a) => `
    <image:image><image:loc>${SITE}${encodeURI(a.imageUrl)}</image:loc></image:image>`,
  )
  .join("");
const url = (path, extra = "") => `
  <url>
    <loc>${SITE}/${path}</loc>
    <lastmod>${today}</lastmod>${extra}
  </url>`;

writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${url("")}${url("artworks", images)}${url("about")}
</urlset>
`,
);
