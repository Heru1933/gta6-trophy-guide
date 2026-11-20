// Leonida Platinum — my GTA VI trophy guide entry for make.fun (Node 22, standard
// library only). The guide itself is plain static files under app/: an index page,
// its own CSS, a handful of small ES modules, and app/data/trophies.json with the
// 55 official trophies and a cited guide for each. No build step, no network at
// run time — a browser opens app/index.html and everything it loads lives in app/.
//
// This program is the hand-in: it copies app/ and screenshots/ from beside this
// file into /output and writes /output/dossier.json, the summary the judge reads
// (the screenshots, the first load's files and bytes, and the source), using the
// vendored make.fun library. vendor/makefun-frontend.ts stays exactly as the kit
// shipped it: the scorer rebuilds the dossier with its own copy and compares the
// two byte for byte, so any change there would fail the entry.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Round 3: refuse to build a dossier from a tree that lost its entry page,
// instead of silently handing in an app with no index — a bad build should
// fail here, loudly, rather than reach the gate.
if (!existsSync(join(here, 'app', 'index.html'))) throw new Error('app/index.html is missing — refusing to build the dossier');
// Round 4: the same for the screenshots — the judge sees four of them, so
// a build with fewer (or a stale extra) must fail here, not at the gate.
if (!existsSync(join(here, 'screenshots'))) throw new Error('screenshots/ is missing — refusing to build the dossier');
const shotFiles = readdirSync(join(here, 'screenshots')).filter((file) => file.endsWith('.jpg'));
if (shotFiles.length !== 4) throw new Error(`expected 4 screenshots, found ${shotFiles.length} — refusing to build the dossier`);

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
