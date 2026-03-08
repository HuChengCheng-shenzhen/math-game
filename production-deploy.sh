#!/bin/bash
#
# 数感乐园生产环境部署脚本
# 在您的生产服务器上运行此脚本以部署游戏
#

set -e  # 出错时退出

echo "🚀 开始部署数感乐园到生产环境..."
echo "========================================"

# 检查Node.js版本
echo "📦 检查Node.js版本..."
node_version=$(node --version | cut -d'.' -f1 | tr -d 'v')
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js版本需要18或更高，当前版本: $(node --version)"
    exit 1
fi
echo "✅ Node.js版本: $(node --version)"

# 检查npm
echo "📦 检查npm..."
npm --version >/dev/null 2>&1 || { echo "❌ npm未安装"; exit 1; }
echo "✅ npm版本: $(npm --version)"

# 安装依赖
echo "📦 安装项目依赖..."
npm ci
echo "✅ 依赖安装完成"

# 构建项目
echo "🔨 构建生产版本..."
npm run build
echo "✅ 构建完成"

# 检查dist目录
echo "📁 验证构建输出..."
if [ ! -d "dist" ]; then
    echo "❌ dist目录不存在，构建失败"
    exit 1
fi
echo "✅ dist目录包含: $(ls -1 dist/ | wc -l) 个文件"

# 启动测试服务器（使用生产端口3001）
echo "🌐 启动测试服务器（端口3001）..."
PORT=3001 node server.js &
SERVER_PID=$!
sleep 3

# 测试服务器是否运行
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 | grep -q "200"; then
    echo "✅ 服务器启动成功，测试通过（端口3001）"
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
else
    echo "❌ 服务器测试失败（端口3001）"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "🎉 基础部署完成！"
echo ""
echo "🚀 自动启动生产服务（端口3001）..."

# 检查并安装PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装PM2进程管理器..."
    if npm install -g pm2; then
        echo "✅ PM2安装完成"
    else
        echo "❌ PM2安装失败，尝试使用sudo..."
        echo "请手动安装PM2: sudo npm install -g pm2"
        echo "然后重新运行部署脚本"
        exit 1
    fi
else
    echo "✅ PM2已安装"
fi

# 验证PM2安装
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2命令不可用，请确保PM2正确安装"
    exit 1
fi

# 停止并删除现有的math-game服务（如果存在）
if pm2 describe math-game &> /dev/null; then
    echo "🔄 停止现有math-game服务..."
    pm2 stop math-game
    pm2 delete math-game
    echo "✅ 现有服务已停止"
fi

# 使用PM2启动生产服务（端口3001）
echo "🚀 启动生产服务（端口3001）..."
PORT=3001 pm2 start server.js --name "math-game"

# 保存PM2配置
echo "💾 保存PM2配置..."
pm2 save

# 尝试设置开机自启
echo "🔄 尝试设置开机自启..."
if pm2 startup &> /dev/null; then
    echo "✅ 开机自启配置完成"
else
    echo "⚠️  开机自启配置可能需要root权限，请手动执行: sudo pm2 startup"
fi

echo ""
echo "📊 服务状态："
pm2 status math-game --silent || echo "⚠️ 服务状态检查失败"

echo ""
echo "🔧 管理命令："
echo "- 查看日志: pm2 logs math-game"
echo "- 重启服务: pm2 restart math-game"
echo "- 停止服务: pm2 stop math-game"
echo "- 监控面板: pm2 monit"

echo ""
echo "🌐 访问地址："
echo "- 本地访问: http://localhost:3001"
echo "- 网络访问: http://$(hostname -I | awk '{print $1}'):3001"
echo "- 生产环境专用端口: 3001（与本地开发区分）"

echo ""
echo "📞 技术支持："
echo "如有问题，请查看DEPLOYMENT.md文档或创建GitHub Issue"
echo ""
echo "========================================"
echo "✅ 部署脚本执行完成"