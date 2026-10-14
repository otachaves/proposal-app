export interface ProjectInfo {
  clientName: string;
  projectAddress: string;
  city: string;
  province: string;
  constructionCost: number;
  area: number;
  floors: number;
  description: string;
}

export interface BasicService {
  id: string;
  phase: string;
  description: string;
  deliverables: string[];
  hasSiteVisits?: boolean;
  selected: boolean;
  phaseWeight: number; // % of total architect fee
  weeks: number | null; // design duration in weeks; null = open-ended (CA)
}

export interface AdditionalService {
  id: string;
  label: string;
  percentage: number;
  selected: boolean;
  isCustom?: boolean;
}

export interface CustomExpense {
  id: string;
  label: string;
  amount: number;
}

export interface Professional {
  id: string;
  role: string;
  internalRate: number; // CAD $/h (never shown to client)
  hours: number;
  selected: boolean;
}

export interface ScopeData {
  basicServices: BasicService[];
  siteVisits: number;
  additionalServices: AdditionalService[];
  travelMileage: number;
  printingPlotting: number;
  customExpenses: CustomExpense[];
  professionals: Professional[];
}

export interface PhaseBreakdown {
  phase: string;
  percentage: number;
  amount: number;
}

export interface ProfessionalCost {
  id: string;
  role: string;
  hours: number;
  rate: number;
  laborCost: number;      // hours × rate
  withOverhead: number;   // laborCost × (1 + OVERHEAD)
}

export interface FeeData {
  basePercentage: number;        // editable, default 10
  totalPercentage: number;
  baseFee: number;
  additionalServicesFee: number;
  directCosts: number;
  totalFee: number;
  phaseBreakdown: PhaseBreakdown[];
  professionalCosts: ProfessionalCost[];
  totalLaborCost: number;        // sum of labor with overhead
  totalOverhead: number;
  expectedProfit: number;
  profitMarginPct: number;
  aiInsight: string | null;
}

export const BASIC_SERVICES_DEFAULT: BasicService[] = [
  {
    id: "pre-design",
    phase: "Pre-Design & Data Collection",
    description: "Site analysis, program definition, regulatory review, and client goal alignment.",
    deliverables: ["Site survey review", "Zoning analysis", "Project program"],
    selected: true,
    phaseWeight: 5,
    weeks: 2,
  },
  {
    id: "schematic",
    phase: "Schematic Design",
    description: "Preliminary design concepts, floor plan options, and design direction.",
    deliverables: ["Floor plan concepts", "Site plan", "Massing study"],
    selected: true,
    phaseWeight: 15,
    weeks: 3,
  },
  {
    id: "design-dev",
    phase: "Design Development",
    description: "Refined design with 3D exterior and interior visualization.",
    deliverables: ["3D exterior model", "3D interior views", "Finalized floor plans", "Exterior elevations"],
    selected: true,
    phaseWeight: 40,
    weeks: 3,
  },
  {
    id: "cd-permit",
    phase: "Construction Documents — Permit Set",
    description: "Drawings prepared for municipal building permit submission.",
    deliverables: ["Site plan", "Floor plans", "Elevations", "Building sections", "Cover sheet"],
    selected: true,
    phaseWeight: 20,
    weeks: 5,
  },
  {
    id: "cd-full",
    phase: "Construction Documents — Full Set",
    description: "Complete construction drawings for contractor bidding and field use.",
    deliverables: ["Detailed floor plans", "All elevations", "Wall sections", "Details", "Specifications"],
    selected: true,
    phaseWeight: 40,
    weeks: 5,
  },
  {
    id: "ca",
    phase: "Site Supervision",
    description: "Architect presence on site during construction to ensure design intent is properly executed.",
    deliverables: ["Site visit reports", "RFI responses", "Submittal reviews", "Substantial completion"],
    hasSiteVisits: true,
    selected: true,
    phaseWeight: 20,
    weeks: null, // open-ended — runs during construction
  },
];

export const ADDITIONAL_SERVICES: AdditionalService[] = [
  { id: "lighting", label: "Lighting Design Plan", percentage: 1.5, selected: false },
  { id: "electrical", label: "Electrical Points Plan", percentage: 1.0, selected: false },
  { id: "plumbing", label: "Plumbing Points Plan", percentage: 1.0, selected: false },
  { id: "rcp", label: "Reflected Ceiling Plan", percentage: 1.0, selected: false },
  { id: "floor-pattern", label: "Floor Pattern / Tile Layout", percentage: 1.0, selected: false },
  { id: "millwork", label: "Millwork & Cabinetry Details", percentage: 2.0, selected: false },
  { id: "stone", label: "Stone, Marble & Granite Details", percentage: 1.5, selected: false },
  { id: "window-door", label: "Window & Door Details", percentage: 1.0, selected: false },
  { id: "materials", label: "Material Specifications", percentage: 1.5, selected: false },
  { id: "roof", label: "Roof Details", percentage: 1.0, selected: false },
  { id: "interior-design", label: "Interior Design Services", percentage: 3.0, selected: false },
  { id: "renderings", label: "3D Renderings", percentage: 2.0, selected: false },
];

export const DEFAULT_PROFESSIONALS: Professional[] = [
  { id: "principal", role: "Principal Architect", internalRate: 86, hours: 120, selected: true },
  { id: "project-arch", role: "Project Architect", internalRate: 51, hours: 320, selected: true },
  { id: "intern-arch", role: "Intern Architect", internalRate: 30, hours: 260, selected: true },
  { id: "technologist", role: "Technologist", internalRate: 25, hours: 200, selected: true },
  { id: "admin", role: "Admin", internalRate: 19, hours: 80, selected: false },
];

export const OVERHEAD_RATE = 0.45; // 45% overhead on labor

// ─── Firm / team types (shared between store, firmConfig, and proposal doc) ───

export interface TeamMember {
  name: string;
  title: string;
  credentials: string;
  bio: string;
  photo: string; // URL or base64 data URI
}

export interface PortfolioProject {
  name: string;
  location: string;
  year: string;
  type: string;
  photo: string; // URL or base64 data URI
}

export interface ProposalData {
  projectInfo: ProjectInfo;
  scopeData: ScopeData;
  feeData: FeeData | null;
  firmName?: string;
  firmDescription?: string;
  teamMembers?: TeamMember[];
  portfolioProjects?: PortfolioProject[];
  includeTeam?: boolean;
  includeFirmDescription?: boolean;
  includePortfolio?: boolean;
}
