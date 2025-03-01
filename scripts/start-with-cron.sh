#!/bin/bash

# 设置默认端口
PORT=${PORT:-3000}

echo "启动 Next.js 应用..."
next_pid=""
npm run start &
next_pid=$!

echo "等待应用启动..."
sleep 5

echo "触发定时任务..."
curl -s http://localhost:${PORT}/api/cron > /dev/null 2>&1

cleanup() {
  echo "正在关闭应用..."
  if [ ! -z "$next_pid" ]; then
    kill $next_pid 2>/dev/null
  fi
  
  echo "清理端口 ${PORT} 上的所有进程..."
  lsof -ti:${PORT} | xargs kill -9 2>/dev/null
  
  echo "应用已关闭"
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "应用正在运行，按 Ctrl+C 退出..."
while true; do
  sleep 1
done 