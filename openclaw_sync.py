#!/usr/bin/env python3
"""
OpenClaw 状态同步脚本
从 OpenClaw 获取当前状态并同步到 EdenLab
"""

import subprocess
import json
import requests
import time
from datetime import datetime

# EdenLab API 配置
EDENLAB_API = "http://localhost:3000/api/status"
# 使用本地状态 API
EDENLAB_STATUS_API = "http://localhost:3000/status"

def get_openclaw_status():
    """
    获取 OpenClaw 当前状态
    通过检查是否有活跃的执行任务来判断状态
    """
    # 检查是否有活跃的 npm/npm exec 进程
    try:
        result = subprocess.run(
            ["pgrep", "-l", "-f", "node"],
            capture_output=True,
            text=True
        )
        
        # 如果有 node 进程在运行
        if result.returncode == 0 and result.stdout:
            processes = result.stdout.strip().split('\n')
            
            # 检查是否有相关的开发服务器在运行
            for proc in processes:
                if 'next dev' in proc.lower():
                    return {
                        'state': 'working',
                        'message': 'EdenLab 开发服务器运行中',
                    }
                elif 'app.py' in proc.lower():
                    return {
                        'state': 'delegating',
                        'message': 'Star-Office-UI 后端运行中',
                    }
    except:
        pass
    
    # 默认状态
    return {
        'state': 'idle',
        'message': '等待命令...',
    }

def update_edenlab_status(state_data):
    """
    更新 EdenLab 状态
    """
    try:
        response = requests.post(
            EDENLAB_STATUS_API,
            json=state_data,
            timeout=5
        )
        
        if response.status_code == 200:
            print(f"✓ 状态已更新: {state_data['state'].upper()} - {state_data['message']}")
            return True
        else:
            print(f"✗ 更新失败: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"✗ 请求失败: {e}")
        return False

def main():
    """
    主循环
    """
    print("🔄 OpenClaw 状态同步启动")
    print(f"📡 EdenLab API: {EDENLAB_STATUS_API}")
    print("💡 按 Ctrl+C 停止\n")
    
    # 初始更新
    status = get_openclaw_status()
    update_edenlab_status(status)
    
    # 定期检查并更新（每 10 秒）
    try:
        while True:
            time.sleep(10)
            
            status = get_openclaw_status()
            update_edenlab_status(status)
    except KeyboardInterrupt:
        print("\n👋 停止同步")

if __name__ == '__main__':
    main()
