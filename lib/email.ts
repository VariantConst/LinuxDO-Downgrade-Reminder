import nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer";

// Gmail 配置
const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";

// 发送降级提醒邮件
export async function sendDowngradeReminder(
  email: string,
  username: string,
  oldTrustLevel: number,
  newTrustLevel: number
) {
  try {
    // 构建邮件内容
    const emailContent = `
      <h1>信任等级变更提醒</h1>
      <p>尊敬的 ${username}：</p>
      <p>我们检测到您在 Linux.do 社区的信任等级已从 <strong>${oldTrustLevel}</strong> 降至 <strong>${newTrustLevel}</strong>。</p>
      <p>信任等级的变更可能会影响您在社区中的某些权限。如有疑问，请联系社区管理员或查看社区规则了解更多信息。</p>
      <p>此邮件为自动发送，请勿直接回复。</p>
      <p>Linux DO Downgrade Reminder</p>
    `;

    // 设置超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("发送邮件超时")), 30000); // 30秒超时
    });

    // 使用应用密码发送邮件
    // 创建 nodemailer 传输器
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD, // 使用应用密码
      },
    });

    // 准备邮件选项
    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: "【Linux.do】信任等级变更提醒",
      html: emailContent,
    };

    // 发送邮件
    const sendPromise = new Promise<SentMessageInfo>((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    // 使用 Promise.race 实现超时控制
    const info = (await Promise.race([
      sendPromise,
      timeoutPromise,
    ])) as SentMessageInfo;

    console.log(`降级提醒邮件已发送至 ${email}，消息ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("发送降级提醒邮件失败:", error);
    return false;
  }
}
