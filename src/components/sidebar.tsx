"use client";

import { type ReactNode, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  children: ReactNode;
  title?: ReactNode;
  defaultCollapsed?: boolean;
  side?: "left" | "right";
  expandedWidth?: string;
  className?: string;
}

export function Sidebar({
  children,
  title,
  defaultCollapsed = false,
  side = "left",
  expandedWidth = "w-72",
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const ExpandIcon = side === "left" ? ChevronRight : ChevronLeft;
  const CollapseIcon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <aside
      data-collapsed={collapsed}
      data-side={side}
      className={cn(
        "flex h-full shrink-0 flex-col bg-card transition-[width] duration-200 ease-out",
        side === "left" ? "border-r" : "border-l",
        collapsed ? "w-12" : expandedWidth,
        className,
      )}
    >
      <header
        className={cn(
          "flex h-12 shrink-0 items-center gap-2 border-b px-2",
          side === "right" && "flex-row-reverse",
        )}
      >
        {!collapsed && title && (
          <div className="min-w-0 flex-1 truncate px-2 text-sm font-semibold">
            {title}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(collapsed && "mx-auto")}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ExpandIcon /> : <CollapseIcon />}
        </Button>
      </header>
      <div className={cn("flex-1 overflow-y-auto p-3", collapsed && "hidden")}>
        {children}
      </div>
    </aside>
  );
}
