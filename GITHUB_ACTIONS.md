# GitHub Actions 配置说明

## 自动更新文章

博客系统配置了两个 GitHub Actions workflow：

### 1. Deploy to GitHub Pages (`.github/workflows/deploy.yml`)
- **触发条件**：推送到 `main` 分支
- **功能**：生成文章、构建网站、部署到 GitHub Pages

### 2. Update Articles from GitHub Issues (`.github/workflows/update-articles.yml`)
- **触发条件**：
  - **定时触发**：每小时自动运行一次（cron: `0 * * * *`）
  - 手动触发（从 Actions 页面）
  - Repository dispatch 事件
- **功能**：从 GitHub Issues 获取最新文章并更新 `public/articles.json`
- **智能检测**：只有在文章有变化时才会提交，避免无意义的提交

## 如何添加新文章

### 步骤 1：在 GitHub Issues 中发布文章
1. 访问 https://github.com/TF49/blog-content/issues
2. 创建新 Issue
3. **必须添加 `blog` label**（这样才会被识别为文章）
4. Issue 标题 = 文章标题
5. Issue 正文 = 文章内容（建议添加 frontmatter）

### 步骤 2：等待自动更新
- workflow 会每小时自动检查一次新的文章
- 通常在 1 小时内，新文章会自动同步到网站
- 如果不想等待，可以手动触发 workflow（见下方）

### 步骤 3：手动触发（可选，快速更新）
1. 访问 personal-blog 仓库的 Actions 页面
2. 选择 "Update Articles from GitHub Issues" workflow
3. 点击 "Run workflow" 按钮
4. 等待 workflow 完成后，`public/articles.json` 会自动更新
5. 网站会自动部署（因为更新会触发推送）

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

## 工作流程总结

1. 你在 https://github.com/TF49/blog-content/issues 创建新 Issue（添加 `blog` label）
2. 等待最多 1 小时，workflow 自动检测并更新文章
3. 文章更新后自动提交到仓库
4. 推送触发主部署 workflow
5. 网站自动更新，新文章显示在博客列表中
