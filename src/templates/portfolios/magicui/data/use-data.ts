"use client";

import { createContext, useContext } from "react";
import { DATA } from "./data";
import type { Data } from "./schema";

const TemplateDataContext = createContext<Data | null>(null);

export const TemplateDataProvider = TemplateDataContext.Provider;

export const useData = (): Data => useContext(TemplateDataContext) ?? DATA;
