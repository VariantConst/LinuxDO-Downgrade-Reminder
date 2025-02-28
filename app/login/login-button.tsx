"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  const handleSignIn = async () => {
    await signIn("linuxdo", {
      callbackUrl: "/",
    });
  };

  return (
    <Button
      onClick={handleSignIn}
      className="px-6 py-3 text-primary-foreground font-medium rounded-full text-lg bg-primary hover:bg-primary/90"
    >
      使用 Linux DO 登录
    </Button>
  );
}
