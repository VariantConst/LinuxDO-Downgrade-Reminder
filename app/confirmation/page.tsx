"use client";

import { useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import type { ConfettiRef } from "@/components/ui/confetti";
import { Confetti } from "@/components/ui/confetti";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubLink } from "@/components/ui/github-link";
import { LogoutButton } from "@/components/logout-button";

export default function ConfirmationPage() {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    // 页面加载时触发单一壮观的烟花效果
    const timer = setTimeout(() => {
      launchSingleFirework();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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
        <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-muted-foreground">
          我们已成功设置您的提醒邮箱。当您的信任等级从{" "}
          <span className="font-medium text-green-500">三级</span> 降至{" "}
          <span className="font-medium text-yellow-500">二级</span> 时，
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
