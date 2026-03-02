# EdenLab 云端部署指南

## 部署到 Vercel

### 步骤 1：准备项目

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab

# 确保 Vercel.json 配置正确
cat vercel.json

# 确保 API 文件存在
ls app/api/update-status/route.ts
ls app/status/route.ts
```

### 步骤 2：在 Vercel 部署

1. 访问 https://vercel.com
2. 登录并点击 "Add New..." → "Project"
3. 导入 `eeantoss/edenlab`
4. 点击 "Import"

### 步骤 3：配置环境变量

在 Vercel 项目设置中：

1. 进入 "Settings" → "Environment Variables"
2. 添加以下变量：

| 名称 | 值 | 说明 |
|------|-----|------|
| `STATUS_SECRET` | `your-secret-token` | 状态更新的认证密钥（生成一个随机字符串） |

3. 点击 "Save"

### 步骤 4：配置 Vercel KV

1. 在 Vercel 项目中进入 "Storage"
2. 点击 "Create Database"
3. 选择 "KV"
4. 点击 "Create"
5. 复制 KV ID

6. 更新 `vercel.json`（如果需要）：
   ```json
   {
     "kv": {
       "edenlabStatusKV": {
         "binding": "edenlabStatusKV"
       }
     }
   }
   ```

7. 重新部署项目

### 步骤 5：获取部署 URL

部署完成后，Vercel 会提供类似：
```
https://edenlab-xxx.vercel.app
```

### 步骤 6：配置本地 OpenClaw

创建配置文件：

```bash
# 在 ~/.edenlab.env 或 edenlab/.env
echo "EDENLAB_URL=https://your-project.vercel.app" > ~/.edenlab.env
echo "STATUS_SECRET=your-secret-token" >> ~/.edenlab.env
```

### 步骤 7：测试连接

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab

# 测试状态更新
python3 edenlab_cloud_update.py working "测试云端更新"

# 应该看到输出:
# ✓ EdenLab 状态已更新: WORKING - 测试云端更新
#   客户端: unknown
#   更新时间: 2026-03-02T...
```

## 工作原理

### 本地开发

```
本地 Mac
├── EdenLab (localhost:3000)
├── OpenClaw
└── 更新: POST localhost:3000/status (本地文件存储)
```

### Vercel 部署

```
本地 Mac                    Vercel 云端
├── OpenClaw              ├── EdenLab 前端
│   └── POST /api/update  │   └── GET /status (从 KV 读取)
│       Bearer token         └── EdenLab API
│                           └── POST /api/update-status
│                               ├── 验证 token
│                               └── 写入 Vercel KV
```

## 安全性

### 1. Token 认证

```bash
# 请求头
Authorization: Bearer your-secret-token

# 服务器验证
if (token !== STATUS_SECRET) {
  return 401 Unauthorized
}
```

### 2. HTTPS 加密

- Vercel 自动提供 HTTPS
- 所有通信都是加密的

### 3. CORS

前端可以从任何域名读取状态：
```typescript
headers: {
  'Access-Control-Allow-Origin': '*'
}
```

## 常见问题

### Q: 更新失败：401 Unauthorized

A: 检查以下几点：
- STATUS_SECRET 是否正确
- Vercel 环境变量是否设置
- 配置文件是否正确

### Q: 状态不更新

A: 检查以下几点：
- EdenLab URL 是否正确
- 网络是否通畅
- Vercel KV 是否配置

### Q: 开发环境能用，部署后不能用

A: 可能的原因：
- 环境变量未配置
- KV 未绑定
- 防火墙阻止

## API 端点

### POST /api/update-status

更新状态（云端）

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-secret-token"
}
```

**Body:**
```json
{
  "state": "working",
  "message": "正在处理数据..."
}
```

**Response:**
```json
{
  "success": true,
  "status": {
    "state": "working",
    "message": "正在处理数据...",
    "updatedAt": "2026-03-02T...",
    "clientIP": "x.x.x.x"
  },
  "message": "Status updated successfully"
}
```

### GET /status

读取状态（前端使用）

**Response:**
```json
{
  "state": "idle",
  "message": "等待命令...",
  "updatedAt": "2026-03-02T..."
}
```

## 成本

### Vercel KV
- 免费层：256 MB 存储 / 10,000 读写/天
- 付费层：$0.50/月 / 256 MB

### 推荐
- 开发/测试：使用免费层
- 生产环境：使用付费层（$0.50/月）

## 更新状态

修改代码后：
```bash
git add .
git commit -m "描述改动"
git push origin main
```

Vercel 会自动检测到新的 commit 并重新部署。

## 相关文档

- Vercel KV: https://vercel.com/docs/storage/vercel-kv
- Vercel 环境变量: https://vercel.com/docs/projects/environment-variables
- EdenLab 集成: `OPENCLAW_INTEGRATION.md`
