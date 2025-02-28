"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LoginButton } from "./login-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubLink } from "@/components/ui/github-link";

export default function LoginPage() {
  return (
    <AuroraBackground>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <GitHubLink />
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-5xl md:text-8xl font-bold text-foreground text-center">
          Linux DO
        </div>
        <div className="font-extralight text-lg md:text-4xl text-muted-foreground py-4">
          Downgrade Reminder
        </div>
        <LoginButton />
      </motion.div>
    </AuroraBackground>
  );
}
