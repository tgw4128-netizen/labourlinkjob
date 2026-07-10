# 阿里云 OSS 静态页面自动部署说明

## 目标

把本地原型页面一键上传到阿里云 OSS，开发通过固定链接访问：

```text
https://你的OSS域名/axure-handoff.html
```

## 一、阿里云控制台准备

1. 进入阿里云 OSS，创建 Bucket。
2. Bucket 读写权限建议设置为公共读，方便开发直接访问。
3. 进入 Bucket 的静态网站托管设置：
   - 默认首页：`axure-handoff.html`
   - 404 页面：可先留空
4. 创建 RAM 用户 AccessKey，权限只给这个 Bucket 的上传权限。

## 二、本机安装并配置 ossutil

安装阿里云官方 `ossutil` 后，执行：

```bash
ossutil config
```

按提示填写：

```text
AccessKey ID
AccessKey Secret
Endpoint，例如 https://oss-cn-hangzhou.aliyuncs.com
```

注意：不要把 AccessKey 写进 HTML，也不要发给开发。

## 三、配置部署信息

在当前目录复制配置文件：

```bash
cp deploy-oss.example.env .env.oss
```

编辑 `.env.oss`，至少填写：

```bash
OSS_BUCKET="你的Bucket名称"
OSS_ENDPOINT="https://oss-cn-hangzhou.aliyuncs.com"
PUBLIC_URL="https://你的Bucket外网访问域名"
```

## 四、一键部署

第一次执行前给脚本权限：

```bash
chmod +x deploy-oss.sh
```

以后每次修改完页面，运行：

```bash
./deploy-oss.sh
```

脚本会上传这些文件：

```text
axure-handoff.html
template-apply.html
result-submit.html
result-submit-mini.html
result-submit-shared.js
template-config.html
template-version-record.html
index.html
```

## 五、发给开发的链接

```text
https://你的OSS域名/axure-handoff.html
```

开发优先查看 `axure-handoff.html`，里面包含页面入口、交互备注、开发说明和验收标准。

## 常见问题

| 问题 | 处理 |
|---|---|
| 403 Forbidden | 检查 Bucket 是否公共读，或文件 ACL 是否允许读取 |
| 页面能打开但跳转失败 | 确认几个 HTML 文件上传在同一目录 |
| 脚本提示未检测到 ossutil | 先安装 ossutil，并确认终端里能执行 `ossutil` |
| 上传失败 | 检查 RAM 用户是否有当前 Bucket 的 PutObject 权限 |
