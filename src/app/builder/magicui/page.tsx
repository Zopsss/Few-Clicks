"use client";

import { cn } from "@/lib/utils";
import MagicuiPage from "@/templates/portfolios/magicui/app/page";
import Navbar from "@/templates/portfolios/magicui/components/navbar";
import { ThemeProvider } from "@/templates/portfolios/magicui/components/theme-provider";
import { TooltipProvider } from "@/templates/portfolios/magicui/components/ui/tooltip";
import { TemplateDataProvider } from "@/templates/portfolios/magicui/data/use-data";
import { geist, geistMono } from "@/templates/portfolios/magicui/lib/fonts";
import {
  MagicuiStoreProvider,
  useMagicuiStore,
} from "@/providers/magicui-store-provider";

export default function BuilderMagicuiPage() {
  return (
    <MagicuiStoreProvider>
      <Preview />
    </MagicuiStoreProvider>
  );
}

function Preview() {
  const data = useMagicuiStore((s) => s.data);
  const patch = useMagicuiStore((s) => s.patch);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider delayDuration={0}>
        <TemplateDataProvider value={data}>
          <div className={cn("font-sans", geist.variable, geistMono.variable)}>
            <DebugPanel
              currentName={data.name}
              onMutate={() =>
                patch("name", `Edited at ${new Date().toLocaleTimeString()}`)
              }
            />
            <div className="relative max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
              <MagicuiPage />
            </div>
            <Navbar />
          </div>
        </TemplateDataProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

function DebugPanel({
  currentName,
  onMutate,
}: {
  currentName: string;
  onMutate: () => void;
}) {
  return (
    <div className="border-b bg-muted px-6 py-3 flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground">
        Phase 2 sanity check —
      </span>
      <button
        type="button"
        onClick={onMutate}
        className="rounded bg-primary text-primary-foreground px-3 py-1 text-xs font-medium hover:opacity-90"
      >
        Mutate name
      </button>
      <span className="text-xs">
        Current: <strong>{currentName}</strong>
      </span>
    </div>
  );
}
