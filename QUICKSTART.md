# 快速开始 - EdenLab 云端部署

## 1. Vercel 部署（5 分钟）

### 导入项目

1. 访问 https://vercel.com
2. 登录 → "Add New" → "Project"
3. 搜索 `eeantoss/edenlab`
4. 点击 "Import"

### 配置环境变量

1. 进入项目设置 → "Environment Variables"
2. 添加：`STATUS_SECRET` = `生成一个随机字符串`

### 配置 Vercel KV

1. 进入 "Storage" → "Create Database"
2. 选择 "KV" → "Create"
3. 复制 KV ID（如果需要）

### 部署

点击 "Deploy"，等待 1-2 分钟。

### 获取 URL

部署完成后，你会得到：
```
https://edenlab-xxx.vercel.app
```

## 2. 配置本地 OpenClaw

### 创建配置文件

```bash
# 创建 ~/.edenlab.env
cat > ~/.edenlab.env << 'EOF'
EDENLAB_URL=https://your-project.vercel.app
STATUS_SECRET=your-secret-token
EOF
```

### 测试连接

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab
python3 edenlab_cloud_update.py working "测试连接"
```

应该看到：
```
✓ EdenLab 状态已更新: WORKING - 测试连接
  客户端: x.x.x.x
  更新时间: 2026-03-02T...
```

## 3. 在 OpenClaw 中使用

### 方式 1：直接命令

```
python3 edenlab_cloud_update.py working "正在处理数据..."
[执行你的任务...]
python3 edenlab_cloud_update.py idle
```

### 方式 2：创建别名（推荐）

在 `~/.zshrc` 中添加：
```bash
# EdenLab 云端状态
alias edenlab='python3 /Users/yangxu/.openclaw/workspace/edenlab/edenlab_cloud_update.py'
```

使用：
```
edenlab working "任务描述"
edenlab idle
```

## 4. 查看状态

访问部署的网站：
```
https://your-project.vercel.app/workspace
```

## 常用命令

```bash
# 工作中
python3 edenlab_cloud_update.py working "正在分析数据..."

# 休息中
python3 edenlab_cloud_update.py idle

# AI 助手工作中
python3 edenlab_cloud_update.py delegating "让 CC 处理"

# 等待中
python3 edenlab_cloud_update.py waiting "等待 API..."
```

## 架构图

```
本地 Mac                         Vercel 云端
├── OpenClaw                  ├── EdenLab 网站
│   └── 发送 HTTP 请求      │   └── 前端页面
│       POST /api/update      │       (读取状态）
│       HTTPS + 认证           └── EdenLab API
│                               └── Vercel KV
│                                   (存储状态）
```

## 故障排除

### 连接失败

1. 检查 EDENLAB_URL 是否正确
2. 检查 STATUS_SECRET 是否正确
3. 检查网络是否通畅

### 状态不更新

1. 刷新页面（Cmd+Shift+R）
2. 检查浏览器控制台
3. 查看网络请求

### 认证失败

1. 检查 Vercel 环境变量
2. 检查本地配置文件
3. 确认 token 一致

## 文档

- **完整部署指南**: `CLOUD_DEPLOY.md`
- **功能说明**: `CLOUD_UPDATE_COMPLETE.md`
- **中文总结**: `CLOUD_SUMMARY.md`

## 成本

- **Vercel 部署**: 免费
- **Vercel KV**: $0.50/月（可选）
- **域名**: 可选

## 完成！

✅ 已实现云端状态更新
✅ 代码已推送到 GitHub
✅ 可以直接在 Vercel 部署
✅ 提供完整的文档和示例

现在你可以在任何地方看到本地 OpenClaw 的状态了！
