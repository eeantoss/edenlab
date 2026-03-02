# EdenLab 部署说明

## 🎉 部署完成！

### 访问地址
- **主页**: http://localhost:3000
- **工作状态**: http://localhost:3000/workspace

---

## 📖 项目介绍

**EdenLab - 东之伊甸的 AI & Web3 工具站**

### 功能模块

1. **🕹️ Dean 的工作状态** (已上线)
   - 实时查看 AI 助手在干什么
   - 用像素画展示不同状态
   - 每 5 秒自动刷新

2. **🔍 Smart Money Tracker** (即将上线)
   - 实时追踪 Solana 聪明钱钱包动向

3. **📊 Token Analytics** (已上线)
   - Pump.fun 毕业代币数据分析

4. **📰 Web3 Daily** (即将上线)
   - 每日 Web3 要闻摘要

---

## ⚙️ 配置步骤

### 1. 创建 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选权限：`gist` (read/write)
4. 生成后复制 Token

### 2. 配置环境变量

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab

# 创建环境变量文件
cp .env.local.example .env.local

# 编辑配置
nano .env.local
```

填入配置：

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
STATUS_SECRET=your-random-secret-key
```

**重要！**
- `GITHUB_TOKEN` 必须有 gist 权限
- `STATUS_SECRET` 是你自定义的密钥，防止未授权更新

### 3. 重启开发服务器

```bash
# 停止当前服务 (Ctrl+C)
# 重新启动
npm run dev
```

---

## 🎨 使用状态更新功能

### 方法1: Bash 脚本

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab

# 修改 SECRET
nano update-status.sh

# 运行脚本
bash update-status.sh
```

### 方法2: Python 脚本

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab

# 修改 SECRET
nano update-status.py

# 运行脚本
python3 update-status.py
```

### 方法3: API 直接调用

```bash
# 休息中
curl -X POST http://localhost:3000/status \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","state":"idle","message":"休息中"}'

# 工作中
curl -X POST http://localhost:3000/status \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","state":"working","message":"正在写代码"}'

# Claude Code 干活
curl -X POST http://localhost:3000/status \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","state":"delegating","message":"让 CC 帮忙部署项目"}'

# 等待中
curl -X POST http://localhost:3000/status \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret","state":"waiting","message":"等待执行结果"}'
```

---

## 📊 状态说明

### 4 种工作状态

| 状态 | 英文 | 说明 |
|------|------|------|
| 🟦 休息中 | idle | 在休息室溜达，抽根烟等命令 |
| 🔵 工作中 | working | 坐在电脑前死磕代码 |
| 🟪 Claude Code 干活 | delegating | 让 CC 写代码，我站旁边盯着 |
| 🟧 等待中 | waiting | 盯着屏幕等执行结果 |

---

## 🔧 技术架构

### 数据流

```
状态更新 (POST /status)
    ↓
GitHub Gist (dean-status.json)
    ↓
状态读取 (GET /status)
    ↓
前端展示 (PixelGame.tsx)
```

### 刷新机制

- 前端每 5 秒自动轮询 `/status`
- 状态存储在 GitHub Gist，可以跨设备访问
- 使用时间戳防缓存

---

## 🚀 后续扩展

### 可以添加的功能

1. **历史记录** - 记录工作时间统计
2. **多角色** - 支持多个 AI 助手的独立状态
3. **Webhook** - 通过外部 API 自动更新状态
4. **移动端** - 优化手机访问体验
5. **实时通知** - 状态变化时推送通知

---

## 📝 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start

# 代码检查
npm run lint
```

---

## ❓ 常见问题

### Q: 为什么状态不更新？
A: 检查以下几点：
1. `.env.local` 文件中的 `GITHUB_TOKEN` 是否正确
2. Token 是否有 gist 权限
3. `STATUS_SECRET` 是否匹配
4. 查看浏览器控制台是否有错误

### Q: 为什么显示"等待命令..."？
A: Gist 中没有状态数据，首次需要手动更新一次。

### Q: 可以用 OpenClaw 自动更新状态吗？
A: 可以！在 OpenClaw 中配置，每次任务开始/结束自动调用 API。

---

## 📞 反馈

项目地址: https://github.com/dongzhiyiden/edenlab

---

**享受你的 Dean 工作状态追踪器！** 🎉
