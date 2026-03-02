# EdenLab Vercel 部署指南

## 项目信息

- **本地路径**: `/Users/yangxu/.openclaw/workspace/edenlab`
- **GitHub 仓库**: https://github.com/eeantoss/edenlab.git
- **当前状态**: 代码已推送到 GitHub

## 部署方法

### 方法 1：通过 Vercel 直接部署（推荐）

1. **登录 Vercel**
   - 访问：https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 搜索并选择 `eeantoss/edenlab`
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Next.js
   - Root Directory: `./` (保持默认)
   - Build Command: `npm run build` (自动检测)
   - Output Directory: `.next` (自动检测)
   - Install Command: `npm install` (自动检测)

4. **环境变量（可选）**
   - 如果需要，可以添加环境变量：
     - `GITHUB_TOKEN`: GitHub Token（如果使用 Gist 存储）
   - 当前使用本地存储，不需要环境变量

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 1-2 分钟）

6. **访问**
   - 部署完成后，Vercel 会提供一个 URL
   - 例如：`https://edenlab-xxx.vercel.app`

### 方法 2：手动推送后部署

1. **配置 GitHub 认证**
   
   使用 Personal Access Token：
   - 访问：https://github.com/settings/tokens
   - 生成新 Token，选择 `repo` 权限
   - 复制 Token

2. **推送代码**
   ```bash
   cd /Users/yangxu/.openclaw/workspace/edenlab
   
   # 使用 Token 认证
   git remote set-url origin https://YOUR_TOKEN@github.com/dongzhiyiden/edenlab.git
   git push origin main
   ```

   或使用 SSH（推荐）：
   ```bash
   # 生成 SSH 密钥
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # 添加到 GitHub
   # 复制 ~/.ssh/id_ed25519.pub 内容
   # 访问 https://github.com/settings/keys 添加
   
   # 使用 SSH URL
   git remote set-url origin git@github.com:dongzhiyiden/edenlab.git
   git push origin main
   ```

3. **在 Vercel 部署**
   - 按照"方法 1"的步骤操作
   - 代码已经推送到 GitHub，可以直接导入

## 部署后的注意事项

### 1. 状态存储问题

**问题**：Vercel 每次重新部署，`dean-status.json` 文件会被清空，导致状态丢失。

**解决方案**：
- 方案 A：使用 Vercel KV（推荐，付费）
- 方案 B：使用 Redis（如 Upstash，有免费层）
- 方案 C：使用外部数据库（如 PostgreSQL、MongoDB）
- 方案 D：继续使用本地存储（状态在部署后重置）

### 2. Star-Office-UI 嵌入

**问题**：`/workspace` 页面的 iframe 指向 `http://127.0.0.1:18991/`，这在 Vercel 上无法访问。

**解决方案**：
- 方案 A：也部署 Star-Office-UI 到 Vercel，然后更新 iframe URL
- 方案 B：使用公网服务器部署 Star-Office-UI
- 方案 C：暂时禁用 iframe 嵌入功能

### 3. 自定义域名（可选）

1. 在 Vercel 项目设置中
2. 点击 "Domains"
3. 添加你的域名
4. 按照指引配置 DNS

## 常见问题

### Q: 构建失败？

A: 检查以下几点：
- 确保 `package.json` 中的依赖正确
- 检查 `next.config.ts` 配置
- 查看 Vercel 构建日志

### Q: 页面无法访问？

A: 检查以下几点：
- 确认部署状态为 "Ready"
- 检查 Vercel 日志是否有错误
- 尝试清除浏览器缓存

### Q: 如何更新部署？

A: 
```bash
git add .
git commit -m "描述改动"
git push origin main
```

Vercel 会自动检测到新的 commit 并触发重新部署。

## 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 构建成功
- [ ] 主页可访问
- [ ] 工作状态页面可访问
- [ ] 状态 API 可用（POST/GET）

## 相关链接

- Vercel 文档：https://vercel.com/docs
- Next.js 部署指南：https://nextjs.org/docs/deployment
- GitHub 仓库：https://github.com/dongzhiyiden/edenlab

## 联系

如有问题，请创建 GitHub Issue 或联系项目维护者。
