"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type DataMessage,
  PREVIEW_SOURCE,
  isPreviewMessage,
} from "@/lib/preview-protocol";
import { useMagicuiStore } from "@/providers/magicui-store-provider";
import type { Data } from "@/templates/portfolios/magicui/data/schema";

const PREVIEW_URL = "/preview/magicui";

type Viewport = "mobile" | "tablet" | "desktop";

const VIEWPORTS: {
  id: Viewport;
  label: string;
  Icon: typeof Smartphone;
  width: string;
}[] = [
  { id: "mobile", label: "Mobile", Icon: Smartphone, width: "w-[390px]" },
  { id: "tablet", label: "Tablet", Icon: Tablet, width: "w-[820px]" },
  { id: "desktop", label: "Desktop", Icon: Monitor, width: "w-full" },
];

export default function BuilderMagicuiPage() {
  const data = useMagicuiStore((s) => s.data);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");

  const sendData = (target: Window | null, payload: Data) => {
    if (!target) return;

    const message: DataMessage<Data> = {
      source: PREVIEW_SOURCE,
      type: "data",
      payload,
    };

    target.postMessage(message, window.location.origin);
  };

  useEffect(() => {
    sendData(iframeRef.current?.contentWindow ?? null, data);
  }, [data]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isPreviewMessage(event.data)) return;

      if (event.data.type === "ready") {
        sendData(iframeRef.current?.contentWindow ?? null, data);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [data]);

  const activeWidth =
    VIEWPORTS.find((v) => v.id === viewport)?.width ?? "w-full";

  return (
    <div className="flex flex-1 flex-col">
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
                onClick={() => setViewport(id)}
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
          <a href={PREVIEW_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink data-icon="inline-start" />
            Preview
          </a>
        </Button>
      </div>
      <div className="flex flex-1 justify-center overflow-auto bg-muted/30 p-4">
        <iframe
          ref={iframeRef}
          src={PREVIEW_URL}
          title="Magicui preview"
          className={cn(
            "h-full rounded-md border bg-background shadow-sm transition-[width] duration-200 ease-out",
            activeWidth,
          )}
        />
      </div>
    </div>
  );
}
