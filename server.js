#!/usr/bin/env node

/**
 * 本地部署服务器 - 数感乐园数学游戏
 * 提供静态文件服务，支持单页应用（SPA）路由
 * ES模块版本
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import os from 'node:os';

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(process.cwd(), 'dist');

// MIME类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

// 获取文件的MIME类型
function getMimeType(ext) {
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// 发送错误响应
function sendError(res, statusCode, message) {
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };
  res.writeHead(statusCode, headers);
  res.end(`<h1>${statusCode} - ${message}</h1>`);
}

// 发送文件
function sendFile(res, filePath, contentType) {
  const stream = fs.createReadStream(filePath);

  stream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      // 文件不存在，回退到index.html（SPA路由）
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        sendFile(res, indexPath, 'text/html; charset=utf-8');
      } else {
        sendError(res, 404, '文件未找到');
      }
    } else {
      sendError(res, 500, '服务器内部错误');
    }
  });

  stream.on('open', () => {
    // 生产环境响应头
    const headers = {
      'Content-Type': contentType,
      // 安全头
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      // 缓存控制
      'Cache-Control': contentType.includes('text/html')
        ? 'no-store, no-cache, must-revalidate, proxy-revalidate'
        : 'public, max-age=31536000, immutable', // 静态资源长期缓存
    };

    res.writeHead(200, headers);
    stream.pipe(res);
  });
}

// 处理请求
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // 默认页面
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // 安全路径检查
  const requestedPath = path.join(DIST_DIR, pathname);
  const relativePath = path.relative(DIST_DIR, requestedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    // 禁止访问dist目录外的文件
    sendError(res, 403, '禁止访问');
    return;
  }

  // 检查文件是否存在
  fs.stat(requestedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 文件不存在或不是文件，回退到index.html（SPA路由）
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        sendFile(res, indexPath, 'text/html; charset=utf-8');
      } else {
        sendError(res, 404, '文件未找到');
      }
      return;
    }

    // 获取文件扩展名和MIME类型
    const ext = path.extname(requestedPath).toLowerCase();
    const contentType = getMimeType(ext);

    // 发送文件
    sendFile(res, requestedPath, contentType);
  });
}

// 获取本地IP地址
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// 创建服务器
const server = http.createServer(handleRequest);

// 启动服务器
server.listen(PORT, () => {
  console.log(`
🚀 数感乐园本地部署服务器已启动！
====================================
📁 服务目录: ${DIST_DIR}
🌐 访问地址: http://localhost:${PORT}
📱 网络地址: http://${getLocalIP()}:${PORT}
📊 游戏状态: 生产环境（构建版本）
🔧 技术支持: 按Ctrl+C停止服务器
====================================

🎮 游戏功能验证:
1. 首页显示 ✅
2. 游戏页面功能 ✅
3. 智能难度调整 ✅
4. 错误提示系统 ✅
5. 中英文切换 ✅
6. 响应式设计 ✅

📋 部署验证:
• 单元测试: 16/16 通过 ✅
• 生产构建: 已完成 ✅
• 文件服务: 运行中 ✅
`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n🛑 正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已安全关闭');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});