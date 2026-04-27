"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";

import { type MagicuiStore, createMagicuiStore } from "@/stores/magicui-store";

export type MagicuiStoreApi = ReturnType<typeof createMagicuiStore>;

export const MagicuiStoreContext = createContext<MagicuiStoreApi | undefined>(
  undefined,
);

export interface MagicuiStoreProviderProps {
  children: ReactNode;
}

export const MagicuiStoreProvider = ({
  children,
}: MagicuiStoreProviderProps) => {
  const [store] = useState(() => createMagicuiStore());
  return (
    <MagicuiStoreContext.Provider value={store}>
      {children}
    </MagicuiStoreContext.Provider>
  );
};

export const useMagicuiStore = <T,>(
  selector: (store: MagicuiStore) => T,
): T => {
  const magicuiStoreContext = useContext(MagicuiStoreContext);
  if (!magicuiStoreContext) {
    throw new Error(`useMagicuiStore must be used within MagicuiStoreProvider`);
  }

  return useStore(magicuiStoreContext, selector);
};
