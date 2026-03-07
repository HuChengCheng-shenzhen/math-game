#!/bin/bash
set -e

echo "🔧 GitHub 部署脚本 - 数感乐园数学游戏"
echo "========================================"

# 检查git配置
echo "📋 检查当前git配置..."
git config --list | grep -E "user\.(name|email)" || echo "⚠️  没有找到git用户配置"

# 检查远程仓库配置
echo "🌐 检查远程仓库配置..."
git remote -v || echo "没有配置远程仓库"

# 提示用户输入GitHub信息
echo ""
echo "📝 请输入以下信息："
read -p "GitHub用户名: " GITHUB_USERNAME
read -p "GitHub仓库名 (默认: math-game): " REPO_NAME
REPO_NAME=${REPO_NAME:-math-game}
read -p "GitHub个人访问令牌 (需要repo权限): " GITHUB_TOKEN

# 创建GitHub仓库
echo ""
echo "🚀 正在创建GitHub仓库..."
REPO_URL="https://api.github.com/user/repos"
CREATE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "{\"name\":\"$REPO_NAME\",\"private\":false,\"auto_init\":false}" \
  $REPO_URL)

# 检查是否创建成功
if echo "$CREATE_RESPONSE" | grep -q "Bad credentials"; then
  echo "❌ 认证失败，请检查GitHub令牌"
  exit 1
elif echo "$CREATE_RESPONSE" | grep -q "name already exists"; then
  echo "⚠️  仓库已存在，跳过创建"
else
  echo "✅ 仓库创建成功"
fi

# 设置远程仓库
echo ""
echo "🔗 配置远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# 推送代码
echo ""
echo "⬆️  推送代码到GitHub..."
if git push -u origin main; then
  echo "✅ 代码推送成功"
else
  echo "❌ 代码推送失败，尝试使用SSH方式..."
  git remote set-url origin "git@github.com:$GITHUB_USERNAME/$REPO_NAME.git"
  if git push -u origin main; then
    echo "✅ 使用SSH推送成功"
  else
    echo "❌ SSH推送也失败，请检查网络和SSH密钥"
    exit 1
  fi
fi

# 显示GitHub Pages信息
echo ""
echo "🌐 GitHub Pages 部署信息："
echo "=========================="
echo "1. 访问仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "2. 进入 Settings → Pages"
echo "3. 设置 Source: Branch: gh-pages, Folder: / (root)"
echo "4. 保存后等待自动部署（约1-3分钟）"
echo "5. 访问地址: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "📊 查看部署状态："
echo "- GitHub Actions: https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions"
echo "- 构建日志：查看最近的工作流运行"
echo ""
echo "✅ 部署脚本完成！请按照上述步骤启用GitHub Pages。"