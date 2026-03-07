# 部署指南

## 🎯 推荐部署方式

根据您的选择，我们推荐使用 **本地部署** 方案：

### 🚀 快速本地部署
```bash
npm run build && npm start
```
访问 http://localhost:3000 即可使用游戏。

### 📦 其他部署选项
如果您需要云端部署，请参考以下选项：

## 🚀 快速自动化部署 (GitHub)

我们提供了一个自动化脚本，可以一键完成GitHub仓库创建和代码推送：

```bash
# 1. 确保脚本有执行权限
chmod +x deploy-to-github.sh

# 2. 运行部署脚本
./deploy-to-github.sh
```

脚本将引导您完成：
- GitHub仓库创建
- 代码推送（支持HTTPS token和SSH两种方式）
- GitHub Pages配置指导
- 自动部署状态监控

### 需要准备：
1. **GitHub账号**
2. **GitHub个人访问令牌**（需要repo权限）
   - 生成地址：https://github.com/settings/tokens
   - 权限选择：`repo`（完全控制仓库）

## 构建应用

```bash
npm run build
```

构建输出位于 `dist/` 目录。

## 🎯 本地部署 (Node.js HTTP服务器)

专为本地环境设计的部署方案，无需外部服务，适合开发测试和内部使用。

### 快速启动

```bash
# 1. 构建应用（如果尚未构建）
npm run build

# 2. 启动本地服务器
npm start

# 或直接运行
node server.js
```

### 服务器特性

- **端口**: 默认 3000（可通过 `PORT` 环境变量修改）
- **SPA支持**: 自动处理单页应用路由，所有请求回退到 `index.html`
- **静态文件服务**: 自动提供 `dist/` 目录下的文件
- **MIME类型**: 自动识别和设置正确的Content-Type
- **安全限制**: 禁止访问 `dist/` 目录外的文件
- **优雅关闭**: 支持 Ctrl+C 安全关闭服务器

### 启动方式

#### 方式1：使用npm脚本（推荐）
```bash
# 构建并启动
npm run build && npm start

# 或单独启动
npm start
```

#### 方式2：直接运行Node.js
```bash
# 指定端口
PORT=8080 node server.js

# 后台运行
nohup node server.js > server.log 2>&1 &
```

#### 方式3：使用PM2进程管理
```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "math-game"

# 查看状态
pm2 status

# 开机自启
pm2 startup
pm2 save
```

### 访问地址

服务器启动后，可以通过以下地址访问：

- **本地访问**: http://localhost:3000
- **网络访问**: http://<本地IP>:3000
- **自定义端口**: http://localhost:<PORT>

### 验证部署

访问应用后，请验证以下功能：

1. ✅ **首页显示**: 游戏首页正常加载
2. ✅ **游戏功能**: 数字识别、图案显示、选项选择
3. ✅ **难度调整**: 连续正确时难度提升，错误后难度降低
4. ✅ **错误提示**: 友好的学习提示系统
5. ✅ **多语言**: 中英文切换功能
6. ✅ **响应式**: 手机、平板、桌面适配

### 环境变量配置

```bash
# 设置服务器端口
export PORT=8080

# 同时设置多个变量
PORT=8080 NODE_ENV=production node server.js
```

### 故障排除

#### 端口被占用
```bash
# 检查端口占用
ss -tlnp | grep :3000

# 杀死占用进程
kill -9 <PID>

# 或更换端口
PORT=8080 npm start
```

#### 文件权限问题
```bash
# 确保dist目录存在
ls -la dist/

# 确保有读取权限
chmod -R 755 dist/
```

#### 服务器无法启动
```bash
# 检查Node.js版本
node --version  # 需要 18+

# 检查依赖
npm install

# 检查语法
node -c server.js
```

### 生产环境建议

1. **使用PM2**: 进程管理和自动重启
2. **配置反向代理**: 使用Nginx或Apache作为前端代理
3. **启用HTTPS**: 配置SSL证书（Let's Encrypt）
4. **日志管理**: 配置日志轮转和监控
5. **性能监控**: 使用Node.js性能监控工具

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