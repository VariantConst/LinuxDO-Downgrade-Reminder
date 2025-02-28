"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import type { ConfettiRef } from "@/components/ui/confetti";
import { Confetti } from "@/components/ui/confetti";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubLink } from "@/components/ui/github-link";
import { LogoutButton } from "@/components/logout-button";

// 创建一个包含useSearchParams的组件
function ConfirmationContent() {
  const confettiRef = useRef<ConfettiRef>(null);
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // 获取 URL 中的邮箱参数
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // 页面加载时触发单一壮观的烟花效果
    const timer = setTimeout(() => {
      launchSingleFirework();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const launchSingleFirework = () => {
    // 创建一个壮观的烟花效果
    const defaults = {
      startVelocity: 25,
      ticks: 200, // 增加ticks使动画更持久
      gravity: 0.5, // 降低重力使烟花下落更慢
      decay: 0.94, // 调整衰减速度，使粒子持续更长时间
      shapes: ["circle", "square"],
      zIndex: 0,
    };

    // 只放一次壮观的烟花
    confetti({
      particleCount: 250,
      origin: { x: 0.5, y: 0.5 },
      spread: 180,
      ...defaults,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-background p-4">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <GitHubLink />
        <ThemeToggle />
        <LogoutButton />
      </div>
      <div className="text-center max-w-xl mx-auto z-10 px-4 sm:px-0">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 text-foreground">
          设置成功！
        </h1>
        <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-muted-foreground">
          我们已成功设置您的提醒邮箱：
        </p>
        {email && (
          <p className="text-xl sm:text-2xl font-medium mb-8 sm:mb-10 text-primary">
            {email}
          </p>
        )}
        <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-muted-foreground">
          当您的信任等级从{" "}
          <span className="font-medium text-green-800/80">三级</span> 降至{" "}
          <span className="font-medium text-yellow-800/80">二级</span> 时，
          我们将立即通知您。
        </p>
      </div>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 w-full h-full"
      />
    </div>
  );
}

// 主页面组件使用Suspense包裹内容组件
export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          加载中...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
