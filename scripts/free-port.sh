#!/bin/bash

if [ -z "$1" ]; then
  echo "用法: $0 <端口号> [auto_confirm]"
  echo "例如: $0 3000"
  echo "或者: $0 \${PORT:-3000} y (自动确认，使用环境变量PORT或默认3000)"
  exit 1
fi

PORT=$1
AUTO_CONFIRM=$2

echo "查找使用端口 $PORT 的进程..."
PIDS=$(lsof -ti:$PORT)

if [ -z "$PIDS" ]; then
  echo "没有进程使用端口 $PORT"
  exit 0
fi

echo "以下进程正在使用端口 $PORT:"
for PID in $PIDS; do
  PROCESS_INFO=$(ps -p $PID -o pid,ppid,user,command | tail -n +2)
  echo "$PROCESS_INFO"
done

if [ ! -z "$AUTO_CONFIRM" ]; then
  CONFIRM=$AUTO_CONFIRM
else
  read -p "是否终止这些进程? (y/n): " CONFIRM
fi

if [ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ]; then
  echo "正在终止进程..."
  for PID in $PIDS; do
    kill -9 $PID
    echo "已终止进程 $PID"
  done
  echo "端口 $PORT 已释放"
  exit 0
else
  echo "操作已取消"
  exit 1
fi 