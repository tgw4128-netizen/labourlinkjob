import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../template-apply.html", import.meta.url), "utf8");
const handoff = readFileSync(new URL("../axure-handoff.html", import.meta.url), "utf8");
const deployScript = readFileSync(new URL("../deploy-oss.sh", import.meta.url), "utf8");

assert.match(page, /<select id="templateSelect">/);
assert.match(page, /<tbody id="fieldBody"><\/tbody>/);
assert.match(page, /function applyTemplate\(templateId/);
assert.match(page, /jobFields = cloneTemplateFields\(currentTemplate\)/);
assert.match(page, /字段名称、字段类型、是否必填、填写说明可按当前岗位单独调整；单选\/多选需填写选项备注/);
assert.match(page, /const fieldTypes = \["单行文本", "多行文本", "图片上传", "文件上传", "视频上传", "日期时间", "单选", "多选"\]/);
assert.match(page, /<th style="width: 220px;">备注<\/th>/);
assert.match(page, /data-field="options"/);
assert.match(page, /填写选项，多个选项用 # 分隔/);
assert.match(page, /非单选\/多选无需配置/);
assert.doesNotMatch(page, /const fieldTypes = \[[^\]]*"数字"/);
assert.doesNotMatch(page, /const fieldTypes = \[[^\]]*"定位"/);
assert.doesNotMatch(page, /const fieldTypes = \[[^\]]*"链接"/);
assert.doesNotMatch(page, /id="templateVersion"/);
assert.doesNotMatch(page, /id="fieldCount"/);
assert.doesNotMatch(page, /template-summary/);
assert.doesNotMatch(page, /个人端提交预览/);

assert.match(handoff, /href="\.\/template-apply\.html"/);
assert.match(handoff, /id="screen-apply"/);
assert.match(handoff, /保存岗位时应保存“引用模板 ID、版本号、岗位字段快照”/);

assert.match(deployScript, /"template-apply\.html"/);
assert.doesNotMatch(deployScript, /"monthly-settlement\.html"/);

console.log("template apply checks passed");
