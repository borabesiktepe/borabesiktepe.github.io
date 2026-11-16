// Builds the web copies of the artworks: `npm run images`.
//
// The files in public/art are the originals and are never changed. For each
// one this writes, into public/art/web:
//   <name>-480/-960/-1440.webp         smaller copies for the grid and home
//                                      (only widths below the original)
//   <name>.webp                        full size, lossless (PNG originals only)
// and records every image's size in src/utils/art-manifest.json.
//
// The viewer always shows the full size: a lossless WebP is pixel for pixel
// the same as its PNG, and JPG originals are served as they are, because
// re-encoding a JPG only loses detail. Run it again after adding artwork;
// files that already exist are kept.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { extname, basename } from "node:path";
import sharp from "sharp";

const SRC = "public/art";
const OUT = "public/art/web";
const WIDTHS = [480, 960, 1440];
const QUALITY = 88;

mkdirSync(OUT, { recursive: true });

const manifest = {};
const files = readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();

for (const file of files) {
  const name = basename(file, extname(file));
  const input = `${SRC}/${file}`;
  const { width, height } = await sharp(input).metadata();
  const isPng = extname(file).toLowerCase() === ".png";

  let full = `/art/${file}`;
  if (isPng) {
    full = `/art/web/${name}.webp`;
    const out = `${OUT}/${name}.webp`;
    if (!existsSync(out)) {
      await sharp(input).webp({ lossless: true, effort: 6 }).toFile(out);
    }
  }

  const sizes = [];
  for (const w of WIDTHS.filter((w) => w < width)) {
    const out = `${OUT}/${name}-${w}.webp`;
    if (!existsSync(out)) {
      await sharp(input)
        .resize({ width: w })
        .webp({ quality: QUALITY, smartSubsample: true, effort: 6 })
        .toFile(out);
    }
    sizes.push({ src: `/art/web/${name}-${w}.webp`, width: w });
  }

  manifest[`/art/${file}`] = { full, width, height, sizes };
  console.log(`${file} → ${sizes.length} sizes${isPng ? " + lossless" : ""}`);
}

writeFileSync("src/utils/art-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
