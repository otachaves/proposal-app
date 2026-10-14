"use client";

import { createContext, useContext } from "react";
import {
  ProjectInfo,
  ScopeData,
  FeeData,
  TeamMember,
  PortfolioProject,
  BASIC_SERVICES_DEFAULT,
  ADDITIONAL_SERVICES,
  DEFAULT_PROFESSIONALS,
} from "./types";
import { DEFAULT_FIRM_DESCRIPTION, TEAM_MEMBERS, PORTFOLIO_PROJECTS } from "./proposal/firmConfig";

export interface AppState {
  currentStep: number;
  projectInfo: ProjectInfo;
  scopeData: ScopeData;
  feeData: FeeData | null;
  isLoggedIn: boolean;
  userEmail: string;
  showAuthModal: boolean;
  firmName: string;
  firmWebsite: string;
  firmSetupDone: boolean;
  firmDescription: string;
  firmDataLoading: boolean;
  firmDataLoaded: boolean;
  teamMembers: TeamMember[];
  portfolioProjects: PortfolioProject[];
  setCurrentStep: (step: number) => void;
  setProjectInfo: (info: ProjectInfo) => void;
  setScopeData: (data: ScopeData) => void;
  setFeeData: (data: FeeData) => void;
  setShowAuthModal: (show: boolean) => void;
  login: (email: string) => void;
  logout: () => void;
  setFirmName: (name: string) => void;
  setFirmWebsite: (url: string) => void;
  setFirmSetupDone: (done: boolean) => void;
  setFirmDescription: (desc: string) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setPortfolioProjects: (projects: PortfolioProject[]) => void;
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
  isLoggedIn: false,
  userEmail: "",
  showAuthModal: false,
  firmName: "",
  firmWebsite: "",
  firmSetupDone: false,
  firmDescription: DEFAULT_FIRM_DESCRIPTION,
  firmDataLoading: false,
  firmDataLoaded: false,
  teamMembers: TEAM_MEMBERS,
  portfolioProjects: PORTFOLIO_PROJECTS,
  setCurrentStep: () => {},
  setProjectInfo: () => {},
  setScopeData: () => {},
  setFeeData: () => {},
  setShowAuthModal: () => {},
  login: () => {},
  logout: () => {},
  setFirmName: () => {},
  setFirmWebsite: () => {},
  setFirmSetupDone: () => {},
  setFirmDescription: () => {},
  setTeamMembers: () => {},
  setPortfolioProjects: () => {},
});

export const useApp = () => useContext(AppContext);
