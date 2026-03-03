#!/bin/bash

# EdenLab Gist 配置助手
# 使用方法: bash setup-gist.sh

echo "=========================================="
echo "  EdenLab GitHub Gist 配置助手"
echo "=========================================="
echo ""

# 步骤 1: 创建 GitHub Token
echo "📋 步骤 1: 创建 GitHub Personal Access Token"
echo ""
echo "1. 访问: https://github.com/settings/tokens"
echo "2. 点击 'Generate new token (classic)'"
echo "3. 设置描述: EdenLab Status Storage"
echo "4. 勾选 'gist' 权限"
echo "5. 点击 'Generate token'"
echo "6. 复制 token（只显示一次！）"
echo ""
read -p "✍️  请输入你的 GitHub Token: " github_token

if [ -z "$github_token" ]; then
    echo "❌ GitHub Token 不能为空"
    exit 1
fi

echo ""

# 步骤 2: 创建 Gist
echo "📋 步骤 2: 创建 GitHub Gist"
echo ""
echo "1. 访问: https://gist.github.com/new"
echo "2. 文件名: edenlab-status.json"
echo "3. 内容 (已准备好，复制下面的内容):"
echo ""
echo "```json"
echo '{'
echo '  "state": "idle",'
echo '  "message": "等待命令...",'
echo '  "updatedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
echo '}'
echo '```'
echo ""
echo "4. 点击 'Create public gist'"
echo "5. 从 URL 中复制 Gist ID"
echo ""
echo "示例 URL: https://gist.github.com/eeantoss/914071deaedb60bf6c646ab5e21653a2"
echo "Gist ID: 914071deaedb60bf6c646ab5e21653a2"
echo ""
read -p "✍️  请输入你的 Gist ID: " gist_id

if [ -z "$gist_id" ]; then
    echo "❌ Gist ID 不能为空"
    exit 1
fi

echo ""

# 步骤 3: 生成 STATUS_SECRET
echo "📋 步骤 3: 生成 STATUS_SECRET"
echo ""
status_secret=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo "✅ 生成的密钥: $status_secret"
echo ""
read -p "是否使用此密钥？(Y/n): " use_generated

if [ "$use_generated" = "n" ] || [ "$use_generated" = "N" ]; then
    read -p "✍️  请输入自定义密钥: " status_secret
fi

echo ""

# 步骤 4: 保存到环境文件
echo "📋 步骤 4: 保存配置"
echo ""

# 创建本地环境文件
cat > ~/.edenlab.env << EOF
EDENLAB_URL=https://edenlab-nine.vercel.app
STATUS_SECRET=$status_secret
EOF

echo "✅ 本地配置已保存到: ~/.edenlab.env"

# 创建 Vercel 环境变量配置文件
mkdir -p /Users/yangxu/.openclaw/workspace/edenlab/.env-vercel
cat > /Users/yangxu/.openclaw/workspace/edenlab/.env-vercel/production.env << EOF
GIST_ID=$gist_id
GITHUB_TOKEN=$github_token
STATUS_SECRET=$status_secret
EOF

echo "✅ Vercel 环境变量已保存"

echo ""
echo "=========================================="
echo "  配置完成！"
echo "=========================================="
echo ""
echo "📝 下一步："
echo ""
echo "1. 在 Vercel 项目中添加环境变量："
echo "   - 访问: https://vercel.com/your-username/your-project/settings/environment-variables"
echo "   - 添加以下变量："
echo ""
echo "   GIST_ID=$gist_id"
echo "   GITHUB_TOKEN=$github_token"
echo "   STATUS_SECRET=$status_secret"
echo ""
echo "2. 重新部署 Vercel 项目"
echo ""
echo "3. 测试状态更新："
echo ""
echo "   python3 /Users/yangxu/.openclaw/workspace/edenlab/edenlab_cloud_update.py working \"测试\""
echo ""
echo "=========================================="
