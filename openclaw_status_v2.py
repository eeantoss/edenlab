#!/usr/bin/env python3
"""
OpenClaw 集成 - 自动更新 Dean 工作状态（本地存储版本）
"""
import requests

API_URL = "http://localhost:3000/status"

# 状态定义
STATES = {
    "idle": "休息中",
    "working": "工作中",
    "delegating": "Claude Code 干活",
    "waiting": "等待中"
}

def update_status(state, message=""):
    """更新工作状态"""
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
                # 不需要 secret 了
                "state": state,
                "message": message
            },
            timeout=5
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

# 便捷函数
def set_idle(message="休息中"):
    """设置为休息状态"""
    return update_status("idle", message)

def set_working(message="正在执行任务"):
    """设置为工作状态"""
    return update_status("working", message)

def set_delegating(message="让 CC 干活"):
    """设置为委托状态"""
    return update_status("delegating", message)

def set_waiting(message="等待结果"):
    """设置为等待状态"""
    return update_status("waiting", message)

# 测试代码
if __name__ == "__main__":
    import sys

    print("测试 EdenLab 状态更新...")
    if set_working("测试 - 正在部署"):
        print("✅ 状态更新成功！")
        print(f"🌐 查看: http://localhost:3000/workspace")
    else:
        print("❌ 状态更新失败")
