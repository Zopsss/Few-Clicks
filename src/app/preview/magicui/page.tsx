"use client";

import { useEffect, useState } from "react";
import {
  PREVIEW_SOURCE,
  isPreviewMessage,
  type ReadyMessage,
} from "@/lib/preview-protocol";
import MagicuiPage from "@/templates/portfolios/magicui/app/page";
import Navbar from "@/templates/portfolios/magicui/components/navbar";
import type { Data } from "@/templates/portfolios/magicui/data/schema";
import { TemplateDataProvider } from "@/templates/portfolios/magicui/data/use-data";

export default function PreviewMagicuiPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!isPreviewMessage(event.data)) return;
      if (event.data.type === "data") {
        setData(event.data.payload as Data);
      }
    };
    window.addEventListener("message", handler);

    const ready: ReadyMessage = { source: PREVIEW_SOURCE, type: "ready" };
    window.parent.postMessage(ready, window.location.origin);

    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <TemplateDataProvider value={data}>
      <div className="relative max-w-2xl mx-auto py-12 pb-24 sm:py-24 px-6">
        <MagicuiPage />
      </div>
      <Navbar />
    </TemplateDataProvider>
  );
}
