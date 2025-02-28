# Linux.do 降级提醒系统

这是一个为 Linux.do 社区用户提供信任级别变更提醒的系统。当用户的信任级别从 3 降至 2 时，系统会自动发送邮件提醒。

## 功能特点

- 定期检查用户信任级别变化
- 当用户从信任级别 3 降至 2 时，自动发送邮件提醒
- 使用 Next.js 和 Prisma 构建，支持 SQLite 数据库

## 安装与设置

1. 克隆仓库

```bash
git clone https://github.com/yourusername/linuxdo-downgrade-reminder.git
cd linuxdo-downgrade-reminder
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

复制 `.env.example` 文件为 `.env`，并填写相应的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写以下信息：

- SMTP 邮件服务配置
- Next Auth 配置（如果使用）

4. 初始化数据库

```bash
pnpm prisma migrate dev --name init
```

5. 构建应用

```bash
pnpm build
```

6. 启动应用

```bash
pnpm start
```

应用启动后，会自动开启定时任务，每天检查用户信任级别变化。

## 数据库模型

系统使用 `EmailReminder` 模型存储用户信息：

```prisma
model EmailReminder {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  userId     Int      @unique
  username   String
  trustLevel Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 定时任务

系统会在以下情况下启动定时任务：

1. 应用启动时（通过 `pnpm start` 命令）
2. 手动访问 `/api/cron` 接口

定时任务会每天凌晨 2 点（中国时区）执行，检查所有用户的信任级别变化。

## 手动添加用户

可以通过 Prisma Studio 手动添加需要监控的用户：

```bash
pnpm prisma studio
```

然后在浏览器中打开 http://localhost:5555 ，添加用户信息。

## 许可证

MIT
