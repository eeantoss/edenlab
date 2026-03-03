# GitHub Gist 状态存储配置指南

## ✅ 已更新代码

**提交**: 使用 GitHub Gist 存储状态

- ✅ 更新 `app/api/update-status/route.ts` - 支持写入 Gist
- ✅ 更新 `app/status/route.ts` - 支持读取 Gist

---

## 🔧 配置步骤

### 步骤 1: 创建 GitHub Personal Access Token

1. 访问 GitHub: https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 设置 token 描述：`EdenLab Status Storage`
4. 选择权限：
   - ✅ **gist** (必需)
5. 点击 "Generate token"
6. **复制 token**（只显示一次！）

**Token 示例**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 步骤 2: 创建 GitHub Gist

1. 访问: https://gist.github.com/new
2. 文件名：`edenlab-status.json`
3. 内容：
```json
{
  "state": "idle",
  "message": "等待命令...",
  "updatedAt": "2026-03-03T00:00:00.000Z"
}
```
4. 点击 "Create public gist"
5. **复制 Gist ID**（URL 中的 ID 部分）

**URL 示例**: `https://gist.github.com/eeantoss/914071deaedb60bf6c646ab5e21653a2`
**Gist ID**: `914071deaedb60bf6c646ab5e21653a2`

---

### 步骤 3: 配置 Vercel 环境变量

1. 访问 Vercel 项目: https://vercel.com/your-username/your-project/settings/environment-variables
2. 点击 "Add New"
3. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GIST_ID` | `914071deaedb60bf6c646ab5e21653a2` | 你的 Gist ID |
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxxxxxxxx` | 你的 GitHub Token |
| `STATUS_SECRET` | `your-secret-password` | 状态更新密钥（自己设置） |

4. 点击 "Save"
5. **重新部署项目**

---

### 步骤 4: 测试状态更新

#### 从本地测试

```bash
# 设置环境变量
export EDENLAB_URL=https://edenlab-nine.vercel.app
export STATUS_SECRET=your-secret-password

# 更新状态
python3 /Users/yangxu/.openclaw/workspace/edenlab/edenlab_cloud_update.py working "OpenClaw 正在处理任务..."

# 应该看到：
# ✓ EdenLab 状态已更新: WORKING - OpenClaw 正在处理任务...
#   存储位置: GitHub Gist
```

#### 访问网站查看

1. 访问: https://edenlab-nine.vercel.app
2. 应该看到状态已更新

---

## 📋 环境变量清单

在 `~/.edenlab.env` 文件中配置：

```env
EDENLAB_URL=https://edenlab-nine.vercel.app
STATUS_SECRET=your-secret-password
```

**注意**: `GIST_ID` 和 `GITHUB_TOKEN` 只需要在 Vercel 项目设置中配置，本地不需要。

---

## 🔐 安全建议

1. **不要泄露 Token**: GitHub Token 有完全的 gist 权限
2. **使用强密码**: STATUS_SECRET 应该是一个强密码
3. **定期更新 Token**: 建议每 3 个月更换一次 Token
4. **监控 Gist 访问**: 如果发现异常访问，立即更换 Token

---

## 🧪 验证配置

### 检查 Gist 是否可访问

访问：`https://gist.githubusercontent.com/eeantoss/{GIST_ID}/raw/edenlab-status.json`

应该能看到 JSON 状态数据。

### 检查环境变量

在 Vercel 部署日志中查看：
```
Environment Variables:
  GIST_ID: ***
  GITHUB_TOKEN: ***
  STATUS_SECRET: ***
```

---

## 📊 工作原理

```
OpenClaw (本地)
    │
    │ POST /api/update-status
    │ { state: "working", message: "..." }
    ↓
Vercel (云端)
    │
    │ 验证 STATUS_SECRET
    │
    │ 写入 GitHub Gist
    │ PATCH /gists/{GIST_ID}
    ↓
GitHub Gist
    │
    │ 存储 edenlab-status.json
    ↓
前端读取
    │
    │ GET /status
    │ → 从 Gist 读取
    ↓
显示状态
```

---

## 🎯 优势

- ✅ **完全免费**: GitHub Gist 免费
- ✅ **跨设备访问**: 任何地方都能读取
- ✅ **版本历史**: Gist 自动保存历史版本
- ✅ **简单配置**: 只需 Token 和 Gist ID

---

## ❓ 常见问题

### Q: Gist 是公开的还是私有的？

A: 建议**公开 Gist**，因为：
- 只存储状态信息，不包含敏感数据
- 前端可以直接读取（无需 token）
- 更简单的实现

如果需要隐私，可以使用 Secret Gist，但需要在 API 中添加 token 读取。

### Q: 状态更新频率有限制吗？

A: GitHub API 限制：
- 认证请求: 5,000 次/小时
- 匿名请求: 60 次/小时

EdenLab 使用认证请求，完全够用（每分钟更新 1 次 = 1,440 次/天）。

### Q: 如何切换到不同的 Gist？

A: 更新 Vercel 环境变量 `GIST_ID` 并重新部署即可。

---

## 📞 需要帮助？

如果遇到问题：

1. 检查 GitHub Token 是否有 `gist` 权限
2. 检查 Gist ID 是否正确
3. 查看 Vercel 部署日志
4. 测试 Gist URL 是否可访问

---

**配置完成后，告诉我，我会帮你测试！** 🚀
