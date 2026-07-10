#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "$ROOT_DIR/.env.oss" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env.oss"
  set +a
fi

if ! command -v ossutil >/dev/null 2>&1; then
  echo "未检测到 ossutil，请先安装并配置 ossutil。"
  echo "参考 DEPLOY_OSS_README.md 的第一步。"
  exit 1
fi

if [[ -z "${OSS_BUCKET:-}" ]]; then
  echo "缺少 OSS_BUCKET，请复制 deploy-oss.example.env 为 .env.oss 后填写 Bucket 名称。"
  exit 1
fi

OSS_PATH="oss://${OSS_BUCKET%/}"
if [[ -n "${OSS_PREFIX:-}" ]]; then
  CLEAN_PREFIX="${OSS_PREFIX#/}"
  CLEAN_PREFIX="${CLEAN_PREFIX%/}"
  OSS_PATH="${OSS_PATH}/${CLEAN_PREFIX}"
fi

FILES=(
  "axure-handoff.html"
  "template-apply.html"
  "result-submit.html"
  "result-submit-mini.html"
  "result-submit-shared.js"
  "template-config.html"
  "template-version-record.html"
  "index.html"
)

echo "准备部署静态原型到：$OSS_PATH"

for file in "${FILES[@]}"; do
  if [[ ! -f "$ROOT_DIR/$file" ]]; then
    echo "缺少文件：$file"
    exit 1
  fi
done

for file in "${FILES[@]}"; do
  echo "上传：$file"
  if [[ -n "${OSS_ENDPOINT:-}" ]]; then
    ossutil cp "$ROOT_DIR/$file" "$OSS_PATH/$file" --endpoint "$OSS_ENDPOINT" --force
  else
    ossutil cp "$ROOT_DIR/$file" "$OSS_PATH/$file" --force
  fi
done

echo ""
echo "部署完成。"
if [[ -n "${PUBLIC_URL:-}" ]]; then
  echo "访问地址：${PUBLIC_URL%/}/axure-handoff.html"
else
  echo "请到 OSS Bucket 概览中复制外网访问域名，访问：/axure-handoff.html"
fi
