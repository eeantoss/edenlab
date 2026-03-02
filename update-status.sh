#!/bin/bash

# Dean 工作状态更新脚本

# 配置
API_URL="http://localhost:3000/status"
SECRET="your-secret-key-here"  # 修改为你的 STATUS_SECRET

# 状态定义
states=(
  "idle:休息中"
  "working:工作中"
  "delegating:Claude Code 干活"
  "waiting:等待中"
)

echo "======================================"
echo "🕹️ Dean 工作状态更新"
echo "======================================"
echo ""

# 显示选项
echo "选择状态:"
for i in "${!states[@]}"; do
  IFS=':' read -r key name <<< "${states[$i]}"
  echo "  $((i+1)). $name"
done

echo ""
read -p "输入选项 (1-4): " choice

# 获取选中的状态
if [ "$choice" -ge 1 ] && [ "$choice" -le "${#states[@]}" ]; then
  index=$((choice-1))
  IFS=':' read -r state name <<< "${states[$index]}"

  echo ""
  read -p "输入当前任务 (可选): " message

  # 发送请求
  if [ -z "$message" ]; then
    message="执行任务中..."
  fi

  echo ""
  echo "📤 更新状态: $name"
  echo "📝 任务: $message"
  echo ""

  response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"secret\":\"$SECRET\",\"state\":\"$state\",\"message\":\"$message\"}")

  if echo "$response" | grep -q '"ok":true'; then
    echo "✅ 状态更新成功！"
    echo "🌐 查看状态: http://localhost:3000/workspace"
  else
    echo "❌ 状态更新失败"
    echo "错误: $response"
  fi
else
  echo "❌ 无效选项"
fi

echo ""
echo "======================================"
