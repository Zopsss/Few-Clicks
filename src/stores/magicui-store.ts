import { createStore } from "zustand/vanilla";
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

export const createMagicuiStore = (
  initState: MagicuiState = defaultInitState,
) => {
  return createStore<MagicuiStore>()((set) => ({
    ...initState,
    setData: (data) => set({ data }),
    patch: (key, value) =>
      set((state) => ({ data: { ...state.data, [key]: value } })),
  }));
};
