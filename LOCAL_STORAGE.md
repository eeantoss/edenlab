# EdenLab 工作状态 - 本地存储版本

## 💡 重要说明

**EdenLab 是本地部署**（http://localhost:3000），不是部署在 GitHub 上！

## 🤔 为什么原版需要 GitHub Token？

原版 EdenLab 使用 **GitHub Gist** 存储工作状态数据：

**原版架构：**
```
本地 EdenLab → GitHub Gist API → 存储状态 → 跨设备访问
```

**好处：**
- 可以从任何地方访问状态（手机、其他电脑）
- 数据不丢失

**问题：**
- 需要 GitHub Token
- 配置复杂
- 依赖外部服务（GitHub）

## ✅ 本地存储版本

我已经修改为使用**本地文件存储**，不再需要 GitHub Token！

**新架构：**
```
本地 EdenLab → 本地 JSON 文件 → 前端读取
```

**优势：**
- ✅ 不需要 GitHub Token
- ✅ 不需要配置任何密钥
- ✅ 完全本地运行
- ✅ 更简单，更快速

## 🚀 快速开始

### 1. 使用本地存储版本

```bash
cd /Users/yangxu/.openclaw/workspace/edenlab

# 备份原版（可选）
mv app/status/route.ts app/status/route.gist.ts.backup

# 使用本地版本
mv app/status/route.local.ts app/status/route.ts

# 重启 EdenLab（Ctrl+C，然后 npm run dev）
```

### 2. 测试状态更新

```bash
# 使用新版本
python3 openclaw_status_v2.py working "测试本地存储"
```

### 3. 查看状态

访问：http://localhost:3000/workspace

---

## 📝 使用方式

### Python 导入

```python
from edenlab import openclaw_status_v2 as status

# 更新状态
status.set_working("正在执行你的任务")
status.set_delegating("让 CC 帮忙")
status.set_waiting("等待执行结果")
status.set_idle("任务完成，休息中")
```

### 命令行

```bash
# 测试
python3 openclaw_status_v2.py working "测试任务"

# 休息
python3 openclaw_status_v2.py idle

# 委托
python3 openclaw_status_v2.py delegating "让 CC 干活"
```

---

## 🔄 从 Gist 版本迁移到本地版本

### 对比

| 特性 | Gist 版本 | 本地存储版本 |
|------|-----------|-------------|
| GitHub Token | ✅ 必需 | ❌ 不需要 |
| Secret Key | ✅ 必需 | ❌ 不需要 |
| 跨设备访问 | ✅ 支持 | ❌ 不支持 |
| 配置复杂度 | 🔴 高 | 🟢 低 |
| 数据安全 | 🟡 依赖 GitHub | 🟢 完全本地 |

### 迁移步骤

1. **备份原版**（可选）
   ```bash
   cd /Users/yangxu/.openclaw/workspace/edenlab
   mv app/status/route.ts app/status/route.gist.ts.backup
   ```

2. **启用本地版本**
   ```bash
   mv app/status/route.local.ts app/status/route.ts
   ```

3. **更新 OpenClaw 集成**
   ```python
   # 将 openclaw_status_v2.py 重命名
   mv openclaw_status_v2.py openclaw_status.py

   # 或者更新 __init__.py 使用新版本
   ```

4. **重启 EdenLab**
   ```bash
   # Ctrl+C 停止
   npm run dev
   ```

---

## 📂 文件说明

### 本地存储版本
- `app/status/route.local.ts` - 本地存储 API 路由
- `openclaw_status_v2.py` - OpenClaw 集成工具（无 Token）

### Gist 版本（备份）
- `app/status/route.gist.ts.backup` - 原 Gist 版本备份
- `openclaw_status.py` - 原 Gist 版本工具

---

## 💡 推荐配置

**如果只在本地使用：** 使用本地存储版本 ✅

**如果需要跨设备访问：** 继续使用 Gist 版原版

---

## 🧪 测试验证

```bash
# 1. 测试状态更新
python3 openclaw_status_v2.py working "测试本地存储"

# 2. 检查响应
# 应该看到：✅ 状态更新成功！

# 3. 访问页面
open http://localhost:3000/workspace

# 4. 验证显示
# 应该看到：状态 = 工作中
#         任务 = 测试本地存储
```

---

**总结：本地版本更简单，不需要任何 Token！** 🎉
