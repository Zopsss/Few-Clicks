"use client";

import { type ReactNode } from "react";

export function Field({
  label,
  optional = false,
  children,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
        {optional && (
          <span className="ml-1 font-normal opacity-60">(Optional)</span>
        )}
      </span>
      {children}
    </label>
  );
}
