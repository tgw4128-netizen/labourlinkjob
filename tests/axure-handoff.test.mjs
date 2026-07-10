import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../axure-handoff.html", import.meta.url), "utf8");

assert.match(page, /入口菜单/);
assert.match(page, /id="menu-template-config"/);
assert.match(page, /id="menu-pc-submit"/);
assert.match(page, /id="menu-mini-submit"/);
assert.match(page, /href="\.\/template-config\.html"/);
assert.match(page, /href="\.\/result-submit\.html"/);
assert.match(page, /href="\.\/result-submit-mini\.html"/);
assert.doesNotMatch(page, /template-apply\.html/);
assert.doesNotMatch(page, /页面树/);
assert.doesNotMatch(page, /<h2>核心逻辑<\/h2>/);

console.log("axure handoff checks passed");
