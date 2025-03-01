import nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";

export async function sendDowngradeReminder(
  email: string,
  username: string,
  oldTrustLevel: number,
  newTrustLevel: number
) {
  try {
    const emailContent = `
      <h1>信任等级变更提醒</h1>
      <p>尊敬的 ${username}：</p>
      <p>我们检测到您在 Linux DO 社区的信任等级已从 <strong>${oldTrustLevel}</strong> 降至 <strong>${newTrustLevel}</strong>。</p>
      <p>此邮件为自动发送，请勿直接回复。</p>
      <a href="https://linuxdo-reminder.variantconst.com">Linux DO Downgrade Reminder</a>
    `;

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("发送邮件超时")), 30000);
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: "【Linux DO Downgrade Reminder】信任等级变更提醒",
      html: emailContent,
    };

    const sendPromise = new Promise<SentMessageInfo>((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

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
