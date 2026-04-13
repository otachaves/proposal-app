// ─────────────────────────────────────────────────────────────────────────────
// FIRM CONFIGURATION
// Edit this file to update team members, portfolio projects, and firm details.
// Place images in /public/team/ and /public/portfolio/.
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string;
  title: string;
  credentials: string; // e.g. "M.Arch, AIBC"
  bio: string;
  photo: string; // path relative to /public, e.g. "/team/otavio.jpg"
}

export interface PortfolioProject {
  name: string;
  location: string;
  year: string;
  type: string; // e.g. "Residential New Construction"
  photo: string; // path relative to /public, e.g. "/portfolio/project1.jpg"
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Otávio Pires Chaves",
    title: "Principal Architect",
    credentials: "M.Arch, AIBC",
    bio: "Over 15 years of experience in high-end residential design across Vancouver and the Lower Mainland. Passionate about spaces that connect people to their environment.",
    photo: "/team/otavio.jpg",
  },
  {
    name: "Partner Name",
    title: "Associate Architect",
    credentials: "B.Arch, AIBC",
    bio: "Specialist in sustainable design and building performance. Leads technical coordination and construction documentation across all projects.",
    photo: "/team/partner2.jpg",
  },
  {
    name: "Partner Name",
    title: "Design Lead",
    credentials: "M.Arch",
    bio: "Brings a strong conceptual vision to each project with expertise in 3D visualization, interior architecture, and material selection.",
    photo: "/team/partner3.jpg",
  },
  {
    name: "Partner Name",
    title: "Project Manager",
    credentials: "B.Arch, PMP",
    bio: "Oversees project delivery, client communications, and contractor coordination to ensure every project is completed on time and within budget.",
    photo: "/team/partner4.jpg",
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    name: "Project Name",
    location: "West Vancouver, BC",
    year: "2024",
    type: "Custom Residential",
    photo: "/portfolio/project1.jpg",
  },
  {
    name: "Project Name",
    location: "North Vancouver, BC",
    year: "2023",
    type: "Residential Addition",
    photo: "/portfolio/project2.jpg",
  },
  {
    name: "Project Name",
    location: "Whistler, BC",
    year: "2023",
    type: "Custom Residential",
    photo: "/portfolio/project3.jpg",
  },
  {
    name: "Project Name",
    location: "Vancouver, BC",
    year: "2022",
    type: "Interior Renovation",
    photo: "/portfolio/project4.jpg",
  },
];
