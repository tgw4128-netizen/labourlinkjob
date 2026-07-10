# Result Submit Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build PC and mini-program-style personal result submission pages that render a task's fixed quantity and template snapshot fields without allowing template switching.

**Architecture:** Create two standalone static HTML pages with separate responsive layouts. Each page owns an identical example task snapshot and a small renderer that maps the configured field type to its submission control; the field rules stay aligned through matching data keys and test assertions.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Personal users cannot select or switch a template.
- `quantityLabel` and `quantityUnit` are task-level data, not template fields.
- Required fields display a red `*` and block submission when empty.
- Single and multi-select choices are separated by `#` in a field's `options` string.
- No backend submission is added; successful validation shows a local success message.

---

### Task 1: Submission page contract tests

**Files:**
- Create: `tests/result-submit.test.mjs`
- Test: `tests/result-submit.test.mjs`

**Interfaces:**
- Consumes: `result-submit.html` and `result-submit-mini.html`.
- Produces: static contract checks for task snapshot fields, fixed quantity data, no template selector, and all supported renderer types.

- [ ] **Step 1: Write the failing test**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

for (const file of ["result-submit.html", "result-submit-mini.html"]) {
  const page = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  assert.match(page, /quantityLabel/);
  assert.match(page, /quantityUnit/);
  assert.match(page, /templateSnapshot/);
  assert.match(page, /单行文本.*多行文本.*图片上传.*文件上传.*视频上传.*日期时间.*单选.*多选/s);
  assert.doesNotMatch(page, /id="templateSelect"/);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/Users/tgw/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/result-submit.test.mjs`

Expected: FAIL because the two submission pages do not exist.

- [ ] **Step 3: Keep the test focused on page contracts**

Do not add interaction assertions until the pages and their renderer contracts exist. The test must only require named data and the complete field-type list.

- [ ] **Step 4: Run test after implementation tasks**

Run: `/Users/tgw/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/result-submit.test.mjs`

Expected: PASS with one contract result per page.

### Task 2: Build the PC result submission page

**Files:**
- Create: `result-submit.html`
- Modify: `tests/result-submit.test.mjs`
- Test: `tests/result-submit.test.mjs`

**Interfaces:**
- Consumes: task snapshot keys `quantityLabel`, `quantityUnit`, and `templateSnapshot.fields`.
- Produces: PC task information card, dynamic submission controls, file selection state, validation, and success toast.

- [ ] **Step 1: Implement the task snapshot and field renderer**

```js
const task = {
  quantityLabel: "工时数",
  quantityUnit: "时",
  templateSnapshot: {
    fields: [
      { name: "服务前照片", type: "图片上传", required: true, help: "上传作业前现场照片" },
      { name: "服务完成时间", type: "日期时间", required: true, help: "选择实际完成时间" },
      { name: "服务结果", type: "单选", required: true, options: "正常完成#部分完成#异常", help: "请选择服务结果" }
    ]
  }
};

function isRequiredEmpty(field, value) {
  return field.required && (!value || (Array.isArray(value) && !value.length));
}
```

- [ ] **Step 2: Render controls by `field.type`**

```js
const options = (field.options || "").split("#").filter(Boolean);
if (field.type === "单选") return renderRadioGroup(options);
if (field.type === "多选") return renderCheckboxGroup(options);
if (field.type.includes("上传")) return renderUploadField(field.type);
if (field.type === "日期时间") return `<input type="datetime-local">`;
if (field.type === "多行文本") return `<textarea maxlength="5000"></textarea>`;
return `<input type="text">`;
```

- [ ] **Step 3: Add validation and local submit feedback**

```js
document.getElementById("submitBtn").addEventListener("click", () => {
  const firstInvalid = getFirstInvalidField();
  if (firstInvalid) return showToast(`请填写${firstInvalid.name}`);
  showToast("提交成功，等待审核");
});
```

- [ ] **Step 4: Run focused tests**

Run: `/Users/tgw/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/result-submit.test.mjs`

Expected: PASS.

### Task 3: Build the mini-program-style result submission page

**Files:**
- Create: `result-submit-mini.html`
- Modify: `tests/result-submit.test.mjs`
- Test: `tests/result-submit.test.mjs`

**Interfaces:**
- Consumes: the same task snapshot property names and field type list as the PC page.
- Produces: a mobile single-column submission form with a safe-area fixed submit bar.

- [ ] **Step 1: Add mobile task snapshot and renderer**

```js
const task = {
  quantityLabel: "工时数",
  quantityUnit: "时",
  templateSnapshot: { fields: [] }
};

function renderFields(fields) {
  return fields.map(renderField).join("");
}
```

- [ ] **Step 2: Implement mobile layout rules**

```css
.page { padding-bottom: calc(76px + env(safe-area-inset-bottom)); }
.submit-bar { position: fixed; inset: auto 0 0; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); }
.field-card { border-radius: 8px; background: #fff; }
```

- [ ] **Step 3: Add upload filename, required validation, and submit feedback**

```js
fileInput.addEventListener("change", event => {
  attachmentState[field.name] = Array.from(event.target.files).map(file => file.name);
  renderFields(task.templateSnapshot.fields);
});
```

- [ ] **Step 4: Run focused tests**

Run: `/Users/tgw/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/result-submit.test.mjs`

Expected: PASS.

### Task 4: Link pages into the handoff and verify all prototype contracts

**Files:**
- Modify: `axure-handoff.html`
- Modify: `template-apply.html`
- Modify: `tests/template-apply.test.mjs`
- Test: `tests/result-submit.test.mjs`
- Test: `tests/template-apply.test.mjs`
- Test: `tests/template-config-operation-column.test.mjs`

**Interfaces:**
- Consumes: `result-submit.html` and `result-submit-mini.html` as delivered prototype pages.
- Produces: visible delivery links and development notes explaining task snapshot ownership and fixed quantity configuration.

- [ ] **Step 1: Add links to both submission pages**

```html
<a class="btn" href="./result-submit.html">打开 PC 提交页</a>
<a class="btn" href="./result-submit-mini.html">打开小程序提交页</a>
```

- [ ] **Step 2: Add handoff rules**

```html
<li>个人端不选择模板，任务保存模板字段快照。</li>
<li>工时数、天数等数量字段属于任务结算配置，不属于模板字段。</li>
```

- [ ] **Step 3: Run full static test suite and whitespace check**

Run: `/Users/tgw/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs`

Expected: all tests PASS.

Run: `git diff --check`

Expected: no output and exit code 0.
