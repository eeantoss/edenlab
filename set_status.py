#!/usr/bin/env python3
"""
EdenLab 状态设置工具
用法:
  python3 set_status.py working "正在处理数据..."
  python3 set_status.py idle
  python3 set_status.py delegating "让 AI 助手处理"
"""

import sys
import requests
import json

EDENLAB_STATUS_API = "http://localhost:3000/status"

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
    
    # 直接匹配
    if state_lower in STATE_MAPPING:
        return STATE_MAPPING[state_lower]
    
    # 模糊匹配
    for key, value in STATE_MAPPING.items():
        if state_lower in key:
            return value
    
    return 'idle'

def set_status(state, message=None):
    """设置状态"""
    normalized_state = normalize_state(state)
    
    # 默认消息
    default_messages = {
        'idle': '等待命令...',
        'working': '正在处理任务...',
        'delegating': 'AI 助手正在处理...',
        'waiting': '等待执行结果...',
    }
    
    final_message = message or default_messages.get(normalized_state, '')
    
    try:
        response = requests.post(
            EDENLAB_STATUS_API,
            json={
                'state': normalized_state,
                'message': final_message
            },
            timeout=5
        )
        
        if response.status_code == 200:
            print(f"✓ 状态已更新")
            print(f"  状态: {normalized_state.upper()}")
            print(f"  消息: {final_message}")
            return True
        else:
            print(f"✗ 更新失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ 请求失败: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("用法:")
        print("  python3 set_status.py <状态> [消息]")
        print()
        print("可用状态:")
        print("  idle, working, delegating, waiting")
        print()
        print("示例:")
        print("  python3 set_status.py working \"正在写代码\"")
        print("  python3 set_status.py idle")
        sys.exit(1)
    
    state = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else None
    
    set_status(state, message)

if __name__ == '__main__':
    main()
