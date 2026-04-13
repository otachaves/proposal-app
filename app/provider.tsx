"use client";

import { useState } from "react";
import { AppContext, defaultProjectInfo, defaultScopeData } from "./store";
import { ProjectInfo, ScopeData, FeeData } from "./types";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(defaultProjectInfo);
  const [scopeData, setScopeData] = useState<ScopeData>(defaultScopeData);
  const [feeData, setFeeData] = useState<FeeData | null>(null);

  return (
    <AppContext.Provider
      value={{
        currentStep,
        projectInfo,
        scopeData,
        feeData,
        setCurrentStep,
        setProjectInfo,
        setScopeData,
        setFeeData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
