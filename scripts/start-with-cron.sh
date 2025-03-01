#!/bin/bash

# 启动 Next.js 应用
echo "启动 Next.js 应用..."
next_pid=""
npm run start &
next_pid=$!

# 等待应用启动
echo "等待应用启动..."
sleep 5

# 触发定时任务
echo "触发定时任务..."
curl -s http://localhost:3000/api/cron > /dev/null 2>&1

# 设置退出处理函数
cleanup() {
  echo "正在关闭应用..."
  if [ ! -z "$next_pid" ]; then
    kill $next_pid 2>/dev/null
  fi
  
  # 查找并杀死所有在 3000 端口上运行的进程
  echo "清理端口 3000 上的所有进程..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  
  echo "应用已关闭"
  exit 0
}

# 捕获 SIGINT (Ctrl+C) 和 SIGTERM 信号
trap cleanup SIGINT SIGTERM

# 保持脚本运行
echo "应用正在运行，按 Ctrl+C 退出..."
while true; do
  sleep 1
done 