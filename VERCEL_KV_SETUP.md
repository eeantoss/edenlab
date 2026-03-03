# Vercel KV 配置指南

## ✅ 问题已解决

**问题**: `vercel.json` 模式验证失败 - 不应有额外属性 'kv'

**原因**: Vercel KV 不能直接在 `vercel.json` 中配置，需要在 Vercel 项目设置中添加。

---

## 🚀 现在可以部署了

修改已完成，代码已推送到 GitHub，现在可以重新部署！

### 步骤：
1. 在 Vercel 项目页面，点击 "Redeploy" 按钮
2. 等待部署完成
3. 部署应该会成功 ✅

---

## 🔧 Vercel KV 配置步骤（可选）

如果你想启用云端状态存储，需要在 Vercel 项目设置中添加 KV 数据库：

### 1. 在 Vercel 创建 KV 数据库

1. 访问 Vercel 项目页面
2. 点击 "Storage" → "Create Database"
3. 选择 "KV"
4. 点击 "Create"
5. 选择你的项目（如果提示选择）
6. 点击 "Continue"

### 2. 获取 KV 环境变量

创建 KV 数据库后，Vercel 会自动添加以下环境变量：

```
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

### 3. 更新代码

将以下代码重新添加到 `app/api/update-status/route.ts`：

```typescript
import { kv } from '@vercel/kv'

export async function POST(req: NextRequest) {
  // ... 验证代码 ...

  try {
    // 存储到 Vercel KV
    await kv.set('edenlab_status', JSON.stringify(status), {
      ex: 24 * 60 * 60 // 24小时过期
    })

    revalidateTag('edenlab-status')

    return NextResponse.json({
      success: true,
      status: status,
      message: 'Status updated successfully'
    })
  } catch (error) {
    console.error('Error storing to KV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 4. 安装 Vercel KV SDK

```bash
npm install @vercel/kv
```

### 5. 更新状态读取 API

在 `app/status/route.ts` 中添加：

```typescript
import { kv } from '@vercel/kv'

export async function GET() {
  try {
    const data = await kv.get('edenlab_status')
    const status = data ? JSON.parse(data as string) : {
      state: 'idle',
      message: '等待命令...',
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(status, {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (error) {
    console.error('Error reading from KV:', error)
    return NextResponse.json({
      state: 'idle',
      message: '等待命令...',
      updatedAt: new Date().toISOString()
    })
  }
}
```

---

## 📋 当前状态

### ✅ 可以工作的功能

- EdenLab 网站访问
- 工作状态页面显示
- 本地状态更新（开发环境）

### ⚠️ 暂时不可用的功能

- 云端状态持久化（需要配置 Vercel KV）
- 从本地 OpenClaw 更新云端状态

---

## 💡 建议

1. **先部署成功**: 现在的状态可以成功部署，先确保网站能正常运行
2. **后添加 KV**: 等网站稳定运行后，再考虑添加 KV 存储
3. **使用 GitHub Gist**: 临时方案，可以用 GitHub Gist 存储状态（之前的实现）

---

## 🔄 GitHub Gist 方案（备选）

如果不想使用 Vercel KV，可以改用 GitHub Gist 存储状态：

1. 创建一个 GitHub Personal Access Token (需要 gist 权限)
2. 在 Vercel 环境变量中添加 `GITHUB_TOKEN`
3. 创建一个 Gist 来存储状态
4. 修改 API 代码，使用 GitHub Gist API

这样就可以实现跨设备状态同步，而且完全免费！

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 检查 Vercel 部署日志
2. 查看 Vercel 项目设置中的环境变量
3. 确认 KV 数据库已创建并连接到项目

---

**最后更新**: 2026-03-03
