#!/usr/bin/env python3
"""
OpenClaw 工作状态管理 - EdenLab 集成
"""
import os
import requests

# EdenLab 配置
EDENLAB_API_URL = "http://localhost:3000/status"
EDENLAB_SECRET = "edenlab-secret-key-20260302"  # 从 .env.local 读取

# 状态定义
STATES = {
    "idle": "休息中",
    "working": "工作中",
    "delegating": "Claude Code 干活",
    "waiting": "等待中"
}

def update_edenlab_status(state, message=""):
    """
    更新 EdenLab 工作状态

    Args:
        state: idle|working|delegating|waiting
        message: 任务描述（可选）

    Returns:
        bool: 是否成功
    """
    if not message:
        message = {
            "idle": "休息中",
            "working": "正在工作",
            "delegating": "让 CC 干活",
            "waiting": "等待结果"
        }.get(state, "执行任务中...")

    try:
        response = requests.post(
            EDENLAB_API_URL,
            json={
                "secret": EDENLAB_SECRET,
                "state": state,
                "message": message
            },
            timeout=5
        )

        if response.status_code == 200:
            result = response.json()
            return result.get('ok', False)
        return False

    except Exception as e:
        print(f"⚠️ 更新 EdenLab 状态失败: {e}")
        return False

# 便捷函数
def set_idle(message="休息中"):
    """设置为休息状态"""
    return update_edenlab_status("idle", message)

def set_working(message="工作中"):
    """设置为工作状态"""
    return update_edenlab_status("working", message)

def set_delegating(message="让 CC 干活"):
    """设置为委托状态"""
    return update_edenlab_status("delegating", message)

def set_waiting(message="等待结果"):
    """设置为等待状态"""
    return update_edenlab_status("waiting", message)

# 测试代码
if __name__ == "__main__":
    print("测试 EdenLab 状态更新...")
    if set_working("测试 - 正在部署"):
        print("✅ 状态更新成功！")
        print(f"🌐 查看: http://localhost:3000/workspace")
    else:
        print("❌ 状态更新失败")
