import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { DATA as MAGICUI_DEFAULT_DATA } from "@/templates/portfolios/magicui/data/data";
import type { Data } from "@/templates/portfolios/magicui/data/schema";

export type MagicuiState = {
  data: Data;
};

export type MagicuiActions = {
  setData: (data: Data) => void;
  patch: <K extends keyof Data>(key: K, value: Data[K]) => void;
};

export type MagicuiStore = MagicuiState & MagicuiActions;

export const defaultInitState: MagicuiState = {
  data: MAGICUI_DEFAULT_DATA,
};

export const MAGICUI_STORE_KEY = "few-clicks:magicui";

export const createMagicuiStore = (
  initState: MagicuiState = defaultInitState,
) => {
  return createStore<MagicuiStore>()(
    persist(
      (set) => ({
        ...initState,
        setData: (data) => set({ data }),
        patch: (key, value) =>
          set((state) => ({ data: { ...state.data, [key]: value } })),
      }),
      {
        name: MAGICUI_STORE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ data: state.data }),
        skipHydration: true,
      },
    ),
  );
};
