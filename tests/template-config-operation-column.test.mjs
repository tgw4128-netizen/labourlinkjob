import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../template-config.html", import.meta.url), "utf8");

const headerOperation = '<th class="operation-column sticky-operation" style="width: 260px;">操作</th>';
const headerSequence = '<th class="center" style="width: 56px;">序号</th>';

assert.ok(page.includes(headerOperation), "操作列表头应使用固定首列样式");
assert.ok(page.indexOf(headerOperation) < page.indexOf(headerSequence), "操作列表头应位于序号之前");
assert.match(
  page,
  /<td class="operation-column sticky-operation">\s*<button class="link" data-action="preview"/,
  "每行操作应使用固定首列样式"
);
assert.match(page, /\.sticky-operation\s*\{[^}]*position:\s*sticky;/s, "操作列应使用 sticky 固定定位");
assert.match(
  page,
  /<th style="width: 120px;">创建人<\/th>\s*<th style="width: 170px;">创建时间<\/th>\s*<th style="width: 120px;">修改人<\/th>\s*<th style="width: 170px;">更新时间<\/th>/,
  "创建人与修改信息应按固定顺序展示"
);
assert.match(
  page,
  /<td>\$\{row\.creator\}<\/td>\s*<td>\$\{row\.createTime\}<\/td>\s*<td>\$\{row\.modifier\}<\/td>\s*<td>\$\{row\.updateTime\}<\/td>/,
  "每行应展示创建人与修改信息"
);
assert.match(page, /const fieldTypes = \["单行文本", "多行文本", "图片上传", "文件上传", "视频上传", "日期时间", "单选", "多选"\]/);
assert.match(page, /<th style="width: 220px;">备注<\/th>/);
assert.match(page, /data-field="options"/);
assert.match(page, /填写选项，多个选项用 # 分隔/);
assert.match(page, /非单选\/多选无需配置/);
assert.match(page, /id="categoryMode"/);
assert.match(page, /option value="ALL">全部<\/option>/);
assert.match(page, /option value="SPECIFIC">指定分类<\/option>/);
assert.match(page, /categoryMode === "ALL"/);
assert.match(page, /请至少选择一个适用岗位分类/);
assert.doesNotMatch(page, /const fieldTypes = \[[^\]]*"数字"/);
assert.doesNotMatch(page, /const fieldTypes = \[[^\]]*"定位"/);
assert.doesNotMatch(page, /const fieldTypes = \[[^\]]*"链接"/);

console.log("template-config operation column checks passed");
