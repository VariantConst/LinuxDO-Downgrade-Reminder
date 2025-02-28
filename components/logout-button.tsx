"use client";

import { signOut } from "next-auth/react";
import React from "react";

export function LogoutButton() {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-transparent border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 rounded-lg px-6 py-2.5 font-medium transition-all duration-200 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-1"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      退出登录
    </button>
  );
}
