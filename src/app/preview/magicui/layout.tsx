"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MagicuiStoreProvider } from "@/providers/magicui-store-provider";
import { ThemeProvider } from "@/templates/portfolios/magicui/components/theme-provider";
import { TooltipProvider } from "@/templates/portfolios/magicui/components/ui/tooltip";
import { geist, geistMono } from "@/templates/portfolios/magicui/lib/fonts";

export default function PreviewMagicuiLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MagicuiStoreProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider delayDuration={0}>
          <div
            className={cn(
              "font-sans min-h-screen",
              geist.variable,
              geistMono.variable,
            )}
          >
            {children}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </MagicuiStoreProvider>
  );
}
