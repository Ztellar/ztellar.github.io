// Genera src/data/stars.json desde el Yale Bright Star Catalog (magnitud < 5).
// Fuente bsc5-short.json: RA "00h 05m 09.9s", Dec "+45° 13′ 45″", V magnitud, K temperatura (Kelvin).
// Uso: npm run stars
import { writeFileSync, mkdirSync } from 'node:fs';

const SOURCE = 'https://raw.githubusercontent.com/brettonw/YaleBrightStarCatalog/master/bsc5-short.json';
const MAG_LIMIT = 5.0;

function raToDeg(s) {
  const m = String(s).match(/(\d+)h (\d+)m ([\d.]+)s/);
  if (!m) return null;
  return (Number(m[1]) + Number(m[2]) / 60 + Number(m[3]) / 3600) * 15;
}

function decToDeg(s) {
  const m = String(s).match(/([+-]?)(\d+)° (\d+)′ ([\d.]+)″/);
  if (!m) return null;
  const deg = Number(m[2]) + Number(m[3]) / 60 + Number(m[4]) / 3600;
  return m[1] === '-' ? -deg : deg;
}

// Temperatura de color (Kelvin) -> RGB, aproximación de Tanner Helland
function kelvinToHex(kelvin) {
  const t = Math.max(1000, Math.min(40000, kelvin)) / 100;
  let r, g, b;
  r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  const hex = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

const raw = await (await fetch(SOURCE)).json();
const stars = [];
for (const s of raw) {
  const mag = parseFloat(s.V);
  if (!Number.isFinite(mag) || mag >= MAG_LIMIT) continue;
  const ra = raToDeg(s.RA);
  const dec = decToDeg(s.Dec);
  if (ra === null || dec === null) continue;
  const kelvin = parseFloat(s.K);
  stars.push({
    x: Number((ra / 360).toFixed(4)),
    y: Number(((90 - dec) / 180).toFixed(4)),
    m: Number(mag.toFixed(2)),
    c: kelvinToHex(Number.isFinite(kelvin) ? kelvin : 5500),
  });
}

if (stars.length < 800) throw new Error(`Solo ${stars.length} estrellas — revisar nombres de campos de la fuente`);
mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/stars.json', JSON.stringify(stars));
console.log(`OK: ${stars.length} estrellas escritas en src/data/stars.json`);
