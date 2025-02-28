"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        设置提醒邮箱
      </h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        当您的信任等级从{" "}
        <span className="font-medium text-blue-700">{trustLevel}</span> 级降至{" "}
        <span className="font-medium text-blue-700">{trustLevel - 1}</span>{" "}
        级时， 我们将通过邮件通知您。
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            邮箱地址
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱地址"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? "提交中..." : "确认设置"}
        </Button>
      </form>
    </div>
  );
}
