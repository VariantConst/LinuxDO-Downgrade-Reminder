# Linux.do 降级提醒系统

这是一个为 Linux.do 社区用户提供信任级别变更提醒的系统。当用户的信任级别从 3 降至 2 时，系统会自动发送邮件提醒。

## 功能特点

- 定期检查用户信任级别变化
- 当用户从信任级别 3 降至 2 时，自动发送邮件提醒
- 使用 Next.js 和 Prisma 构建，支持 SQLite 数据库
- 智能端口检测，当端口被占用时提示用户释放
- 支持 Linux.do OAuth 登录认证

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

环境变量详细说明：

```
# 数据库配置
DATABASE_URL="file:./dev.db"  # SQLite数据库文件路径

# Gmail 配置
GMAIL_USER=your-gmail-address@gmail.com  # 用于发送邮件的Gmail地址
GMAIL_APP_PASSWORD=your-gmail-app-password  # Gmail应用密码

# Next Auth 配置
NEXTAUTH_SECRET=your-secret-here  # NextAuth加密密钥，可使用随机字符串
NEXTAUTH_URL=http://localhost:3000  # 应用URL，生产环境需修改为实际域名
LINUXDO_CLIENT_ID=your-client-id  # Linux.do OAuth客户端ID
LINUXDO_CLIENT_SECRET=your-client-secret  # Linux.do OAuth客户端密钥
```

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

### 手动释放端口

如果需要手动释放端口，可以执行：

```bash
pnpm free-port
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

## 环境变量配置详解

### 数据库配置

```
DATABASE_URL="file:./dev.db"
```

此项配置指定了 SQLite 数据库文件的位置。默认情况下，数据库文件将存储在项目根目录下的`dev.db`文件中。如果需要更改数据库位置或使用其他类型的数据库，请修改此配置。

### Gmail 配置

```
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

这些配置用于设置发送邮件通知的 Gmail 账户信息：

- `GMAIL_USER`：您的 Gmail 邮箱地址
- `GMAIL_APP_PASSWORD`：Gmail 应用密码（不是您的 Gmail 账户密码）

### Next Auth 配置

```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
LINUXDO_CLIENT_ID=your-client-id
LINUXDO_CLIENT_SECRET=your-client-secret
```

这些配置用于设置 NextAuth 认证和 Linux.do OAuth 登录：

- `NEXTAUTH_SECRET`：用于加密会话和令牌的密钥，建议使用随机生成的字符串
- `NEXTAUTH_URL`：应用的完整 URL，开发环境通常为`http://localhost:3000`，生产环境需要修改为实际域名
- `LINUXDO_CLIENT_ID`：从 Linux.do 获取的 OAuth 客户端 ID
- `LINUXDO_CLIENT_SECRET`：从 Linux.do 获取的 OAuth 客户端密钥

## Linux.do OAuth 配置指南

要使用 Linux.do 的 OAuth 登录功能，您需要在 Linux.do 平台注册一个应用并获取客户端 ID 和密钥：

1. 登录到 Linux.do 平台
2. 访问开发者设置页面
3. 创建一个新的 OAuth 应用
4. 设置应用名称和重定向 URL（例如：`http://localhost:3000/api/auth/callback/linuxdo`）
5. 提交申请后，您将获得客户端 ID 和客户端密钥
6. 将这些值分别填入`LINUXDO_CLIENT_ID`和`LINUXDO_CLIENT_SECRET`环境变量

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

在 `.env` 文件中配置以下环境变量：

```
GMAIL_USER=您的Gmail地址
GMAIL_APP_PASSWORD=您的应用密码
```

注意：

- 应用密码是一个 16 位的字符串，中间没有空格
- 应用密码提供了一种安全的方式来允许特定应用访问您的 Google 账户，而无需使用您的主密码
- 您可以随时在 Google 账户安全设置中撤销应用密码

## 故障排除

如果您在使用过程中遇到问题，请检查以下几点：

1. 确保所有环境变量都已正确配置
2. 检查数据库连接是否正常
3. 确保 Gmail 应用密码正确且未过期
4. 检查 Linux.do OAuth 配置是否正确
5. 查看应用日志以获取更详细的错误信息

如果问题仍然存在，请提交 issue 或联系维护者获取帮助。
