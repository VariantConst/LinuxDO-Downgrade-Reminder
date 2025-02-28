"use client";

import { signOut } from "next-auth/react";
import React, { useState } from "react";

export function LogoutButton() {
  const [isHovering, setIsHovering] = useState(false);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <button
      onClick={handleSignOut}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative px-5 py-2 rounded-full overflow-hidden text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 flex items-center text-base sm:text-lg group"
      style={{
        background: "linear-gradient(to right, #f5f5f5, #ffffff)",
        boxShadow: isHovering
          ? "0 4px 15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.2)"
          : "0 2px 10px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* 微妙的彩虹边框效果 */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1, #ff9ff3)",
          backgroundSize: "200% 200%",
          animation: "gradient 2s ease infinite",
        }}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      <span className="relative z-10">退出</span>

      {/* 添加全局样式 */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </button>
  );
}
