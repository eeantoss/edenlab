# QuickNode 集成指南

## 快速开始

### 步骤 1: 获取 QuickNode Endpoint

1. 访问 https://dashboard.quicknode.com
2. 登录或注册
3. 创建一个新 Endpoint 或使用现有的
4. 选择你需要的链（Ethereum, Solana, Polygon 等）
5. 复制 HTTP Endpoint URL

示例 Endpoint:
```
https://your-endpoint-url.quicksol.solana.com
https://your-endpoint-url.quicknode.com
```

### 步骤 2: 配置环境变量

创建 `.quicknode.env` 文件：
```bash
cd /Users/yangxu/.openclaw/workspace/edenlab
cp .env.quicknode .quicknode.env
```

编辑 `.quicknode.env`，填入你的 Endpoint：
```bash
QUICKNODE_ENDPOINT=https://your-endpoint-url.quicknode.com
```

### 步骤 3: 测试连接

```bash
# Python 示例
python3 quicknode_example.py

# 或使用 API
curl -X POST http://localhost:3000/api/quicknode/block
```

## 使用方式

### 方式 1: Python 脚本

运行示例脚本：
```bash
python3 quicknode_example.py
```

包含的示例：
- ✅ 获取最新区块号
- ✅ 获取 Gas 价格
- ✅ 获取区块信息
- ✅ 获取地址余额
- ✅ 获取交易信息

### 方式 2: EdenLab API

**获取最新区块**:
```bash
GET http://localhost:3000/api/quicknode/block
```

响应：
```json
{
  "success": true,
  "blockNumber": 12345678,
  "blockNumberHex": "0xbc614e"
}
```

**获取地址余额**:
```bash
POST http://localhost:3000/api/quicknode/balance
Content-Type: application/json

{
  "address": "0xYourAddress"
}
```

响应：
```json
{
  "success": true,
  "address": "0xYourAddress",
  "balanceWei": 1000000000000000000,
  "balanceEth": 1.0,
  "balanceWeiFormatted": "1,000,000,000,000,000",
  "balanceEthFormatted": "1.000000"
}
```

**自定义 RPC 调用**:
```bash
PUT http://localhost:3000/api/quicknode
Content-Type: application/json

{
  "method": "eth_getTransactionByHash",
  "params": ["0xYourTxHash"]
}
```

### 方式 3: 在代码中直接使用

```python
import requests
import os

# 从环境变量加载
QUICKNODE_ENDPOINT = os.environ.get('QUICKNODE_ENDPOINT')

# 发送 RPC 请求
headers = {'Content-Type': 'application/json'}
payload = {
    'jsonrpc': '2.0',
    'id': 1,
    'method': 'eth_blockNumber',
    'params': []
}

response = requests.post(
    QUICKNODE_ENDPOINT,
    headers=headers,
    json=payload
)

result = response.json()
block_number = int(result['result'], 16)
print(f"最新区块: {block_number}")
```

## 支持的链

QuickNode 支持多条区块链：

| 链 | 符号 | Endpoint 示例 |
|------|------|--------------|
| Ethereum | ETH | `https://...quicknode.com` |
| Solana | SOL | `https://...quicksol.solana.com` |
| Polygon | MATIC | `https://...polygon.quicknode.com` |
| Arbitrum | ARB | `https://...arbitrum.quicknode.com` |
| Optimism | OP | `https://...optimism.quicknode.com` |
| Base | BASE | `https://...base.quicknode.com` |
| Avalanche | AVAX | `https://...avalanche.quicknode.com` |
| BSC | BSC | `https://...bsc.quicknode.com` |

## 常用 RPC 方法

### Ethereum

```bash
# 获取最新区块号
eth_blockNumber

# 获取 Gas 价格
eth_gasPrice

# 获取区块
eth_getBlockByNumber

# 获取余额
eth_getBalance

# 获取交易
eth_getTransactionByHash

# 获取交易回执
eth_getTransactionReceipt

# 发送交易
eth_sendRawTransaction

# 获取合约代码
eth_getCode
```

### Solana

```bash
# 获取最新区块
getLatestBlockhash

# 获取余额
getBalance

# 获取账户信息
getAccountInfo

# 发送交易
sendTransaction

# 获取交易
getTransaction
```

## 计划类型

QuickNode 提供不同层级的计划：

### Free Tier（免费）
- 请求数量: 有限
- 适用: 开发和测试

### Developer Plan（$9/月）
- 100M 请求/月
- 适合: 个人开发

### Startup Plan（$49/月）
- 1B 请求/月
- 适合: 初创公司

### Scale Plan（$149/月）
- 10B 请求/月
- 适合: 生产环境

## 最佳实践

### 1. 错误处理
```python
try:
    result = make_rpc_call('eth_blockNumber')
    if result and 'error' in result:
        print(f"RPC 错误: {result['error']}")
    else:
        print(f"区块号: {result['result']}")
except Exception as e:
    print(f"网络错误: {e}")
```

### 2. 缓存结果
```python
# 对不常变化的数据使用缓存
block_number = cache.get('block_number')
if not block_number:
    result = make_rpc_call('eth_blockNumber')
    block_number = int(result['result'], 16)
    cache.set('block_number', block_number, ttl=60)
```

### 3. 批量请求
```python
# 批量调用可以减少延迟
params = [
    {'method': 'eth_getBalance', 'params': [addr1]},
    {'method': 'eth_getBalance', 'params': [addr2]},
    {'method': 'eth_getBalance', 'params': [addr3]}
]

# 并行发送
import concurrent.futures
with concurrent.futures.ThreadPoolExecutor() as executor:
    results = list(executor.map(call_rpc, params))
```

## 故障排除

### 连接失败
- 检查 QUICKNODE_ENDPOINT 是否正确
- 检查网络连接
- 检查 QuickNode 仪表板是否有服务中断

### 请求限流
- 检查你的计划配额
- 优化请求频率
- 考虑升级计划

### 认证错误
- 某些计划需要 API Key
- 检查 Endpoint URL 是否包含 API Key
- 查看文档确认

## 文档

- **QuickNode 官方文档**: https://docs.quicknode.com
- **Ethereum RPC**: https://docs.quicknode.com/docs/json-rpc-ethereum
- **Solana RPC**: https://docs.quicknode.com/docs/json-rpc-solana
- **仪表板**: https://dashboard.quicknode.com

## 示例项目

查看 `/Users/yangxu/.openclaw/workspace/edenlab/quicknode_example.py`

## 支持

如有问题，访问:
- QuickNode 帮助中心: https://help.quicknode.com
- Discord: https://discord.gg/quicknode
