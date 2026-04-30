import { type ReactNode } from "react";

import { MagicuiBuilderShell } from "@/components/pages/builder/magicui/builder-shell";
import { MagicuiStoreProvider } from "@/providers/magicui-store-provider";

export default function BuilderMagicuiLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MagicuiStoreProvider>
      <MagicuiBuilderShell>{children}</MagicuiBuilderShell>
    </MagicuiStoreProvider>
  );
}
