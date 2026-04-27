"use client";

import { useEffect, useRef } from "react";
import {
  PREVIEW_SOURCE,
  isPreviewMessage,
  type DataMessage,
} from "@/lib/preview-protocol";
import {
  MagicuiStoreProvider,
  useMagicuiStore,
} from "@/providers/magicui-store-provider";
import type { Data } from "@/templates/portfolios/magicui/data/schema";

const PREVIEW_URL = "/preview/magicui";

export default function BuilderMagicuiPage() {
  return (
    <MagicuiStoreProvider>
      <Builder />
    </MagicuiStoreProvider>
  );
}

function Builder() {
  const data = useMagicuiStore((s) => s.data);
  const patch = useMagicuiStore((s) => s.patch);
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
      if (!isPreviewMessage(event.data)) return;
      if (event.data.type === "ready") {
        sendData(iframeRef.current?.contentWindow ?? null, data);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [data]);

  return (
    <div className="flex h-screen">
      <aside className="w-72 shrink-0 border-r p-4 overflow-y-auto bg-card">
        <h2 className="text-sm font-semibold mb-3">Editor (sanity check)</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Real sidebar comes later. For now, the button mutates the store and
          posts an update to the iframe preview.
        </p>
        <button
          type="button"
          onClick={() =>
            patch("name", `Edited at ${new Date().toLocaleTimeString()}`)
          }
          className="w-full rounded bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90"
        >
          Mutate name
        </button>
        <div className="mt-2 text-xs">
          Current name: <strong>{data.name}</strong>
        </div>
      </aside>
      <iframe
        ref={iframeRef}
        src={PREVIEW_URL}
        title="Magicui preview"
        className="flex-1 border-0"
      />
    </div>
  );
}
