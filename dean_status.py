#!/usr/bin/env python3
"""
OpenClaw 集成 - 自动更新 Dean 工作状态
"""
import requests
import os

API_URL = "http://localhost:3000/status"
SECRET = "your-secret-key-here"  # 需要配置

def set_status(state, message=""):
    """设置工作状态"""
    try:
        response = requests.post(
            API_URL,
            json={
                "secret": SECRET,
                "state": state,
                "message": message
            },
            timeout=5
        )
        return response.status_code == 200
    except:
        return False

# 状态快捷方式
def set_idle(message="休息中"):
    """设置为休息状态"""
    set_status("idle", message)

def set_working(message="工作中"):
    """设置为工作状态"""
    set_status("working", message)

def set_delegating(message="让 CC 干活"):
    """设置为委托状态"""
    set_status("delegating", message)

def set_waiting(message="等待结果"):
    """设置为等待状态"""
    set_status("waiting", message)

if __name__ == "__main__":
    # 测试
    print("测试状态更新...")
    if set_working("测试 - 正在部署 EdenLab"):
        print("✅ 状态更新成功！")
        print(f"🌐 查看: http://localhost:3000/workspace")
    else:
        print("❌ 状态更新失败，请检查配置")
