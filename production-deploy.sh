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
npm ci --only=production
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

# 启动服务器（临时测试）
echo "🌐 启动测试服务器..."
node server.js &
SERVER_PID=$!
sleep 3

# 测试服务器是否运行
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "✅ 服务器启动成功，测试通过"
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
else
    echo "❌ 服务器测试失败"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "🎉 基础部署完成！"
echo ""
echo "📋 生产环境启动选项："
echo ""
echo "1. 简单启动（前台运行）"
echo "   npm start"
echo "   或"
echo "   node server.js"
echo ""
echo "2. 后台运行（使用nohup）"
echo "   nohup node server.js > server.log 2>&1 &"
echo ""
echo "3. 使用PM2（推荐用于生产环境）"
echo "   # 安装PM2"
echo "   npm install -g pm2"
echo ""
echo "   # 启动应用"
echo "   pm2 start server.js --name \"math-game\""
echo ""
echo "   # 设置开机自启"
echo "   pm2 startup"
echo "   pm2 save"
echo ""
echo "🔧 高级配置："
echo "- 修改端口：PORT=8080 npm start"
echo "- 查看日志：tail -f server.log"
echo "- 监控状态：pm2 monit"
echo ""
echo "🌐 访问地址："
echo "- 本地访问: http://localhost:3000"
echo "- 网络访问: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "📞 技术支持："
echo "如有问题，请查看DEPLOYMENT.md文档或创建GitHub Issue"
echo ""
echo "========================================"
echo "✅ 部署脚本执行完成"