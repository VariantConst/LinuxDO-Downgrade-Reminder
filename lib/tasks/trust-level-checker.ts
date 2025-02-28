import cron from "node-cron";
import prisma from "../prisma";
import { getUserInfo } from "../linuxdo-api";
import { sendDowngradeReminder } from "../email";

async function checkUserTrustLevel(
  email: string,
  userId: number,
  username: string,
  currentTrustLevel: number
) {
  try {
    const userInfo = await getUserInfo(username);

    if (!userInfo) {
      console.log(`无法获取用户 ${username} 的信息，跳过检查`);
      return;
    }

    userInfo.trust_level = 2;

    if (userInfo.trust_level !== currentTrustLevel) {
      console.log(
        `用户 ${username} 的信任级别从 ${currentTrustLevel} 变为 ${userInfo.trust_level}`
      );

      await prisma.emailReminder.update({
        where: { userId },
        data: { trustLevel: userInfo.trust_level, updatedAt: new Date() },
      });

      if (currentTrustLevel === 3 && userInfo.trust_level === 2) {
        await sendDowngradeReminder(
          email,
          username,
          currentTrustLevel,
          userInfo.trust_level
        );
        console.log(`已向 ${email} 发送降级提醒邮件`);
      }
    }
  } catch (error) {
    console.error(`检查用户 ${username} 信任级别时出错:`, error);
  }
}

async function checkAllUsersTrustLevels() {
  try {
    console.log("开始检查所有用户的信任级别...");

    const users = await prisma.emailReminder.findMany();

    const concurrencyLimit = 5;
    const chunks = [];

    for (let i = 0; i < users.length; i += concurrencyLimit) {
      chunks.push(users.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map((user) =>
          checkUserTrustLevel(
            user.email,
            user.userId,
            user.username,
            user.trustLevel
          )
        )
      );

      if (chunks.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("所有用户 Trust Level 检查完成");
  } catch (error) {
    console.error("检查用户 Trust Level 时出错:", error);
  }
}

export function startTrustLevelChecker() {
  const schedule = "47 1 * * *";

  console.log(`Trust Level 检查任务已启动，计划: ${schedule}`);

  const task = cron.schedule(schedule, checkAllUsersTrustLevels, {
    scheduled: true,
    timezone: "Asia/Shanghai",
  });

  checkAllUsersTrustLevels();

  return task;
}
