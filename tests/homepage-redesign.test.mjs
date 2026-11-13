import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("homepage keeps engineering actions and the currently exploring strip in the hero flow", async () => {
  const page = await read("../app/page.tsx");
  const hero = await read("../components/sections/hero.tsx");
  assert.match(page, /<CurrentlyExploring\s*\/>/);
  assert.match(hero, /Building systems\./);
  assert.match(hero, /Seeing things/);
  assert.match(hero, /Not just models, complete AI pipelines\./);
  assert.match(hero, /href="\/work"/);
  assert.match(hero, /href="\/resume\.pdf"/);
  assert.doesNotMatch(hero, /Photography\s*<\/Link>/);
});

test("homepage feature links have default and keyboard-focus reveal states", async () => {
  const page = await read("../app/page.tsx");
  const css = await read("../app/globals.css");
  for (const href of ["/work", "/photography", "/games"]) assert.ok(page.includes(`href="${href}"`));
  assert.match(css, /home-feature:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("hero caption remains layered over the supporting photograph", async () => {
  const css = await read("../app/globals.css");
  assert.match(css, /\.home-hero-visual \.hero-image-caption\s*\{[^}]*position:\s*absolute/);
});

test("mobile hero uses one page gutter and a smaller headline size", async () => {
  const hero = await read("../components/sections/hero.tsx");
  const css = await read("../app/globals.css");
  assert.doesNotMatch(hero, /className="home-hero px-\[var\(--page-gutter\)\]"/);
  assert.doesNotMatch(hero, /home-hero-visual relative mx-auto w-full/);
  assert.match(css, /@media \(max-width: 430px\)[\s\S]*?\.home-hero-title[^}]*font-size:/);
});

test("closing signature uses one centered mark with one rule on each side", async () => {
  const footer = await read("../components/sections/footer.tsx");
  assert.match(footer, /closing-rule/);
  assert.equal((footer.match(/closing-rule/g) ?? []).length, 2);
  assert.doesNotMatch(footer, /site-footer[^\n]*section-rule/);
});
