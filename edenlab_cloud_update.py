#!/usr/bin/env python3
"""
EdenLab Status - Cloud Update Command

Usage:
  python3 edenlab_cloud_update.py working "任务描述"
  python3 edenlab_cloud_update.py idle

Configuration:
  1. Create .env file in edenlab directory:
     EDENLAB_URL=https://your-project.vercel.app
     STATUS_SECRET=your-secret-token
  2. Or set environment variables directly
"""

import sys
import os
import requests
from pathlib import Path

# 尝试从 .env 文件加载配置
ENV_FILE = Path(__file__).parent / '.env'

def load_env():
    """从 .env 文件加载环境变量"""
    if ENV_FILE.exists():
        with open(ENV_FILE) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

# 加载环境变量
load_env()

# 配置
EDENLAB_URL = os.environ.get('EDENLAB_URL', 'http://localhost:3000')
STATUS_SECRET = os.environ.get('STATUS_SECRET', 'default-secret')

UPDATE_API = f"{EDENLAB_URL}/api/update-status"

STATE_MAPPING = {
    'idle': 'idle',
    'resting': 'idle',
    '休息': 'idle',

    'working': 'working',
    'work': 'working',
    '工作': 'working',

    'delegating': 'delegating',
    'delegate': 'delegating',
    'delegated': 'delegating',
    '委托': 'delegating',

    'waiting': 'waiting',
    'wait': 'waiting',
    '等待': 'waiting',
}

def normalize_state(state_str):
    """规范化状态字符串"""
    if not state_str:
        return 'idle'

    state_lower = state_str.lower().strip()

    if state_lower in STATE_MAPPING:
        return STATE_MAPPING[state_lower]

    for key, value in STATE_MAPPING.items():
        if state_lower in key:
            return value

    return 'idle'

def set_status(state, message=None):
    """设置 EdenLab 状态（云端）"""
    normalized_state = normalize_state(state)

    default_messages = {
        'idle': '等待命令...',
        'working': '正在处理任务...',
        'delegating': 'AI 助手正在处理...',
        'waiting': '等待执行结果...',
    }

    final_message = message or default_messages.get(normalized_state, '')

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {STATUS_SECRET}'
    }

    payload = {
        'state': normalized_state,
        'message': final_message
    }

    try:
        response = requests.post(
            UPDATE_API,
            json=payload,
            headers=headers,
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            print(f"✓ EdenLab 状态已更新: {normalized_state.upper()} - {final_message}")
            if result.get('status'):
                print(f"  客户端: {result['status'].get('clientIP', 'unknown')}")
                print(f"  更新时间: {result['status'].get('updatedAt', 'unknown')}")
            return True
        elif response.status_code == 401:
            print(f"✗ 认证失败: 请检查 STATUS_SECRET")
            return False
        else:
            print(f"✗ 更新失败: HTTP {response.status_code}")
            print(f"  响应: {response.text}")
            return False

    except requests.exceptions.Timeout:
        print(f"✗ 连接超时: 无法连接到 {UPDATE_API}")
        print(f"  请检查 EdenLab URL 是否正确")
        return False
    except requests.exceptions.ConnectionError:
        print(f"✗ 连接失败: 无法连接到 {UPDATE_API}")
        print(f"  请检查:")
        print(f"    1. EdenLab URL 是否正确: {EDENLAB_URL}")
        print(f"    2. 网络是否通畅")
        return False
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  edenlab_cloud_update.py <状态> [消息]")
        print()
        print("配置方式:")
        print("  1. 在 ~/.edenlab.env 或 edenlab/.env 中配置:")
        print("     EDENLAB_URL=https://your-project.vercel.app")
        print("     STATUS_SECRET=your-secret-token")
        print()
        print("  2. 或设置环境变量")
        print()
        print("可用状态:")
        print("  idle, working, delegating, waiting")
        print()
        print("示例:")
        print("  edenlab_cloud_update.py working \"正在写代码\"")
        print("  edenlab_cloud_update.py idle")
        sys.exit(1)

    state = sys.argv[1]
    message = ' '.join(sys.argv[2:]) if len(sys.argv) > 2 else None

    # 显示当前配置
    print(f"📡 EdenLab URL: {EDENLAB_URL}")
    print(f"🔑 使用密钥: {'是' if STATUS_SECRET != 'default-secret' else '否（使用默认）'}")
    print()

    success = set_status(state, message)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
