---
name: edenlab-status
description: Dean 工作状态管理 - 自动更新 EdenLab 的工作状态显示

user-invocable: true
metadata:
  openclaw:
    requires:
      env:
        - EDENLAB_SECRET
    primaryEnv: EDENLAB_SECRET
    emoji: "\U0001F959"
  version: 1.0.0
---

# EdenLab 工作状态管理

## 概述

自动更新 EdenLab (http://localhost:3000/workspace) 上的 Dean 工作状态。

## 环境变量

在 OpenClaw 配置中添加：

```bash
export EDENLAB_SECRET="your-secret-key-here"
```

**重要：** `EDENLAB_SECRET` 必须与 EdenLab 项目中配置的 `STATUS_SECRET` 一致。

## API 端点

### 更新工作状态

**URL**: `POST http://localhost:3000/status`

**请求体**:
```json
{
  "secret": "your-secret-key",
  "state": "idle|working|delegating|waiting",
  "message": "当前任务描述（可选）"
}
```

**响应**:
```json
{
  "ok": true
}
```

## 工作状态

| 状态 | 英文 | 说明 |
|------|------|------|
| 休息中 | idle | 在休息室溜达，抽根烟等命令 |
| 工作中 | working | 坐在电脑前死磕代码 |
| Claude Code 干活 | delegating | 让 CC 写代码，我站旁边盯着 |
| 等待中 | waiting | 盯着屏幕等执行结果 |

## 使用示例

在 OpenClaw 对话中：

```
设置为休息中
```

```
更新为工作中，正在部署项目
```

```
设置为委托状态，让 CC 帮忙
```

```
设置为等待中，等待执行结果
```

## 技术实现

EdenLab 项目通过 GitHub Gist 存储状态，前端每5秒自动轮询更新。

**配置文件**: `/Users/yangxu/.openclaw/workspace/edenlab/.env.local`

```
GITHUB_TOKEN=ghp_xxxxxxxxx
STATUS_SECRET=your-secret-key
```

## 故障排查

### 问题1：状态不更新
- 检查 `EDENLAB_SECRET` 是否配置
- 检查 EdenLab 服务是否运行（http://localhost:3000）
- 查看 EdenLab 控制台日志

### 问题2：访问被拒绝
- 检查 `EDENLAB_SECRET` 与 EdenLab 的 `STATUS_SECRET` 是否一致
- 查看 EdenLab 的 app/status/route.ts 权限验证

---

**项目地址**: https://github.com/dongzhiyiden/edenlab
**本地部署**: http://localhost:3000
**工作状态**: http://localhost:3000/workspace
