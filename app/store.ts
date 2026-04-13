"use client";

import { createContext, useContext } from "react";
import {
  ProjectInfo,
  ScopeData,
  FeeData,
  BASIC_SERVICES_DEFAULT,
  ADDITIONAL_SERVICES,
  DEFAULT_PROFESSIONALS,
} from "./types";

export interface AppState {
  currentStep: number;
  projectInfo: ProjectInfo;
  scopeData: ScopeData;
  feeData: FeeData | null;
  setCurrentStep: (step: number) => void;
  setProjectInfo: (info: ProjectInfo) => void;
  setScopeData: (data: ScopeData) => void;
  setFeeData: (data: FeeData) => void;
}

export const defaultProjectInfo: ProjectInfo = {
  clientName: "",
  projectAddress: "",
  city: "",
  province: "BC",
  constructionCost: 0,
  area: 0,
  floors: 1,
  description: "",
};

export const defaultScopeData: ScopeData = {
  basicServices: BASIC_SERVICES_DEFAULT.map((s) => ({ ...s })),
  siteVisits: 10,
  additionalServices: ADDITIONAL_SERVICES.map((s) => ({ ...s })),
  travelMileage: 0,
  printingPlotting: 0,
  customExpenses: [],
  professionals: DEFAULT_PROFESSIONALS.map((p) => ({ ...p })),
};

export const AppContext = createContext<AppState>({
  currentStep: 1,
  projectInfo: defaultProjectInfo,
  scopeData: defaultScopeData,
  feeData: null,
  setCurrentStep: () => {},
  setProjectInfo: () => {},
  setScopeData: () => {},
  setFeeData: () => {},
});

export const useApp = () => useContext(AppContext);
