"use client";

import { useState, useEffect } from "react";
import { AppContext, defaultProjectInfo, defaultScopeData } from "./store";
import { ProjectInfo, ScopeData, FeeData, TeamMember, PortfolioProject } from "./types";
import { DEFAULT_FIRM_DESCRIPTION, TEAM_MEMBERS, PORTFOLIO_PROJECTS } from "./proposal/firmConfig";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(defaultProjectInfo);
  const [scopeData, setScopeData] = useState<ScopeData>(defaultScopeData);
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [firmName, setFirmName] = useState("");
  const [firmWebsite, setFirmWebsite] = useState("");
  const [firmSetupDone, setFirmSetupDone] = useState(false);
  const [firmDescription, setFirmDescription] = useState(DEFAULT_FIRM_DESCRIPTION);
  const [firmDataLoading, setFirmDataLoading] = useState(false);
  const [firmDataLoaded, setFirmDataLoaded] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS.map(m => ({ ...m })));
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS.map(p => ({ ...p })));

  // Background AI fetch from firm website
  useEffect(() => {
    if (!firmWebsite.trim()) return;

    let cancelled = false;
    setFirmDataLoading(true);
    setFirmDataLoaded(false);

    (async () => {
      try {
        const res = await fetch("/api/firm-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: firmWebsite }),
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (cancelled) return;

        if (data.firmDescription?.trim()) {
          setFirmDescription(data.firmDescription.trim());
        }
        if (Array.isArray(data.teamMembers) && data.teamMembers.length > 0) {
          setTeamMembers(data.teamMembers.map((m: TeamMember) => ({ ...m })));
        }
        setFirmDataLoaded(true);
      } catch {
        // Silent fail — defaults remain
      } finally {
        if (!cancelled) setFirmDataLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [firmWebsite]);

  const login = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setCurrentStep(1);
    setFirmName("");
    setFirmWebsite("");
    setFirmSetupDone(false);
    setFirmDescription(DEFAULT_FIRM_DESCRIPTION);
    setFirmDataLoading(false);
    setFirmDataLoaded(false);
    setTeamMembers(TEAM_MEMBERS.map(m => ({ ...m })));
    setPortfolioProjects(PORTFOLIO_PROJECTS.map(p => ({ ...p })));
  };

  return (
    <AppContext.Provider
      value={{
        currentStep,
        projectInfo,
        scopeData,
        feeData,
        isLoggedIn,
        userEmail,
        showAuthModal,
        firmName,
        firmWebsite,
        firmSetupDone,
        firmDescription,
        firmDataLoading,
        firmDataLoaded,
        teamMembers,
        portfolioProjects,
        setCurrentStep,
        setProjectInfo,
        setScopeData,
        setFeeData,
        setShowAuthModal,
        login,
        logout,
        setFirmName,
        setFirmWebsite,
        setFirmSetupDone,
        setFirmDescription,
        setTeamMembers,
        setPortfolioProjects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
