#!/bin/bash

echo "启动 Next.js 应用..."
next_pid=""
npm run start &
next_pid=$!

echo "等待应用启动..."
sleep 5

echo "触发定时任务..."
curl -s http://localhost:3000/api/cron > /dev/null 2>&1

cleanup() {
  echo "正在关闭应用..."
  if [ ! -z "$next_pid" ]; then
    kill $next_pid 2>/dev/null
  fi
  
  echo "清理端口 3000 上的所有进程..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  
  echo "应用已关闭"
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "应用正在运行，按 Ctrl+C 退出..."
while true; do
  sleep 1
done 