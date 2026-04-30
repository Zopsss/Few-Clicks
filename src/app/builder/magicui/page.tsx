"use client";

import { useEffect, useRef } from "react";
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
    <iframe
      ref={iframeRef}
      src={PREVIEW_URL}
      title="Magicui preview"
      className="flex-1 border-0"
    />
  );
}
