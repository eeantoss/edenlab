"""
EdenLab 工作状态管理 - OpenClaw 集成模块

使用方式：
    from edenlab import openclaw_status as status

    # 更新工作状态
    status.set_working("正在执行任务")
    status.set_waiting("等待结果")
    status.set_idle("任务完成")
"""

from .openclaw_status import (
    update_edenlab_status,
    set_idle,
    set_working,
    set_delegating,
    set_waiting,
    STATES
)

__all__ = [
    'update_edenlab_status',
    'set_idle',
    'set_working',
    'set_delegating',
    'set_waiting',
    'STATES'
]
