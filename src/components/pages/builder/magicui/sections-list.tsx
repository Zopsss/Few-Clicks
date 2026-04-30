"use client";

import { cn } from "@/lib/utils";

import { SECTIONS, type SectionId } from "./sections";

export interface SectionsListProps {
  selected: SectionId;
  onSelect: (id: SectionId) => void;
}

export function SectionsList({ selected, onSelect }: SectionsListProps) {
  return (
    <nav className="flex flex-col gap-1">
      {SECTIONS.map((section) => {
        const isActive = section.id === selected;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
              isActive
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
