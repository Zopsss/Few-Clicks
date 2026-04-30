"use client";

import { useEffect } from "react";
import {
  PREVIEW_SOURCE,
  isPreviewMessage,
  type ReadyMessage,
} from "@/lib/preview-protocol";
import { useMagicuiStore } from "@/providers/magicui-store-provider";
import MagicuiPage from "@/templates/portfolios/magicui/app/page";
import Navbar from "@/templates/portfolios/magicui/components/navbar";
import { TemplateDataProvider } from "@/templates/portfolios/magicui/data/use-data";
import { DataSchema } from "@/templates/portfolios/magicui/data/schema";

export default function PreviewMagicuiPage() {
  const data = useMagicuiStore((s) => s.data);
  const setData = useMagicuiStore((s) => s.setData);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isPreviewMessage(event.data)) return;

      if (event.data.type === "data") {
        const parsed = DataSchema.safeParse(event.data.payload);
        if (!parsed.success) return;
        setData(parsed.data);
      }
    };
    window.addEventListener("message", handler);

    const ready: ReadyMessage = { source: PREVIEW_SOURCE, type: "ready" };
    window.parent.postMessage(ready, window.location.origin);

    return () => window.removeEventListener("message", handler);
  }, [setData]);

  return (
    <TemplateDataProvider value={data}>
      <div className="relative max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
        <MagicuiPage />
      </div>
      <Navbar />
    </TemplateDataProvider>
  );
}
