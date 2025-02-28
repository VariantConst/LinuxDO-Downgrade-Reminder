"use client";

import { signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [mounted, setMounted] = useState(false);

  // 在客户端挂载后才渲染按钮
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  if (!mounted) {
    return <div className="w-9 h-9" />; // 占位符，保持布局稳定
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleSignOut}
      className="rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/20 transition-colors w-9 h-9 p-0"
    >
      <LogOut className="h-[1.2rem] w-[1.2rem] text-foreground" />
      <span className="sr-only">退出登录</span>
    </Button>
  );
}
