"use client";

import React from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GitHubLink() {
  return (
    <a
      href="https://github.com/VariantConst/LinuxDO-Downgrade-Reminder"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex"
      aria-label="GitHub 仓库"
    >
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/10 backdrop-blur-sm hover:bg-background/20 transition-colors w-9 h-9 p-0"
      >
        <Github className="h-[1.2rem] w-[1.2rem] text-foreground" />
        <span className="sr-only">GitHub 仓库</span>
      </Button>
    </a>
  );
}
