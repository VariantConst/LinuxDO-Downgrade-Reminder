"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFormProps {
  username: string;
  trustLevel: number;
}

export function EmailForm({ username, trustLevel }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const emailId = useId();

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
      <p className="text-xl mb-10 text-muted-foreground leading-relaxed text-center">
        当您的信任等级从{" "}
        <span className="font-medium text-green-500">三级</span> 降到{" "}
        <span className="font-medium text-yellow-500">二级</span>{" "}
        时，我们将通过邮件通知您。
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="space-y-2"
          style={{ "--ring": "234 89% 74%" } as React.CSSProperties}
        >
          <Label htmlFor={emailId}>邮箱地址</Label>
          <Input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
            required
          />
        </div>

        <RainbowButton
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-4 font-medium rounded-lg transition-colors duration-200 text-base sm:text-lg"
        >
          {isSubmitting ? "提交中..." : "确认设置"}
        </RainbowButton>
      </form>
    </div>
  );
}
