"use client";

import { ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Viewport = "mobile" | "tablet" | "desktop";

export const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  mobile: "w-[390px]",
  tablet: "w-[820px]",
  desktop: "w-full",
};

const VIEWPORTS: { id: Viewport; label: string; Icon: typeof Smartphone }[] = [
  { id: "mobile", label: "Mobile", Icon: Smartphone },
  { id: "tablet", label: "Tablet", Icon: Tablet },
  { id: "desktop", label: "Desktop", Icon: Monitor },
];

export interface PreviewToolbarProps {
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  previewUrl: string;
}

export function PreviewToolbar({
  viewport,
  onViewportChange,
  previewUrl,
}: PreviewToolbarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b bg-card px-3">
      <div className="flex flex-1 justify-center">
        <div className="flex items-center gap-1 rounded-lg border bg-background p-0.5">
          {VIEWPORTS.map(({ id, label, Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size="icon-sm"
              aria-label={label}
              aria-pressed={viewport === id}
              onClick={() => onViewportChange(id)}
              className={cn(
                viewport === id &&
                  "bg-muted text-foreground dark:bg-muted/50",
              )}
            >
              <Icon />
            </Button>
          ))}
        </div>
      </div>
      <Button variant="outline" size="sm" asChild>
        <a href={previewUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink data-icon="inline-start" />
          Preview
        </a>
      </Button>
    </div>
  );
}
