// Pictures for /band/, into public/Images/band/: the 1200 x 630 share card, cut from a
// photo of the band held flat, and small copies of the free maps' cover for the card on the
// page (the trail page's own copy is 960 px wide, far more than a thumbnail needs). A photo
// off the phone carries where it was taken; a file written here is new and has none of
// that, and the script stops if it finds any.
//
//   node scripts/band-images.mjs <folder holding IMG_3584.JPG>
import { mkdirSync, readFileSync, statSync } from 'node:fs';
import sharp from 'sharp';

const from = process.argv[2];
if (!from) throw new Error('usage: node scripts/band-images.mjs <folder holding IMG_3584.JPG>');
const out = 'public/Images/band';
mkdirSync(out, { recursive: true });

const written = [];
async function write(image, file) {
  await image.toFile(`${out}/${file}`);
  written.push(file);
}

// The share card: the band held flat, cut to 1200 x 630 around the band. The photo was taken
// in flat light, so its middle tones are lifted along a curve; black and white stay put.
const lift = 1.3;
const { data, info } = await sharp(`${from}/IMG_3584.JPG`)
  .extract({ left: 0, top: 103, width: 2730, height: 1433 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const curve = Uint8Array.from({ length: 256 }, (_, v) => Math.round(255 * (v / 255) ** (1 / lift)));
for (let i = 0; i < data.length; i++) data[i] = curve[data[i]];
await write(sharp(data, { raw: info }).resize(1200, 630).jpeg({ quality: 82, mozjpeg: true }), 'share.jpg');

// The maps' cover as the card shows it: 290 px wide on a laptop, 150 on a tablet, 88 on a phone.
const cover = 'public/Images/maps/jdf/cover.jpg';
for (const w of [300, 600]) {
  await write(sharp(cover).resize({ width: w }).webp({ quality: 82, effort: 6 }), `jdf-maps-cover-${w}.webp`);
}
await write(sharp(cover).resize({ width: 600 }).jpeg({ quality: 82, mozjpeg: true }), 'jdf-maps-cover-600.jpg');

// Nothing from the camera may be left in a published file.
let total = 0;
for (const file of written) {
  const bytes = readFileSync(`${out}/${file}`);
  const left = ['Exif', 'EXIF', 'XMP ', 'xmpmeta', 'iPhone', 'ICC_PROFILE'].filter((mark) => bytes.includes(mark));
  if (left.length) throw new Error(`${file} still carries ${left.join(', ')}`);
  total += statSync(`${out}/${file}`).size;
}
console.log(`${written.length} files, ${(total / 1024).toFixed(0)} KB, no camera metadata in any of them`);
