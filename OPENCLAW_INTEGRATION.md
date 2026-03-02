# OpenClaw 状态集成

## 简介

这个集成允许 OpenClaw 实时更新 EdenLab 工作状态页面，显示当前正在执行的任务。

## 工具

### 1. set_status.py - 状态设置工具

设置 EdenLab 工作状态。

```bash
# 设置为工作状态
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py working "正在处理数据..."

# 设置为空闲状态
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py idle

# 设置为委托状态
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py delegating "AI 助手正在处理"

# 设置为等待状态
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py waiting "等待执行结果"
```

### 2. openclaw_sync.py - 自动状态同步

自动监控 OpenClaw 状态并同步到 EdenLab。

```bash
# 启动自动同步（每 10 秒检查一次）
python3 /Users/yangxu/.openclaw/workspace/edenlab/openclaw_sync.py
```

## 状态类型

| 状态 | 说明 | 默认消息 |
|------|------|----------|
| idle | 休息中 | 等待命令... |
| working | 工作中 | 正在处理任务... |
| delegating | Claude Code 干活 | AI 助手正在处理... |
| waiting | 等待中 | 等待执行结果... |

## 在 OpenClaw 中使用

### 方法 1：手动设置状态

在 OpenClaw 任务开始和结束时手动更新状态：

```bash
# 任务开始
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py working "正在分析数据..."

# ... 执行任务 ...

# 任务完成
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py idle
```

### 方法 2：使用函数封装

创建一个便捷的函数来管理状态：

```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
edenlab_status() {
    python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py "$@"
}
```

然后可以简化使用：

```bash
edenlab_status working "任务描述"
# ... 执行任务 ...
edenlab_status idle
```

### 方法 3：自动化集成（推荐）

创建一个任务包装脚本，自动管理状态：

```bash
#!/bin/bash
# run_with_status.sh - 任务包装脚本

TASK_DESC="$1"
COMMAND="$2"

# 开始任务
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py working "$TASK_DESC"

# 执行任务
eval $COMMAND
EXIT_CODE=$?

# 任务完成
if [ $EXIT_CODE -eq 0 ]; then
    python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py idle
else
    python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py waiting "任务执行失败"
fi

exit $EXIT_CODE
```

使用示例：

```bash
./run_with_status.sh "分析代码" "npm run lint"
./run_with_status.sh "运行测试" "npm test"
```

## API 接口

### POST /status

更新工作状态。

请求体：
```json
{
  "state": "working|idle|delegating|waiting",
  "message": "任务描述"
}
```

响应：
```json
{
  "ok": true
}
```

### GET /status

获取当前工作状态。

响应：
```json
{
  "state": "idle",
  "message": "等待命令...",
  "updatedAt": "2026-03-02T17:20:00.000Z"
}
```

## 故障排除

### EdenLab 未运行

如果看到 "连接失败" 错误，确保 EdenLab 开发服务器正在运行：

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab
npm run dev
```

### 端口冲突

如果 3000 端口被占用，可以修改 EdenLab 的端口：

```bash
PORT=3001 npm run dev
```

然后更新 `EDENLAB_STATUS_API` 环境变量：

```bash
export EDENLAB_STATUS_API="http://localhost:3001/status"
```

## 项目结构

```
edenlab/
├── app/
│   └── status/
│       └── route.ts          # 状态 API（本地存储）
├── dean-status.json           # 状态数据文件
├── set_status.py             # 状态设置工具
├── openclaw_sync.py          # 自动状态同步
└── OPENCLAW_INTEGRATION.md   # 本文档
```

## 开发者

Oscar - 2026-03-02
