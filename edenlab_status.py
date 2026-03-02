#!/usr/bin/env python3
"""
EdenLab 工作状态更新工具
用于 OpenClaw 集成
"""
import os
import sys
import requests
from datetime import datetime

# 配置
API_URL = "http://localhost:3000/status"
SECRET = os.getenv("EDENLAB_SECRET", "")

# 状态定义
STATES = {
    "idle": "休息中",
    "working": "工作中",
    "delegating": "Claude Code 干活",
    "waiting": "等待中"
}

def update_status(state, message=""):
    """更新工作状态"""
    if not SECRET:
        return {
            "success": False,
            "error": "未配置 EDENLAB_SECRET 环境变量"
        }

    if state not in STATES:
        return {
            "success": False,
            "error": f"无效状态: {state}，可选: {', '.join(STATES.keys())}"
        }

    # 设置默认消息
    if not message:
        message = {
            "idle": "休息中",
            "working": "正在工作",
            "delegating": "让 CC 干活",
            "waiting": "等待结果"
        }[state]

    try:
        response = requests.post(
            API_URL,
            json={
                "secret": SECRET,
                "state": state,
                "message": message
            },
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            if result.get('ok'):
                return {
                    "success": True,
                    "state": state,
                    "state_name": STATES[state],
                    "message": message,
                    "url": "http://localhost:3000/workspace"
                }
            else:
                return {
                    "success": False,
                    "error": result.get('error', '未知错误')
                }
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: {response.text}"
            }

    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "error": "无法连接到 EdenLab (http://localhost:3000)"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def get_status():
    """获取当前状态"""
    try:
        response = requests.get(API_URL, timeout=10)
        if response.status_code == 200:
            return response.json()
    except:
        pass
    return None

if __name__ == "__main__":
    # 命令行使用
    if len(sys.argv) < 2:
        print("用法: python3 edenlab_status.py <state> [message]")
        print(f"状态选项: {', '.join(STATES.keys())}")
        sys.exit(1)

    state = sys.argv[1]
    message = sys.argv[2] if len(sys.argv) > 2 else ""

    result = update_status(state, message)

    if result['success']:
        print(f"✅ 状态更新成功！")
        print(f"📊 状态: {result['state_name']}")
        print(f"📝 任务: {result['message']}")
        print(f"🌐 查看: {result['url']}")
    else:
        print(f"❌ 更新失败: {result['error']}")
        sys.exit(1)
