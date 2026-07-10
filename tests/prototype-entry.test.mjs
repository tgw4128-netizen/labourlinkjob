import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../prototype-entry.html", import.meta.url), "utf8");

assert.match(page, /原型入口/);
for (const href of [
  "./template-config.html",
  "./template-apply.html",
  "./result-submit.html",
  "./result-submit-mini.html",
  "./template-version-record.html?templateId=TPL202607001",
  "./axure-handoff.html"
]) {
  assert.ok(page.includes(`href="${href}"`), `入口页应包含 ${href}`);
}

console.log("prototype entry checks passed");
