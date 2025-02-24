"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LoginButton } from "./login-button";

export default function LoginPage() {
  return (
    <AuroraBackground>
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
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Welcome to Linux DO
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Downgrade Reminder
        </div>
        <LoginButton />
      </motion.div>
    </AuroraBackground>
  );
}
