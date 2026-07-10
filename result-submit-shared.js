const supportedFieldTypes = ["单行文本", "多行文本", "图片上传", "文件上传", "视频上传", "日期时间", "单选", "多选"];

const task = {
  name: "社区保洁服务",
  number: "RW20260710101236",
  customer: "演示客户 1",
  settlementMethod: "按时",
  unitPrice: "22 元/时",
  quantityLabel: "工时数",
  quantityUnit: "时",
  tip: "请按要求提交现场成果材料，图片与文件需清晰可辨。",
  templateSnapshot: {
    id: "TPL202607001",
    version: "V3",
    fields: [
      { name: "服务地点", type: "单行文本", required: true, help: "填写实际服务地点" },
      { name: "服务完成说明", type: "多行文本", required: true, help: "简要说明本次完成的工作内容" },
      { name: "服务前照片", type: "图片上传", required: true, help: "上传作业前现场照片，可选择多张" },
      { name: "签收凭证", type: "文件上传", required: false, help: "如有签收单或交接材料，请上传" },
      { name: "服务过程视频", type: "视频上传", required: false, help: "可补充上传服务过程视频" },
      { name: "完成时间", type: "日期时间", required: true, help: "选择实际完成时间" },
      { name: "服务结果", type: "单选", required: true, options: "正常完成#部分完成#异常", help: "请选择本次服务结果" },
      { name: "异常类型", type: "多选", required: false, options: "客户改期#现场无法进入#物料不足#其他", help: "如存在异常，可选择对应原因" }
    ]
  }
};

const attachmentState = {};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function optionValues(field) {
  return (field.options || "").split("#").map(item => item.trim()).filter(Boolean);
}

function setTaskInformation() {
  document.getElementById("taskName").textContent = task.name;
  document.getElementById("taskNumber").textContent = task.number;
  document.getElementById("taskCustomer").textContent = task.customer;
  document.getElementById("settlementMethod").textContent = task.settlementMethod;
  document.getElementById("unitPrice").textContent = task.unitPrice;
  document.getElementById("quantityLabel").textContent = task.quantityLabel;
  document.getElementById("quantityUnit").textContent = task.quantityUnit;
  document.getElementById("templateTip").textContent = task.tip;
}

function renderUploadField(field, index) {
  const accept = field.type === "图片上传" ? "image/*" : field.type === "视频上传" ? "video/*" : "";
  const multiple = field.type === "图片上传" ? "multiple" : "";
  return `
    <div class="upload-shell">
      <label class="upload-button">
        <input class="file-input" type="file" data-upload-index="${index}" accept="${accept}" ${multiple}>
        <span>选择${field.type === "图片上传" ? "图片" : field.type === "视频上传" ? "视频" : "文件"}</span>
      </label>
      <div class="upload-help">${escapeHtml(field.help)}</div>
      <div class="file-list" id="uploadFileNames-${index}"></div>
    </div>
  `;
}

function renderFieldControl(field, index) {
  const id = `field-${index}`;
  if (field.type === "多行文本") {
    return `<textarea id="${id}" data-field-index="${index}" maxlength="5000" placeholder="${escapeHtml(field.help)}"></textarea><div class="counter" data-counter-for="${id}">0 / 5000</div>`;
  }
  if (field.type === "日期时间") {
    return `<input id="${id}" data-field-index="${index}" type="datetime-local">`;
  }
  if (field.type === "单选" || field.type === "多选") {
    const type = field.type === "单选" ? "radio" : "checkbox";
    return `<div class="choice-group">${optionValues(field).map((option, optionIndex) => `
      <label class="choice-option">
        <input type="${type}" name="${id}" data-field-index="${index}" value="${escapeHtml(option)}">
        <span>${escapeHtml(option)}</span>
      </label>
    `).join("")}</div>`;
  }
  if (field.type.includes("上传")) return renderUploadField(field, index);
  return `<input id="${id}" data-field-index="${index}" type="text" placeholder="${escapeHtml(field.help)}">`;
}

function renderFields() {
  document.getElementById("fieldForm").innerHTML = task.templateSnapshot.fields.map((field, index) => `
    <div class="submit-field" data-submit-field="${index}">
      <label class="field-label ${field.required ? "required" : ""}" for="field-${index}">${escapeHtml(field.name)}</label>
      <div class="field-control">${renderFieldControl(field, index)}</div>
      ${field.type.includes("上传") || field.type === "多行文本" ? "" : `<div class="field-help">${escapeHtml(field.help)}</div>`}
    </div>
  `).join("");
}

function updateFileList(index) {
  const container = document.getElementById(`uploadFileNames-${index}`);
  const names = attachmentState[index] || [];
  container.innerHTML = names.map((name, fileIndex) => `
    <span class="file-name">${escapeHtml(name)}<button type="button" data-remove-upload="${index}" data-file-index="${fileIndex}" aria-label="移除文件">x</button></span>
  `).join("");
}

function isFieldEmpty(field, index) {
  if (field.type.includes("上传")) return !(attachmentState[index] || []).length;
  if (field.type === "单选") return !document.querySelector(`input[data-field-index="${index}"]:checked`);
  if (field.type === "多选") return !document.querySelectorAll(`input[data-field-index="${index}"]:checked`).length;
  const element = document.querySelector(`[data-field-index="${index}"]`);
  return !element || !element.value.trim();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function validateSubmission() {
  const quantity = document.getElementById("quantityInput");
  if (!quantity.value || Number(quantity.value) <= 0) {
    quantity.focus();
    showToast(`请填写有效的${task.quantityLabel}`);
    return false;
  }
  for (const [index, field] of task.templateSnapshot.fields.entries()) {
    if (field.required && isFieldEmpty(field, index)) {
      const container = document.querySelector(`[data-submit-field="${index}"]`);
      container.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast(`请填写${field.name}`);
      return false;
    }
  }
  return true;
}

function bindInteractions() {
  document.getElementById("fieldForm").addEventListener("change", event => {
    const input = event.target.closest("input[data-upload-index]");
    if (!input) return;
    const index = Number(input.dataset.uploadIndex);
    attachmentState[index] = Array.from(input.files || []).map(file => file.name);
    updateFileList(index);
  });

  document.getElementById("fieldForm").addEventListener("click", event => {
    const button = event.target.closest("button[data-remove-upload]");
    if (!button) return;
    const index = Number(button.dataset.removeUpload);
    attachmentState[index].splice(Number(button.dataset.fileIndex), 1);
    updateFileList(index);
  });

  document.getElementById("fieldForm").addEventListener("input", event => {
    const textarea = event.target.closest("textarea[maxlength]");
    if (!textarea) return;
    const counter = document.querySelector(`[data-counter-for="${textarea.id}"]`);
    if (counter) counter.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
  });

  document.getElementById("submitBtn").addEventListener("click", () => {
    if (validateSubmission()) showToast("提交成功，等待审核");
  });

  document.getElementById("cancelBtn").addEventListener("click", () => {
    showToast("已取消本次填写");
  });
}

setTaskInformation();
renderFields();
bindInteractions();
