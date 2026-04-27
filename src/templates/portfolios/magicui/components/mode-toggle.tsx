"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="link"
      size="icon"
      className={cn(className)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="h-full w-full" />
      <MoonIcon className="hidden h-full w-full" />
    </Button>
  );
}
