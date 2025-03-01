#!/usr/bin/env node

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { exec, spawn } from "child_process";
import readline from "readline";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = parseInt(process.env.PORT, 10) || 3000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function checkPortInUse(port, callback) {
  const server = createServer();

  server.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      callback(true);
    } else {
      callback(false);
    }
  });

  server.once("listening", () => {
    server.close();
    callback(false);
  });

  server.listen(port);
}

app.prepare().then(() => {
  checkPortInUse(PORT, (inUse) => {
    if (inUse) {
      console.log(`\x1b[33m警告: 端口 ${PORT} 已被占用!\x1b[0m`);
      rl.question(
        "\x1b[36m是否要执行 free-port 命令释放端口? (y/n): \x1b[0m",
        (answer) => {
          if (answer.toLowerCase() === "y") {
            console.log("\x1b[32m正在执行 free-port 命令...\x1b[0m");

            const freePortProcess = spawn("pnpm", ["run", "free-port:auto"], {
              stdio: "inherit",
            });

            freePortProcess.on("close", (code) => {
              if (code === 0) {
                console.log("\x1b[32m端口已释放，正在启动应用...\x1b[0m");
                startServer();
              } else {
                console.error(
                  `\x1b[31mfree-port 命令执行失败，退出码: ${code}\x1b[0m`
                );
                rl.close();
                process.exit(1);
              }
            });
          } else {
            console.log(
              "\x1b[31m应用启动失败: 端口被占用且用户选择不释放端口\x1b[0m"
            );
            rl.close();
            process.exit(1);
          }
        }
      );
    } else {
      startServer();
    }
  });
});

function startServer() {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(
      `\x1b[32m> 应用已启动 - 正在监听 http://localhost:${PORT}\x1b[0m`
    );

    if (!dev) {
      setTimeout(() => {
        console.log("\x1b[36m> 触发定时任务...\x1b[0m");
        exec(`curl -s http://localhost:${PORT}/api/cron > /dev/null 2>&1`);
      }, 5000);
    }
  });

  rl.close();
}
