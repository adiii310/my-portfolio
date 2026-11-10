/**
 * Fails fast with a readable message when the active Node is too old.
 *
 * Without this you get a confusing stack blaming next/font or globals.css:
 *
 *   Error [ERR_REQUIRE_ESM]: require() of ES Module .../magic-string/dist/index.mjs
 *       at .../@tailwindcss/node/dist/index.js
 *
 * The real cause is that Tailwind v4's Node bridge `require()`s an ESM-only
 * dependency, and `require(esm)` only became supported in Node 20.19 / 22.12.
 * Nothing is wrong with the font file it points at.
 */

const MIN = [20, 19, 0];

const current = process.versions.node.split(".").map(Number);
const ok =
  current[0] > MIN[0] ||
  (current[0] === MIN[0] &&
    (current[1] > MIN[1] || (current[1] === MIN[1] && current[2] >= MIN[2])));

if (!ok) {
  const red = (s) => `\x1b[31m${s}\x1b[0m`;
  const bold = (s) => `\x1b[1m${s}\x1b[0m`;

  console.error(`
${red(bold("✗ Node " + process.versions.node + " is too old for this project."))}

  Tailwind CSS v4 requires ${bold("Node >= 20.19")} (require(esm) support).
  On older Node you'll see an ERR_REQUIRE_ESM stack that blames
  src/lib/fonts.ts or globals.css — that is a red herring.

  This repo pins a known-good version in ${bold(".nvmrc")}:

      ${bold("nvm use")}        # or: nvm install
      npm run dev

`);
  process.exit(1);
}
