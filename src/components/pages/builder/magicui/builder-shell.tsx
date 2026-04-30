"use client";

import { type ReactNode, useState } from "react";

import { Sidebar } from "@/components/sidebar";

import { SECTIONS, type SectionId } from "./sections";
import { SectionsList } from "./sections-list";

export function MagicuiBuilderShell({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SectionId>("hero");

  const section = SECTIONS.find((s) => s.id === selected) ?? SECTIONS[0];
  const Editor = section.Editor;

  return (
    <div className="flex h-screen">
      <Sidebar title="Sections" expandedWidth="w-52">
        <SectionsList selected={selected} onSelect={setSelected} />
      </Sidebar>
      {children}
      <Sidebar title={section.label} side="right">
        <Editor />
      </Sidebar>
    </div>
  );
}
