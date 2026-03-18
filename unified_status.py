#!/usr/bin/env python3
"""
统一状态管理 - 同时更新 EdenLab 和 Star-Office-UI
"""
import sys
import json
import os
from datetime import datetime

def update_status(state, message=""):
    """
    更新工作状态
    state: idle, working, delegating, waiting, writing, researching, executing
    """
    timestamp = datetime.now().isoformat()
    
    # 状态映射
    state_map = {
        'idle': '休息中',
        'working': '工作中',
        'delegating': 'Claude Code 干活',
        'waiting': '等待中',
        'writing': '写作中',
        'researching': '研究中',
        'executing': '执行中'
    }
    
    state_cn = state_map.get(state, state)
    
    print(f"=== 更新工作状态 ===")
    print(f"状态: {state_cn}")
    print(f"消息: {message}")
    print(f"时间: {timestamp}")
    
    # 1. 更新到 Star-Office-UI (如果存在)
    star_office_path = "/Users/yangxu/.openclaw/workspace/Star-Office-UI/state.json"
    if os.path.exists(os.path.dirname(star_office_path)):
        try:
            state_data = {
                "state": state,
                "message": message,
                "timestamp": timestamp
            }
            with open(star_office_path, 'w', encoding='utf-8') as f:
                json.dump(state_data, f, ensure_ascii=False, indent=2)
            print(f"✅ Star-Office-UI 状态已更新")
        except Exception as e:
            print(f"❌ Star-Office-UI 更新失败: {e}")
    
    # 2. 记录到日志
    log_path = "/Users/yangxu/.openclaw/workspace/edenlab/status.log"
    try:
        with open(log_path, 'a', encoding='utf-8') as f:
            f.write(f"{timestamp} | {state_cn} | {message}\n")
        print(f"✅ 状态日志已记录")
    except Exception as e:
        print(f"❌ 日志记录失败: {e}")
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 unified_status.py <state> [message]")
        print("状态: idle, working, delegating, waiting, writing, researching, executing")
        sys.exit(1)
    
    state = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else ""
    
    update_status(state, message)
