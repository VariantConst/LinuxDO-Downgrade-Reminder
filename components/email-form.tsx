"use client";

import { useState, useId, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFormProps {
  username: string;
  userId: number;
  trustLevel: number;
}

export function EmailForm({ username, userId, trustLevel }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingEmail, setHasExistingEmail] = useState(false);
  const router = useRouter();
  const emailId = useId();

  useEffect(() => {
    const fetchEmailSetting = async () => {
      try {
        const response = await fetch(`/api/get-email?userId=${userId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.email) {
            const fetchedEmail = data.data.email;
            setEmail(fetchedEmail);
            setOriginalEmail(fetchedEmail);
            setHasExistingEmail(true);
          }
        }
      } catch (error) {
        console.error("获取邮箱设置失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailSetting();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/save-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userId, username, trustLevel }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "保存邮箱失败");
      }

      console.log(
        `保存邮箱: ${email} 用于用户: ${username}(ID: ${userId}), 当前信任等级: ${trustLevel}`
      );

      router.push(`/confirmation?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("提交邮箱失败:", error);
      setError(error instanceof Error ? error.message : "提交邮箱时出错");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailChanged = email !== originalEmail;

  return (
    <div className="w-full">
      <p className="text-xl mb-10 text-muted-foreground leading-relaxed text-center">
        当您的信任等级从{" "}
        <span className="font-medium text-green-600 dark:text-green-400">
          三级
        </span>{" "}
        降到{" "}
        <span className="font-medium text-yellow-600 dark:text-yellow-400">
          二级
        </span>{" "}
        时，我们将通过邮件通知您。
      </p>

      {hasExistingEmail && !isLoading && (
        <div className="mb-8 p-8 bg-gradient-to-b from-gray-50/80 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-900/20 rounded-2xl border border-gray-200/60 dark:border-gray-700/40 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">
                当前邮箱
              </h3>
            </div>
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
              {originalEmail}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              {isEmailChanged ? (
                <span className="text-green-600 dark:text-green-400">
                  您正在修改邮箱地址
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  您可以在下方修改邮箱地址
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="space-y-2"
          style={{ "--ring": "234 89% 74%" } as React.CSSProperties}
        >
          <Label
            htmlFor={emailId}
            className="text-gray-600 dark:text-gray-300 font-medium"
          >
            邮箱地址
          </Label>
          <Input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入您的邮箱地址"
            disabled={isLoading}
            required
            className="py-2.5 px-4 bg-gray-50/80 dark:bg-gray-800/50 border-gray-200/80 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all duration-200"
          />
          {isLoading && (
            <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              正在加载邮箱设置...
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm mt-2 p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400 dark:text-red-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <RainbowButton
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full py-3 sm:py-4 font-medium rounded-lg transition-all duration-300 text-base sm:text-lg shadow-sm hover:shadow-md"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              提交中...
            </span>
          ) : hasExistingEmail ? (
            "确认修改"
          ) : (
            "确认设置"
          )}
        </RainbowButton>
      </form>
    </div>
  );
}
