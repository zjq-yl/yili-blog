# 逸里博客

一个极简的静态博客。文章写在 `posts/` 中，运行构建后生成可部署到 Cloudflare Pages 的 `dist/` 目录。

## 本地构建

需要 Node.js。首次运行：

```bash
npm install
npm run build
```

本地预览可在 `dist/` 目录运行 `python -m http.server 8000`，然后打开 `http://localhost:8000/`。新增文章时，在 `posts/` 新建 `.md` 文件，建议以 `YYYY-MM-DD-文章名.md` 命名。文章图片放在 `posts/images/`，在 Markdown 中使用相对路径 `images/图片名.png`。

## 部署到 Cloudflare Pages

1. 将本仓库推送到 GitHub。
2. 在 Cloudflare 控制台进入 **Workers & Pages → Create application → Pages → Connect to Git**，选择本仓库。
3. 生产分支选择 `main`，根目录保持仓库根目录，构建命令填写 `npm run build`，构建输出目录填写 `dist`。框架预设可选 `None`。
4. 点击部署。成功后先访问 Cloudflare 提供的 `*.pages.dev` 地址，检查首页、文章页和图片。
5. 在 Pages 项目的 **Custom domains** 中添加 `yiliz.site`。这是根域名，需要先把该域名添加到同一个 Cloudflare 账户，并按 Cloudflare 提示配置域名服务器。域名状态变为 Active 后，访问 `https://yiliz.site/` 验证。

后续推送到生产分支会触发自动构建和部署。这里使用的是小型 Markdown 构建脚本，不需要安装 Hexo，因此 Cloudflare 的 Hexo 教程中 `public` 输出目录不适用于本仓库。

如果在控制台创建的是 **Worker**（部署命令显示 `npx wrangler deploy`），仓库中的 `wrangler.jsonc` 已将静态资源目录指向 `dist/`。保留构建命令 `npm run build` 和部署命令 `npx wrangler deploy` 即可；部署后的临时地址通常是 `*.workers.dev`。域名请在 Worker 的 **Domains** 页面绑定。
