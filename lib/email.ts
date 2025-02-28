import nodemailer from "nodemailer";

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

// 发送降级提醒邮件
export async function sendDowngradeReminder(
  email: string,
  username: string,
  oldTrustLevel: number,
  newTrustLevel: number
) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@example.com",
      to: email,
      subject: "【Linux.do】信任等级变更提醒",
      html: `
        <h1>信任等级变更提醒</h1>
        <p>尊敬的 ${username}：</p>
        <p>我们检测到您在 Linux.do 社区的信任等级已从 <strong>${oldTrustLevel}</strong> 降至 <strong>${newTrustLevel}</strong>。</p>
        <p>信任等级的变更可能会影响您在社区中的某些权限。如有疑问，请联系社区管理员或查看社区规则了解更多信息。</p>
        <p>此邮件为自动发送，请勿直接回复。</p>
        <p>Linux.do 社区</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`降级提醒邮件已发送至 ${email}，消息ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("发送降级提醒邮件失败:", error);
    return false;
  }
}
