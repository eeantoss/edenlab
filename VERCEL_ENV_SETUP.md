# Vercel 环境变量配置指南

## ✅ 问题已解决

**错误**: Environment Variable "STATUS_SECRET" references Secret "status-secret", which does not exist.

**原因**: `vercel.json` 中引用了一个不存在的 Vercel Secret。

**修复**: 移除了 Secret 引用，改为在 Vercel 项目设置中手动配置环境变量。

---

## 🚀 部署步骤

### 1. 重新部署

现在 `vercel.json` 已经修复，可以重新部署了：

1. 访问 Vercel 项目页面
2. 点击 **"Deployments"** 标签
3. 找到最新的部署，点击 **"Redeploy"**
4. 这次应该会成功 ✅

### 2. 配置环境变量（可选）

如果需要使用状态更新功能，需要设置环境变量：

#### 方法一：在 Vercel 项目设置中配置

1. 访问 Vercel 项目页面
2. 点击 **"Settings"** → **"Environment Variables"**
3. 点击 **"Add New"**
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `STATUS_SECRET` | `your-secret-password` | 状态更新认证密钥（自己设置一个） |

5. 点击 **"Save"**
6. 重新部署项目

#### 方法二：使用 .env 文件（本地开发）

在项目根目录创建 `.env.local` 文件：

```env
STATUS_SECRET=your-secret-password
```

---

## 🧪 测试状态更新功能

配置好环境变量后，可以测试状态更新：

### 1. 在本地测试

```bash
# 更新状态为工作中
python3 edenlab_cloud_update.py working "正在处理数据..."

# 更新状态为空闲
python3 edenlab_cloud_update.py idle
```

### 2. 在 Vercel 环境测试

```bash
# 设置环境变量
export EDENLAB_URL=https://your-project.vercel.app
export STATUS_SECRET=your-secret-password

# 更新状态
python3 edenlab_cloud_update.py working "测试"
```

---

## 📋 完整的环境变量清单

### 可选环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `STATUS_SECRET` | `default-secret-change-in-production` | 状态更新认证密钥 |

---

## 🔐 安全建议

1. **不要使用默认的 SECRET**: 在生产环境中，设置一个强密码
2. **使用随机生成的 SECRET**: 可以用这个命令生成：

```bash
# macOS/Linux
openssl rand -base64 32

# 或使用 Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

3. **不要提交 .env 文件**: `.env` 和 `.env.local` 应该在 `.gitignore` 中

---

## 🎯 下一步

1. ✅ 重新部署 Vercel 项目（现在应该成功）
2. ⚙️ 配置环境变量（如果需要状态更新功能）
3. 🧪 测试状态更新功能
4. 📊 访问 EdenLab 网站

---

## 📞 常见问题

### Q: 为什么之前引用 Secret 会失败？

A: `@secret-name` 语法用于引用 Vercel Secret，但这个 Secret 必须先在 Vercel 项目设置中创建。如果 Secret 不存在，部署就会失败。

### Q: 我可以不用环境变量吗？

A: 可以！如果不使用状态更新功能，环境变量不是必需的。代码中有默认值：`default-secret-change-in-production`

### Q: 如何验证环境变量是否生效？

A: 在 Vercel 项目设置中查看，或者在部署日志中查看环境变量列表。

---

**最后更新**: 2026-03-03
