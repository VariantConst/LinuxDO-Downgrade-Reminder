"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import type { ConfettiRef } from "@/components/ui/confetti";
import { Confetti } from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  const confettiRef = useRef<ConfettiRef>(null);
  const router = useRouter();

  useEffect(() => {
    // 页面加载时触发单一壮观的烟花效果
    const timer = setTimeout(() => {
      launchFullscreenFirework();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const launchFullscreenFirework = () => {
    // 创建一个上升然后爆炸的烟花效果
    const defaults = {
      startVelocity: 25,
      ticks: 200, // 增加ticks使动画更持久
      gravity: 0.5, // 降低重力使烟花下落更慢
      decay: 0.94, // 调整衰减速度，使粒子持续更长时间
      shapes: ["circle", "square"],
      zIndex: 0,
    };

    // 先发射一个小的烟花上升
    confetti({
      particleCount: 10,
      angle: 90,
      spread: 20,
      origin: { x: 0.5, y: 0.9 },
      colors: ["#888", "#555", "#333"],
      ...defaults,
    });

    // 然后在顶部爆炸成大烟花
    setTimeout(() => {
      // 中央爆炸
      confetti({
        particleCount: 250,
        origin: { x: 0.5, y: 0.5 },
        spread: 180,
        ...defaults,
      });

      // 左侧爆炸
      setTimeout(() => {
        confetti({
          particleCount: 150,
          origin: { x: 0.3, y: 0.4 },
          spread: 160,
          ...defaults,
        });
      }, 200);

      // 右侧爆炸
      setTimeout(() => {
        confetti({
          particleCount: 150,
          origin: { x: 0.7, y: 0.4 },
          spread: 160,
          ...defaults,
        });
      }, 400);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-white">
      <div className="text-center max-w-xl mx-auto z-10">
        <h1 className="text-5xl font-bold mb-8 text-gray-800">设置成功！</h1>
        <p className="text-xl mb-10 text-gray-600">
          我们已成功设置您的提醒邮箱。当您的信任等级从 3 级降至 2
          级时，我们将立即通知您。
        </p>

        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="w-64 h-14 text-lg text-gray-700 border-gray-400 hover:bg-gray-100"
        >
          返回首页
        </Button>
      </div>

      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 w-full h-full"
      />
    </div>
  );
}
