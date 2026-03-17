## GitHub Issues 作为文章源（blog-content）

你将使用一个专用仓库存放文章（建议：`TF49/blog-content`），通过 **Issues** 发布文章内容。

### 文章识别规则

- **只有带有 Label `blog` 的 Issue 才会被当作文章**。
- 建议用 **Open Issue** 作为“已发布文章”，关闭 Issue 视为“下线/归档”（可选）。

### Issue 内容格式

Issue **标题** = 文章标题。

Issue **正文** = 文章内容（Markdown），并建议在正文开头添加 YAML frontmatter（可选但推荐）：

```md
---
slug: spring-boot-custom-config
summary: 在 Spring Boot 应用中使用 application.yml 组织配置，层次清晰、易维护。
category: 开发笔记
date: 2025-01-22
---

这里开始写 Markdown 正文……
```

### 字段说明（frontmatter）

- **slug**（推荐）：文章 URL 标识。最终访问路径为 `/blog/{slug}`。
  - 缺省时会自动生成：`{issue_number}-{slugified-title}`。
- **summary**（推荐）：列表页摘要。缺省时会从正文截取前若干字自动生成。
- **category**（可选）：分类名，用于列表页筛选与展示。缺省时默认为 `未分类`。
  - 也可以用 label 表示分类，例如 `cat:开发笔记`（若同时存在，以 frontmatter 为准）。
- **date**（可选）：发布日期（字符串）。缺省时使用 Issue `created_at` 的日期部分（YYYY-MM-DD）。

### 图片与链接

- Markdown 图片请使用公网可访问地址（例如 GitHub 仓库 raw、图床等）。
- 正文中的链接会在前端渲染为可点击链接。

### 阅读量字段说明

GitHub Issues 本身没有“浏览量”。站点中的 `readCount` 会先用一个可计算的“热度”替代（例如 comments 或 reactions），或默认 0（取决于前端实现）。

