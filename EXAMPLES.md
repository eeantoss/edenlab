# OpenClaw 状态集成示例

## 基础使用

### 示例 1：简单任务状态

```bash
# 任务开始
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py working "正在处理数据..."

# ... 执行你的任务 ...
sleep 5

# 任务完成
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py idle
```

### 示例 2：使用函数别名（推荐）

添加到 `~/.zshrc` 或 `~/.bashrc`：

```bash
# EdenLab 状态快捷命令
alias estatus='python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py'
alias eidle='python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py idle'
alias eworking='python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py working'
alias edelegating='python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py delegating'
alias ewaiting='python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py waiting'
```

使用：

```bash
estatus working "任务描述"
# ... 执行任务 ...
estatus idle
```

### 示例 3：任务包装脚本

创建 `run_with_status.sh`：

```bash
#!/bin/bash
# 用法: ./run_with_status.sh "任务描述" "命令"

TASK_DESC="$1"
COMMAND="$2"

# 开始任务
python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py working "$TASK_DESC"

# 执行任务
eval $COMMAND
EXIT_CODE=$?

# 任务完成
if [ $EXIT_CODE -eq 0 ]; then
    python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py idle
else
    python3 /Users/yangxu/.openclaw/workspace/edenlab/set_status.py waiting "任务执行失败"
fi

exit $EXIT_CODE
```

使用示例：

```bash
# 检查代码
./run_with_status.sh "检查代码" "npm run lint"

# 运行测试
./run_with_status.sh "运行测试" "npm test"

# 构建项目
./run_with_status.sh "构建项目" "npm run build"
```

### 示例 4：Python 函数封装

创建 `edenlab_status.py`：

```python
#!/usr/bin/env python3
import subprocess
import atexit

def set_status(state, message=None):
    """设置 EdenLab 状态"""
    subprocess.run([
        'python3',
        '/Users/yangxu/.openclaw/workspace/edenlab/set_status.py',
        state,
        message or ''
    ])

# 任务开始时设置状态
set_status('working', '正在处理数据...')

# 任务完成时自动重置状态
atexit.register(lambda: set_status('idle'))

# ... 你的任务代码 ...
```

### 示例 5：OpenClaw Skill 集成

在你的 Skill 中使用：

```python
# skill_example.py

def run_task():
    """执行任务"""
    import subprocess
    
    # 开始任务
    subprocess.run([
        'python3',
        '/Users/yangxu/.openclaw/workspace/edenlab/set_status.py',
        'working',
        '正在执行任务...'
    ])
    
    try:
        # ... 你的任务逻辑 ...
        result = do_something()
        
        # 任务完成
        subprocess.run([
            'python3',
            '/Users/yangxu/.openclaw/workspace/edenlab/set_status.py',
            'idle'
        ])
        
        return result
    except Exception as e:
        # 任务失败
        subprocess.run([
            'python3',
            '/Users/yangxu/.openclaw/workspace/edenlab/set_status.py',
            'waiting',
            f'任务失败: {str(e)}'
        ])
        raise
```

### 示例 6：长时间任务监控

创建 `long_task.py`：

```python
#!/usr/bin/env python3
import subprocess
import time

def run_long_task(tasks):
    """运行长时间任务并更新状态"""
    for i, task in enumerate(tasks):
        # 更新状态
        subprocess.run([
            'python3',
            '/Users/yangxu/.openclaw/workspace/edenlab/set_status.py',
            'working',
            f'任务 {i+1}/{len(tasks)}: {task["desc"]}'
        ])
        
        # 执行任务
        subprocess.run(task["command"], shell=True)
        
        # 短暂休息
        time.sleep(1)
    
    # 全部完成
    subprocess.run([
        'python3',
        '/Users/yangxu/.openclaw/workspace/edenlab/set_status.py',
        'idle'
    ])

# 使用
tasks = [
    {"desc": "拉取代码", "command": "git pull"},
    {"desc": "安装依赖", "command": "npm install"},
    {"desc": "运行测试", "command": "npm test"},
]

run_long_task(tasks)
```

## 自动状态同步

运行自动状态同步（持续监控）：

```bash
python3 /Users/yangxu/.openclaw/workspace/edenlab/openclaw_sync.py
```

## 查看当前状态

```bash
curl -s http://localhost:3000/status | python3 -m json.tool
```

## 故障排除

### 状态未更新

1. 检查 EdenLab 是否运行：
```bash
curl http://localhost:3000/status
```

2. 检查状态文件：
```bash
cat /Users/yangxu/.openclaw/workspace/edenlab/dean-status.json
```

3. 重启 EdenLab：
```bash
cd /Users/yangxu/.openclaw/workspace/edenlab
npm run dev
```

## 最佳实践

1. **任务开始时更新状态**
   ```bash
   set_status working "开始任务..."
   ```

2. **任务结束时重置为 idle**
   ```bash
   set_status idle
   ```

3. **描述要清晰**
   ```bash
   set_status working "正在分析数据集 A"  # 好
   set_status working "工作中"  # 一般
   ```

4. **处理错误情况**
   ```bash
   try:
       set_status working "执行任务..."
       run_task()
       set_status idle
   except:
       set_status waiting "任务失败"
       raise
   ```

5. **使用自动同步**
   对于长时间运行的服务，使用 openclaw_sync.py 自动同步状态。

## 更多帮助

查看完整文档：
```bash
cat /Users/yangxu/.openclaw/workspace/edenlab/OPENCLAW_INTEGRATION.md
```
