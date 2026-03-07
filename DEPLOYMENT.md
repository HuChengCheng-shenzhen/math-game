# 部署指南

## 构建应用

```bash
npm run build
```

构建输出位于 `dist/` 目录。

## 部署选项

### 1. Vercel (推荐)

Vercel 提供免费的静态网站托管，自动部署 GitHub 仓库。

**步骤：**
1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. 构建命令：`npm run build`
5. 输出目录：`dist`
6. 点击部署

### 2. Netlify

Netlify 也是优秀的静态网站托管服务。

**步骤：**
1. 将代码推送到 GitHub 仓库
2. 访问 [netlify.com](https://netlify.com)
3. 点击 "New site from Git"
4. 选择 GitHub 仓库
5. 构建命令：`npm run build`
6. 发布目录：`dist`
7. 点击部署

### 3. GitHub Pages

使用 GitHub Actions 自动部署到 GitHub Pages。

**步骤：**
1. 在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. 在 GitHub 仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支作为源

### 4. 其他静态托管服务

- **Cloudflare Pages**: 类似 Vercel，提供免费托管
- **Render**: 提供静态网站托管
- **Firebase Hosting**: Google 的托管服务

## 环境变量

本项目不需要环境变量配置。

## 自定义域名

各平台都支持自定义域名：
1. 在域名提供商处添加 CNAME 记录
2. 在托管平台配置自定义域名
3. 等待 DNS 传播

## 性能优化建议

1. **图片优化**: 确保 `public/images/` 中的图片已压缩
2. **代码分割**: Vite 已自动处理代码分割
3. **缓存策略**: 静态资源应设置长期缓存
   ```nginx
   location /assets {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```
4. **CDN**: 使用托管服务的 CDN 加速全球访问

## 监控和分析

建议添加以下监控：
1. **Google Analytics**: 用于用户行为分析
2. **Sentry**: 错误监控
3. **Vercel Analytics** 或 **Netlify Analytics**: 平台自带分析工具

## 故障排除

### 构建失败
- 检查 Node.js 版本 (需要 18+)
- 运行 `npm install` 确保依赖安装
- 检查 TypeScript 错误：`npm run build` 会显示详细错误

### 部署后空白页面
- 检查控制台错误
- 确保路由配置正确（单页应用需要重定向到 index.html）
- 检查资源路径是否正确

### 图片不显示
- 确保图片路径正确
- 检查图片是否在构建输出中
- 验证图片格式支持（PNG、JPG、SVG）

## 联系方式

如有部署问题，请查看项目文档或创建 Issue。