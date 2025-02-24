"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  const handleSignIn = async () => {
    await signIn("linuxdo", {
      callbackUrl: "/",
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2"
    >
      Sign in with Linux DO
    </button>
  );
}
