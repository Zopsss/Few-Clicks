"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMagicuiStore } from "@/providers/magicui-store-provider";

import { Field } from "./field";

export function HeroEditor() {
  const data = useMagicuiStore((s) => s.data);
  const patch = useMagicuiStore((s) => s.patch);

  return (
    <div className="flex flex-col gap-4">
      <Field label="Name">
        <Input
          value={data.name}
          onChange={(e) => patch("name", e.target.value)}
        />
      </Field>
      <Field label="Initials">
        <Input
          value={data.initials}
          onChange={(e) => patch("initials", e.target.value)}
        />
      </Field>
      <Field label="Avatar URL" optional>
        <Input
          value={data.avatarUrl}
          onChange={(e) => patch("avatarUrl", e.target.value)}
        />
      </Field>
      <Field label="Description">
        <Textarea
          value={data.description}
          onChange={(e) => patch("description", e.target.value)}
          rows={3}
        />
      </Field>
      <Field label="Location">
        <Input
          value={data.location}
          onChange={(e) => patch("location", e.target.value)}
        />
      </Field>
      <Field label="Location link">
        <Input
          value={data.locationLink}
          onChange={(e) => patch("locationLink", e.target.value)}
        />
      </Field>
      <Field label="Site URL">
        <Input
          value={data.url}
          onChange={(e) => patch("url", e.target.value)}
        />
      </Field>
    </div>
  );
}
