"use client";

import { Textarea } from "@/components/ui/textarea";
import { useMagicuiStore } from "@/providers/magicui-store-provider";

import { Field } from "./field";

export function AboutEditor() {
  const summary = useMagicuiStore((s) => s.data.summary);
  const patch = useMagicuiStore((s) => s.patch);

  return (
    <div className="flex flex-col gap-4">
      <Field label="Summary (markdown)">
        <Textarea
          value={summary}
          onChange={(e) => patch("summary", e.target.value)}
          rows={12}
        />
      </Field>
    </div>
  );
}
