#!/bin/bash

# 检查是否提供了端口参数
if [ -z "$1" ]; then
  echo "用法: $0 <端口号> [auto_confirm]"
  echo "例如: $0 3000"
  echo "或者: $0 3000 y (自动确认)"
  exit 1
fi

PORT=$1
AUTO_CONFIRM=$2

# 查找使用指定端口的进程
echo "查找使用端口 $PORT 的进程..."
PIDS=$(lsof -ti:$PORT)

if [ -z "$PIDS" ]; then
  echo "没有进程使用端口 $PORT"
  exit 0
fi

# 显示进程信息
echo "以下进程正在使用端口 $PORT:"
for PID in $PIDS; do
  # 获取进程信息
  PROCESS_INFO=$(ps -p $PID -o pid,ppid,user,command | tail -n +2)
  echo "$PROCESS_INFO"
done

# 如果提供了自动确认参数，则使用它
if [ ! -z "$AUTO_CONFIRM" ]; then
  CONFIRM=$AUTO_CONFIRM
else
  # 否则，询问用户确认
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