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
      className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2"
    >
      退出登录
    </button>
  );
}
