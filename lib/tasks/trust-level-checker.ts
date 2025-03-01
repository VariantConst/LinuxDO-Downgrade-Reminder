import cron from "node-cron";
import prisma from "../prisma";
import { getUserInfo } from "../linuxdo-api";
import { sendDowngradeReminder } from "../email";

// 定义需要通知的用户类型
interface UserToNotify {
  email: string;
  username: string;
  oldTrustLevel: number;
  newTrustLevel: number;
}

async function checkUserTrustLevel(
  email: string,
  userId: number,
  username: string,
  currentTrustLevel: number
): Promise<UserToNotify | null> {
  try {
    const userInfo = await getUserInfo(username);

    if (!userInfo) {
      console.log(`无法获取用户 ${username} 的信息，跳过检查`);
      return null;
    }

    // 测试用，实际应使用API返回的信任级别
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
        // 返回需要发送提醒的用户信息
        return {
          email,
          username,
          oldTrustLevel: currentTrustLevel,
          newTrustLevel: userInfo.trust_level,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`检查用户 ${username} 信任级别时出错:`, error);
    return null;
  }
}

async function checkAllUsersTrustLevels() {
  try {
    console.log("开始检查所有用户的信任级别...");

    const users = await prisma.emailReminder.findMany();
    const usersToNotify: UserToNotify[] = [];

    const concurrencyLimit = 3;
    const chunks = [];

    for (let i = 0; i < users.length; i += concurrencyLimit) {
      chunks.push(users.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
      const results = await Promise.all(
        chunk.map((user) =>
          checkUserTrustLevel(
            user.email,
            user.userId,
            user.username,
            user.trustLevel
          )
        )
      );

      // 收集需要通知的用户
      results.forEach((result) => {
        if (result) {
          usersToNotify.push(result);
        }
      });

      if (chunks.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    console.log("所有用户 Trust Level 检查完成");

    // 如果有需要通知的用户，一次性发送所有通知
    if (usersToNotify.length > 0) {
      console.log(`共有 ${usersToNotify.length} 个用户需要发送降级提醒`);

      // 批量发送邮件
      const emailResults = await Promise.all(
        usersToNotify.map((user) =>
          sendDowngradeReminder(
            user.email,
            user.username,
            user.oldTrustLevel,
            user.newTrustLevel
          )
        )
      );

      const successCount = emailResults.filter((result) => result).length;
      console.log(
        `成功发送 ${successCount}/${usersToNotify.length} 封降级提醒邮件`
      );
    } else {
      console.log("没有用户需要发送降级提醒");
    }
  } catch (error) {
    console.error("检查用户 Trust Level 时出错:", error);
  }
}

export function startTrustLevelChecker() {
  const schedule = "52 1 * * *";

  console.log(`Trust Level 检查任务已启动，计划: ${schedule}`);

  const task = cron.schedule(schedule, checkAllUsersTrustLevels, {
    scheduled: true,
    timezone: "Asia/Shanghai",
  });

  checkAllUsersTrustLevels();

  return task;
}
