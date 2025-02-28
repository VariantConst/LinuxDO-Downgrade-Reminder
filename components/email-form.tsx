"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";

interface EmailFormProps {
  username: string;
  trustLevel: number;
}

export function EmailForm({ username, trustLevel }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 这里可以添加实际的API调用来保存邮箱
      // await fetch('/api/save-email', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, username })
      // });

      console.log(
        `保存邮箱: ${email} 用于用户: ${username}, 当前信任等级: ${trustLevel}`
      );

      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 提交成功后跳转到确认页面
      router.push("/confirmation");
    } catch (error) {
      console.error("提交邮箱失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <p className="text-xl mb-10 text-gray-600 leading-relaxed text-center">
        请输入您的邮箱地址，当您的信任等级发生变化时，我们将通过邮件通知您。
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱地址"
              required
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent bg-white text-gray-800 text-base sm:text-lg"
            />
          </div>
        </div>

        <RainbowButton
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-4 text-white font-medium rounded-lg transition-colors duration-200 text-base sm:text-lg"
        >
          {isSubmitting ? "提交中..." : "确认设置"}
        </RainbowButton>
      </form>
    </div>
  );
}
