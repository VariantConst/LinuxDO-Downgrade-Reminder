# Linux.do 降级提醒系统

这是一个为 Linux.do 社区用户提供信任级别变更提醒的系统。当用户的信任级别从 3 降至 2 时，系统会自动发送邮件提醒。

## 功能特点

- 定期检查用户信任级别变化
- 当用户从信任级别 3 降至 2 时，自动发送邮件提醒
- 使用 Next.js 和 Prisma 构建，支持 SQLite 数据库
- 智能端口检测，当端口被占用时提示用户释放

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

有多种方式可以启动应用：

### 标准启动

```bash
pnpm start
```

### 带定时任务的启动

```bash
pnpm start:with-cron
```

### 安全启动（带端口检测）

```bash
pnpm start:custom
```

使用安全启动模式时，系统会自动检测 3000 端口是否被占用。如果端口被占用，会提示您是否要释放该端口。选择 'y' 将执行 `free-port` 命令释放端口。系统会自动确认终止占用端口的进程，无需再次手动确认。

### 手动释放端口

如果需要手动释放端口，可以执行：

```bash
pnpm free-port
```

此命令会显示占用端口的进程，并询问是否终止这些进程。

如果需要自动确认终止进程，可以使用：

```bash
pnpm free-port:auto
```

此命令会自动终止占用端口的进程，无需手动确认。

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

# Gmail 配置指南

本项目使用 Gmail 和应用密码发送邮件通知。要配置 Gmail，请按照以下步骤操作：

## 1. 确保您的 Google 账户已启用两步验证

1. 访问 [Google 账户安全设置](https://myaccount.google.com/security)
2. 在"登录 Google"部分，确保"两步验证"已开启
3. 如果尚未开启，请按照提示开启两步验证

## 2. 创建应用密码

1. 访问 [Google 账户安全设置](https://myaccount.google.com/security)
2. 在"登录 Google"部分，点击"应用密码"
   - 如果看不到此选项，请确保已启用两步验证
3. 在"选择应用"下拉菜单中选择"其他（自定义名称）"
4. 输入一个描述性名称，例如"Linux.do 降级提醒"
5. 点击"生成"
6. 系统将显示一个 16 位的应用密码，请记下此密码
   - 注意：这是您唯一能看到此密码的机会，请立即复制并保存

## 3. 配置环境变量

在 `.env.local` 文件中配置以下环境变量：

```
GMAIL_USER=您的Gmail地址
GMAIL_APP_PASSWORD=您的应用密码
```

注意：

- 应用密码是一个 16 位的字符串，中间没有空格
- 应用密码提供了一种安全的方式来允许特定应用访问您的 Google 账户，而无需使用您的主密码
- 您可以随时在 Google 账户安全设置中撤销应用密码
