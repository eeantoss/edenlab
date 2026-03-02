#!/usr/bin/env python3
"""
Dean 工作状态更新脚本 (Python 版本)
"""
import requests
import sys

# 配置
API_URL = "http://localhost:3000/status"
SECRET = "your-secret-key-here"  # 修改为你的 STATUS_SECRET

# 状态映射
STATES = {
    "1": {"state": "idle", "name": "休息中"},
    "2": {"state": "working", "name": "工作中"},
    "3": {"state": "delegating", "name": "Claude Code 干活"},
    "4": {"state": "waiting", "name": "等待中"}
}

def update_status():
    """更新工作状态"""
    print("=" * 50)
    print("🕹️  Dean 工作状态更新")
    print("=" * 50)
    print()

    # 显示选项
    print("选择状态:")
    for key, value in STATES.items():
        print(f"  {key}. {value['name']}")
    print()

    # 获取用户输入
    choice = input("输入选项 (1-4): ").strip()

    if choice not in STATES:
        print("❌ 无效选项")
        return

    # 获取任务描述
    print()
    message = input("输入当前任务 (可选，直接回车跳过): ").strip()

    if not message:
        message = "执行任务中..."

    state_info = STATES[choice]

    print()
    print(f"📤 更新状态: {state_info['name']}")
    print(f"📝 任务: {message}")
    print()

    # 发送请求
    try:
        response = requests.post(
            API_URL,
            json={
                "secret": SECRET,
                "state": state_info['state'],
                "message": message
            },
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            if result.get('ok'):
                print("✅ 状态更新成功！")
                print(f"🌐 查看状态: http://localhost:3000/workspace")
            else:
                print("❌ 状态更新失败")
                print(f"错误: {result}")
        else:
            print(f"❌ HTTP 错误: {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"❌ 请求失败: {e}")

if __name__ == "__main__":
    update_status()
