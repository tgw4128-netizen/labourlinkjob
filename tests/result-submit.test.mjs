import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const renderer = readFileSync(new URL("../result-submit-shared.js", import.meta.url), "utf8");

assert.match(renderer, /quantityLabel/, "共享渲染器应包含任务级数量名称");
assert.match(renderer, /quantityUnit/, "共享渲染器应包含任务级数量单位");
assert.match(renderer, /templateSnapshot/, "共享渲染器应包含任务模板快照");
assert.match(renderer, /提交成功，等待审核/, "共享渲染器应提供提交成功反馈");

for (const file of ["result-submit.html", "result-submit-mini.html"]) {
  const page = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

  assert.match(page, /result-submit-shared\.js/, `${file} 应引用共享任务快照渲染器`);
  assert.match(page, /单行文本.*多行文本.*图片上传.*文件上传.*视频上传.*日期时间.*单选.*多选/s, `${file} 应支持所有已配置字段类型`);
  assert.doesNotMatch(page, /id="templateSelect"/, `${file} 不应允许个人切换模板`);
}

console.log("result submission page contracts passed");
