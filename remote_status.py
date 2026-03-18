#!/usr/bin/env python3
"""
EdenLab 远程状态更新 - 调用部署的 API
"""
import sys
import json
import os
import requests
from datetime import datetime

# 配置
EDENLAB_URL = "https://edenlab-nine.vercel.app"
EDENLAB_SECRET = "93b99db53c273447865d9e6883894b0153b6ca26477dba11168c368b7593eec2"

def update_remote_status(state, message=""):
    """
    更新远程 EdenLab 工作状态
    state: idle, working, delegating, waiting
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
    
    print(f"=== 更新远程工作状态 ===")
    print(f"状态: {state_cn}")
    print(f"消息: {message}")
    print(f"时间: {timestamp}")
    print(f"目标: {EDENLAB_URL}/status")
    
    # 调用远程 API
    try:
        payload = {
            "secret": EDENLAB_SECRET,
            "state": state,
            "message": message
        }
        
        response = requests.post(
            f"{EDENLAB_URL}/status",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"✅ 远程状态更新成功")
            return True
        else:
            print(f"❌ 远程状态更新失败: {response.status_code}")
            print(f"响应: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 远程 API 调用失败: {e}")
        return False

def set_working(message="正在工作"):
    """快捷方法：设置为工作中"""
    return update_remote_status("working", message)

def set_idle(message="休息中"):
    """快捷方法：设置为休息中"""
    return update_remote_status("idle", message)

def set_delegating(message="Claude Code 干活"):
    """快捷方法：设置为委托状态"""
    return update_remote_status("delegating", message)

def set_waiting(message="等待中"):
    """快捷方法：设置为等待状态"""
    return update_remote_status("waiting", message)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 remote_status.py <state> [message]")
        print("状态: idle, working, delegating, waiting, writing, researching, executing")
        print("\n快速测试:")
        print("  python3 remote_status.py working '正在部署项目'")
        sys.exit(1)
    
    state = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else ""
    
    success = update_remote_status(state, message)
    sys.exit(0 if success else 1)
