import { NextResponse } from "next/server";
import { startTrustLevelChecker } from "@/lib/tasks/trust-level-checker";

let trustLevelCheckerTask: ReturnType<typeof startTrustLevelChecker> | null =
  null;

export async function GET() {
  try {
    if (trustLevelCheckerTask) {
      trustLevelCheckerTask.stop();
      console.log("已停止旧的 Trust Level 检查任务");
    }

    trustLevelCheckerTask = startTrustLevelChecker();

    return NextResponse.json({
      success: true,
      message: "Trust Level 检查任务已启动",
    });
  } catch (error) {
    console.error("启动 Trust Level 检查任务失败:", error);

    return NextResponse.json(
      {
        success: false,
        message: "启动 Trust Level 检查任务失败",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
