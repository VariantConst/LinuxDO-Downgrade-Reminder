import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return NextResponse.json({ error: "用户ID必须是数字" }, { status: 400 });
    }

    // 查询用户的邮箱设置
    const whereCondition: Prisma.EmailReminderWhereInput = {
      userId: userIdNum,
    };

    const emailReminder = await prisma.emailReminder.findFirst({
      where: whereCondition,
    });

    if (!emailReminder) {
      return NextResponse.json(
        { message: "未找到邮箱设置", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "成功获取邮箱设置", data: emailReminder },
      { status: 200 }
    );
  } catch (error) {
    console.error("获取邮箱设置时出错:", error);
    return NextResponse.json({ error: "获取邮箱设置时出错" }, { status: 500 });
  }
}
