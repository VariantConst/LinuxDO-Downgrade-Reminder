import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, userId, username, trustLevel } = await request.json();

    if (!email || !userId || !username || trustLevel === undefined) {
      return NextResponse.json({ error: "缺少必要的字段" }, { status: 400 });
    }

    const existingRecord = await prisma.$queryRaw`
      SELECT * FROM EmailReminder WHERE userId = ${userId}
    `;

    if (
      existingRecord &&
      Array.isArray(existingRecord) &&
      existingRecord.length > 0
    ) {
      const updatedRecord = await prisma.emailReminder.update({
        where: { id: existingRecord[0].id },
        data: { email, username, trustLevel },
      });

      return NextResponse.json(
        { message: "邮箱提醒已更新", data: updatedRecord },
        { status: 200 }
      );
    }

    const newEmailReminder = await prisma.emailReminder.create({
      data: {
        email,
        username,
        trustLevel,
        userId: userId,
      },
    });

    return NextResponse.json(
      { message: "邮箱提醒已保存", data: newEmailReminder },
      { status: 201 }
    );
  } catch (error) {
    console.error("保存邮箱时出错:", error);
    return NextResponse.json({ error: "保存邮箱时出错" }, { status: 500 });
  }
}
