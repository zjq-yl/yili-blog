# 艺黎博客

一个用 Astro 生成的极简静态博客。文章仍写在 `posts/` 中，运行构建后生成可部署到 Cloudflare Worker 的 `dist/` 目录。

## 本地构建

需要 Node.js。首次运行：

```bash
npm install
npm run build
```

本地开发可运行 `npm run dev`，按终端给出的网址打开网站。新增文章时，在 `posts/` 新建 `.md` 文件，建议以 `YYYY-MM-DD-文章名.md` 命名。文章图片放在 `posts/images/`，在 Markdown 中使用相对路径 `images/图片名.png`。Astro 会在构建时处理文章和图片。

## 部署到 Cloudflare Pages

当前使用 Cloudflare Worker 项目 `yili-blog`，连接 GitHub 的 `main` 分支。保留构建命令 `npm run build`、部署命令 `npx wrangler deploy`。`wrangler.jsonc` 将静态资源目录指向 `dist/`。每次推送后，Cloudflare 会重新构建并发布；部署状态可在 Worker 的 **Deployments** 页面查看。自定义域名 `yiliz.site` 在 Worker 的 **Domains** 页面管理。

Astro 的内容集合配置在 `src/content.config.ts`，网页模板在 `src/layouts/` 和 `src/pages/`。文章原有的 `/posts/文章名.html` 地址保持不变。
