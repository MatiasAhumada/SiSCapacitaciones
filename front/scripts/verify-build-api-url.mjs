import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const expected = process.env.VITE_APP_URL;
const dist = process.argv[2] || 'dist';

if (!expected) throw new Error('VITE_APP_URL is required to validate this build.');
let parsed;
try {
  parsed = new URL(expected);
} catch {
  throw new Error('VITE_APP_URL must be an absolute URL.');
}
if (parsed.protocol !== 'https:') throw new Error('VITE_APP_URL must use HTTPS.');

const assetDirectory = join(dist, 'assets');
const assets = readdirSync(assetDirectory).filter((file) => file.endsWith('.js'));
if (assets.length === 0) throw new Error(`No JavaScript assets found in ${assetDirectory}.`);
const embedded = assets.some((file) =>
  readFileSync(join(assetDirectory, file), 'utf8').includes(expected),
);
if (!embedded) throw new Error('The built frontend does not contain the selected environment API URL.');
process.stdout.write(`Frontend build embeds ${parsed.origin} (${assets.length} JavaScript assets checked).\n`);
