"use client";

import { useEffect, useRef, useState } from "react";

import {
  PreviewToolbar,
  VIEWPORT_WIDTHS,
  type Viewport,
} from "@/components/preview-toolbar";
import { cn } from "@/lib/utils";
import {
  type DataMessage,
  PREVIEW_SOURCE,
  isPreviewMessage,
} from "@/lib/preview-protocol";
import { useMagicuiStore } from "@/providers/magicui-store-provider";
import type { Data } from "@/templates/portfolios/magicui/data/schema";

const PREVIEW_URL = "/preview/magicui";

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

  return (
    <div className="flex flex-1 flex-col">
      <PreviewToolbar
        viewport={viewport}
        onViewportChange={setViewport}
        previewUrl={PREVIEW_URL}
      />
      <div className="flex flex-1 justify-center overflow-auto bg-muted/30 p-4">
        <iframe
          ref={iframeRef}
          src={PREVIEW_URL}
          title="Magicui preview"
          className={cn(
            "h-full rounded-md border bg-background shadow-sm transition-[width] duration-200 ease-out",
            VIEWPORT_WIDTHS[viewport],
          )}
        />
      </div>
    </div>
  );
}
