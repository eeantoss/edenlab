#!/usr/bin/env python3
"""
QuickNode 集成示例
演示如何使用 QuickNode RPC 端点
"""

import os
import json
import requests
from pathlib import Path

# 加载环境变量
ENV_FILE = Path(__file__).parent / '.quicknode.env'

def load_quicknode_config():
    """加载 QuickNode 配置"""
    if ENV_FILE.exists():
        with open(ENV_FILE) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

load_quicknode_config()

# QuickNode 端点
QUICKNODE_ENDPOINT = os.environ.get('QUICKNODE_ENDPOINT', '')

if not QUICKNODE_ENDPOINT:
    print("❌ 错误: 未配置 QUICKNODE_ENDPOINT")
    print("请在 .quicknode.env 文件中配置你的 QuickNode Endpoint URL")
    print()
    print("获取 Endpoint:")
    print("1. 访问 https://dashboard.quicknode.com")
    print("2. 选择或创建一个 Endpoint")
    print("3. 复制 HTTP Endpoint URL")
    print("4. 粘贴到 .quicknode.env 文件")
    exit(1)

print(f"✓ 使用 QuickNode Endpoint: {QUICKNODE_ENDPOINT}")
print()

def make_rpc_call(method, params=None):
    """发送 RPC 请求到 QuickNode"""
    headers = {
        'Content-Type': 'application/json',
    }

    payload = {
        'jsonrpc': '2.0',
        'id': 1,
        'method': method,
        'params': params or []
    }

    try:
        response = requests.post(
            QUICKNODE_ENDPOINT,
            headers=headers,
            json=payload,
            timeout=10
        )

        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ 请求失败: HTTP {response.status_code}")
            print(f"响应: {response.text}")
            return None

    except requests.exceptions.Timeout:
        print("❌ 连接超时")
        return None
    except requests.exceptions.ConnectionError:
        print("❌ 连接失败: 无法连接到 QuickNode")
        return None
    except Exception as e:
        print(f"❌ 错误: {e}")
        return None

# ==================== 示例 ====================

def example_get_block_number():
    """获取最新区块号"""
    print("📦 获取最新区块号...")
    result = make_rpc_call('eth_blockNumber')
    if result:
        block_number = int(result.get('result', '0x0'), 16)
        print(f"✓ 最新区块号: {block_number:,}")
    print()

def example_get_balance(address):
    """获取地址余额"""
    print(f"💰 获取地址余额: {address}")
    result = make_rpc_call('eth_getBalance', [address, 'latest'])
    if result:
        balance_wei = int(result.get('result', '0x0'), 16)
        balance_eth = balance_wei / 10**18
        print(f"✓ 余额: {balance_eth:.6f} ETH")
    print()

def example_get_gas_price():
    """获取当前 Gas 价格"""
    print("⛽ 获取 Gas 价格...")
    result = make_rpc_call('eth_gasPrice')
    if result:
        gas_price_wei = int(result.get('result', '0x0'), 16)
        gas_price_gwei = gas_price_wei / 10**9
        print(f"✓ Gas 价格: {gas_price_gwei:.2f} Gwei")
    print()

def example_get_transaction(tx_hash):
    """获取交易信息"""
    print(f"📄 获取交易: {tx_hash}")
    result = make_rpc_call('eth_getTransactionByHash', [tx_hash])
    if result:
        tx = result.get('result', {})
        print(f"✓ 交易状态: {'成功' if tx else '失败'}")
        if tx:
            print(f"  - 发送者: {tx.get('from', 'N/A')}")
            print(f"  - 接收者: {tx.get('to', 'N/A')}")
            print(f"  - Gas: {int(tx.get('gas', '0x0'), 16):,}")
            print(f"  - 区块: {int(tx.get('blockNumber', '0x0'), 16):,}")
    print()

def example_get_block(block_number='latest'):
    """获取区块信息"""
    print(f"🧱 获取区块: {block_number}")
    result = make_rpc_call('eth_getBlockByNumber', [block_number, True])
    if result:
        block = result.get('result', {})
        if block:
            block_num = int(block.get('number', '0x0'), 16)
            tx_count = len(block.get('transactions', []))
            print(f"✓ 区块 #{block_num:,}")
            print(f"  - 交易数量: {tx_count}")
            print(f"  - 时间戳: {block.get('timestamp', 'N/A')}")
            print(f"  - Gas Used: {int(block.get('gasUsed', '0x0'), 16):,}")
    print()

def main():
    """主函数"""
    print("=" * 60)
    print("QuickNode 集成示例")
    print("=" * 60)
    print()

    # 示例 1: 获取最新区块号
    example_get_block_number()

    # 示例 2: 获取 Gas 价格
    example_get_gas_price()

    # 示例 3: 获取区块信息
    example_get_block()

    # 示例 4: 获取地址余额（替换为你的地址）
    # example_get_balance('0xYourAddress')

    # 示例 5: 获取交易（替换为交易哈希）
    # example_get_transaction('0xYourTxHash')

    print("=" * 60)
    print("示例运行完成！")
    print()
    print("📚 更多 QuickNode RPC 方法:")
    print("https://docs.quicknode.com/docs/json-rpc-ethereum")
    print()

if __name__ == '__main__':
    main()
