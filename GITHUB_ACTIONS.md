# GitHub Actions 配置说明

## 自动更新文章

博客系统配置了两个 GitHub Actions workflow：

### 1. Deploy to GitHub Pages (`.github/workflows/deploy.yml`)
- **触发条件**：推送到 `main` 分支
- **功能**：生成文章、构建网站、部署到 GitHub Pages

### 2. Update Articles from GitHub Issues (`.github/workflows/update-articles.yml`)
- **触发条件**：
  - 手动触发（从 Actions 页面）
  - Repository dispatch 事件
- **功能**：从 GitHub Issues 获取最新文章并更新 `public/articles.json`

## 如何添加新文章

### 步骤 1：在 GitHub Issues 中发布文章
1. 访问 https://github.com/TF49/blog-content/issues
2. 创建新 Issue
3. **必须添加 `blog` label**（这样才会被识别为文章）
4. Issue 标题 = 文章标题
5. Issue 正文 = 文章内容（建议添加 frontmatter）

### 步骤 2：触发文章更新
有两种方式触发文章更新：

#### 方式 A：手动触发（推荐用于快速测试）
1. 访问 personal-blog 仓库的 Actions 页面
2. 选择 "Update Articles from GitHub Issues" workflow
3. 点击 "Run workflow" 按钮
4. 等待 workflow 完成后，`public/articles.json` 会自动更新

#### 方式 B：推送代码触发（推荐用于正式发布）
1. 等待方式 A 完成后，拉取最新的 `public/articles.json`
2. 推送代码到 `main` 分支
3. GitHub Actions 会自动构建并部署到网站

## 配置要求

### 必需的 GitHub Secrets

在 personal-blog 仓库设置中添加以下 Secret：

- **`BLOG_CONTENT_TOKEN`**：GitHub Personal Access Token
  - 权限需要：`repo` (read)
  - 生成地址：https://github.com/settings/tokens

## Frontmatter 格式（可选但推荐）

```md
---
slug: your-article-slug
summary: 文章摘要
category: 开发笔记
date: 2026-09-25
---

这里开始写正文...
```

- `slug`：文章 URL 标识（缺省时自动生成）
- `summary`：列表页摘要（缺省时从正文截取）
- `category`：分类名（缺省时为"未分类"）
- `date`：发布日期（缺省时使用 Issue 创建日期）
