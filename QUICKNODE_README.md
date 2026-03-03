# QuickNode 集成 - 快速开始

## 🚀 3 分钟集成

### 1. 获取 Endpoint

访问: https://dashboard.quicknode.com
- 登录你的账户
- 选择或创建 Endpoint
- 复制 URL

### 2. 配置项目

```bash
# 进入 EdenLab 目录
cd /Users/yangxu/.openclaw/workspace/edenlab

# 复制配置模板
cp .env.quicknode .quicknode.env

# 编辑配置，填入你的 Endpoint
vim .quicknode.env
```

在 `.quicknode.env` 中:
```bash
QUICKNODE_ENDPOINT=https://your-endpoint-url.quicknode.com
```

### 3. 测试

```bash
# Python 示例
python3 quicknode_example.py

# 应该看到:
# ✓ 使用 QuickNode Endpoint: https://...
# 📦 获取最新区块号...
# ✓ 最新区块号: 12,345,678
```

## 📋 支持的链

- ✅ Ethereum (ETH)
- ✅ Solana (SOL)
- ✅ Polygon (MATIC)
- ✅ Arbitrum
- ✅ Optimism
- ✅ Base
- ✅ Avalanche
- ✅ BSC (Binance Smart Chain)

## 🔌 使用方式

### Python 脚本

```bash
python3 quicknode_example.py
```

### EdenLab API

```bash
# 获取最新区块
curl http://localhost:3000/api/quicknode/block

# 获取余额
curl -X POST http://localhost:3000/api/quicknode/balance \
  -H "Content-Type: application/json" \
  -d '{"address": "0xYourAddress"}'
```

### 在代码中

```python
import requests
import os

QUICKNODE_ENDPOINT = os.environ.get('QUICKNODE_ENDPOINT')

headers = {'Content-Type': 'application/json'}
payload = {
    'jsonrpc': '2.0',
    'id': 1,
    'method': 'eth_blockNumber',
    'params': []
}

response = requests.post(QUICKNODE_ENDPOINT, headers=headers, json=payload)
print(response.json())
```

## 📚 文档

- **完整指南**: `QUICKNODE_GUIDE.md`
- **官方文档**: https://docs.quicknode.com
- **仪表板**: https://dashboard.quicknode.com

## ✅ 已完成

- ✅ QuickNode 配置示例
- ✅ Python 集成示例
- ✅ EdenLab API 端点
- ✅ 完整文档

## 🎯 下一步

1. 配置你的 QuickNode Endpoint
2. 运行测试脚本
3. 集成到你的项目
4. 开始开发！

## 💰 计划信息

查看你的订阅计划和配额:
https://dashboard.quicknode.com/plans

## 🆘 故障排除

**连接失败?**
- 检查 Endpoint URL
- 检查网络连接

**请求限流?**
- 查看仪表板配额
- 优化请求频率

## 📞 支持

- 帮助中心: https://help.quicknode.com
- Discord: https://discord.gg/quicknode
