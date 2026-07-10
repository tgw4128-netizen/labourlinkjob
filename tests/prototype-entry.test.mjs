import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../prototype-entry.html", import.meta.url), "utf8");

assert.match(page, /原型入口/);
for (const href of [
  "./template-config.html",
  "./result-submit.html",
  "./result-submit-mini.html",
  "./axure-handoff.html"
]) {
  assert.ok(page.includes(`href="${href}"`), `入口页应包含 ${href}`);
}

assert.doesNotMatch(page, /template-version-record\.html/, "模板版本记录不应作为入口页模块");
assert.doesNotMatch(page, /template-apply\.html/, "入口页不应包含已移除的岗位模板应用");
assert.match(page, /Axure 交付说明<\/div><div class="entry-desc">查看页面范围/, "Axure 交付说明应作为独立入口");

console.log("prototype entry checks passed");
