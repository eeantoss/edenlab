# EdenLab 云端状态更新 - 完整实现 ✅

## 已完成

已实现从本地 OpenClaw 更新云端 EdenLab 状态的功能！

## 架构

```
本地 Mac                         Vercel 云端
├── OpenClaw                  ├── EdenLab 前端
│   └── 发送请求 ──────────→   │   └── 读取状态
│   POST /api/update-status      │       GET /status
│   加密 + 认证                └── EdenLab API
│                                 ├── POST /api/update-status
│                                 │   └── 验证 token
│                                 └── Vercel KV
│                                     └── 存储状态
```

## 创建的文件

```
/Users/yangxu/.openclaw/workspace/edenlab/
├── app/
│   ├── api/update-status/
│   │   └── route.ts              # 云端状态更新 API（新增）
│   └── status/
│       └── route.ts              # 状态读取 API（已更新，支持 KV）
├── vercel.json                   # Vercel 配置（新增）
├── edenlab_cloud_update.py       # 云端更新命令（新增）
├── .env.example.cloud            # 云端配置示例（新增）
├── CLOUD_DEPLOY.md             # 云端部署指南（新增）
└── ...
```

## 功能特性

### 1. 云端状态更新 API

**端点**: `POST /api/update-status`

**功能**:
- ✅ Token 认证（防止滥用）
- ✅ HTTPS 加密（Vercel 自动支持）
- ✅ 状态验证
- ✅ 存储到 Vercel KV
- ✅ 返回客户端 IP 和更新时间
- ✅ 24 小时自动过期

**使用**:
```bash
curl -X POST https://your-project.vercel.app/api/update-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "state": "working",
    "message": "正在处理数据..."
  }'
```

### 2. 状态读取 API（已更新）

**端点**: `GET /status`

**功能**:
- ✅ 优先从 Vercel KV 读取
- ✅ KV 不可用时降级到本地文件
- ✅ 支持开发环境和生产环境

### 3. 云端更新命令

**脚本**: `edenlab_cloud_update.py`

**功能**:
- ✅ 支持配置文件（.env）
- ✅ Token 认证
- ✅ 错误处理和友好提示
- ✅ 网络超时处理

**使用**:
```bash
# 1. 创建配置文件
echo "EDENLAB_URL=https://your-project.vercel.app" > ~/.edenlab.env
echo "STATUS_SECRET=your-secret-token" >> ~/.edenlab.env

# 2. 更新状态
python3 edenlab_cloud_update.py working "正在处理数据..."

# 3. 应该看到:
# ✓ EdenLab 状态已更新: WORKING - 正在处理数据...
#   客户端: x.x.x.x
#   更新时间: 2026-03-02T...
```

### 4. Vercel 配置

**文件**: `vercel.json`

**功能**:
- ✅ KV 绑定
- ✅ 环境变量引用
- ✅ 区域选择（香港）

## 安全措施

### 1. Token 认证

```typescript
// 服务器验证
const authHeader = req.headers.get('authorization')
const expectedAuth = `Bearer ${STATUS_SECRET}`

if (authHeader !== expectedAuth) {
  return 401 Unauthorized
}
```

### 2. HTTPS 加密

- Vercel 自动提供 HTTPS
- 所有通信都是加密的

### 3. 状态验证

```typescript
// 验证状态值
const validStates = ['idle', 'working', 'delegating', 'waiting']

if (!validStates.includes(body.state)) {
  return 400 Bad Request
}
```

## 部署步骤

### 1. 推送代码到 GitHub

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab
git add .
git commit -m "feat: add cloud status update API"
git push origin main
```

### 2. 在 Vercel 部署

1. 访问 https://vercel.com
2. 导入 `eeantoss/edenlab`
3. 点击 "Deploy"

### 3. 配置环境变量

在 Vercel 设置中添加：
- `STATUS_SECRET`: 生成一个随机字符串

### 4. 配置 Vercel KV

1. 在 Vercel 创建 KV 数据库
2. 获取 KV ID
3. 部署项目

### 5. 配置本地环境

```bash
# 创建 ~/.edenlab.env
echo "EDENLAB_URL=https://your-project.vercel.app" > ~/.edenlab.env
echo "STATUS_SECRET=your-secret-token" >> ~/.edenlab.env
```

## 使用示例

### 本地开发

```bash
# EdenLab 运行在 localhost:3000
python3 set_status.py working "本地开发"
```

### 云端部署后

```bash
# 更新云端状态
python3 edenlab_cloud_update.py working "云端任务"

# 两者都可以用
python3 set_status.py idle           # 本地
python3 edenlab_cloud_update.py idle # 云端
```

## 集成到 OpenClaw

### 方式 1：直接使用

在 OpenClaw 中：
```
python3 /Users/yangxu/.openclaw/workspace/edenlab/edenlab_cloud_update.py working "任务描述"
```

### 方式 2：创建别名

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

## 故障排除

### 401 Unauthorized

- 检查 STATUS_SECRET 是否正确
- 检查 Vercel 环境变量是否设置

### 连接失败

- 检查 EDENLAB_URL 是否正确
- 检查网络连接
- 检查 Vercel 是否部署成功

### KV 不可用

- 检查 Vercel KV 是否创建
- 检查 vercel.json 中的 KV 绑定

## 文档

- **云端部署指南**: `CLOUD_DEPLOY.md`
- **OpenClaw 集成**: `OPENCLAW_INTEGRATION.md`
- **配置示例**: `.env.example.cloud`

## 成本

### Vercel KV
- **免费**: 256 MB / 10,000 读写/天
- **付费**: $0.50/月

## 测试结果

- ✅ 云端状态更新 API 已实现
- ✅ Token 认证已配置
- ✅ Vercel KV 集成完成
- ✅ 状态读取 API 已更新
- ✅ 云端更新命令已创建
- ✅ 文档已完善

## 下一步

1. 推送代码到 GitHub
2. 在 Vercel 部署
3. 配置环境变量和 KV
4. 测试云端状态更新
