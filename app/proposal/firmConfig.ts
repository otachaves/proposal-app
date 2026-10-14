// ─────────────────────────────────────────────────────────────────────────────
// FIRM CONFIGURATION — default values. Editable at runtime via Step 4.
// ─────────────────────────────────────────────────────────────────────────────

import type { TeamMember, PortfolioProject } from "../types";
export type { TeamMember, PortfolioProject };

export const DEFAULT_FIRM_DESCRIPTION =
  "We are a boutique architectural practice dedicated to delivering thoughtful, high-quality residential design. Every project is led by a principal architect from concept to completion, ensuring a seamless experience and a result that truly reflects each client's vision.";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Brian Mitchell",
    title: "Principal Architect",
    credentials: "M.Arch, AIA",
    bio: "Over 15 years of experience in high-end residential design across the Pacific Northwest. Passionate about creating spaces that connect people to their environment.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Sarah Chen",
    title: "Associate Architect",
    credentials: "M.Arch, LEED AP",
    bio: "Specialist in sustainable design and building performance. Leads technical coordination and construction documentation across all projects.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "John Harrington",
    title: "Design Lead",
    credentials: "M.Arch",
    bio: "Brings a strong conceptual vision to each project with expertise in 3D visualization, interior architecture, and material selection.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
  },
  {
    name: "Emily Ward",
    title: "Project Manager",
    credentials: "B.Arch, PMP",
    bio: "Oversees project delivery, client communications, and contractor coordination to ensure every project is completed on time and within budget.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face",
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    name: "West Vancouver Home",
    location: "West Vancouver, BC",
    year: "2024",
    type: "Custom Residential",
    photo: "https://www.theglobeandmail.com/resizer/v2/5AW7VUX34ZA3VGWLFND2RHIKWQ.JPG?auth=d3f8aedf712a0c5dd185898711a26acc2f121a168318c2447fd620d34da83120&width=1500&quality=80",
  },
  {
    name: "North Vancouver Home",
    location: "North Vancouver, BC",
    year: "2023",
    type: "Custom Residential",
    photo: "https://cdn.avenuehq.com/wp-content/uploads/sites/3077/2024/08/4476skylinedr-92.jpg",
  },
  {
    name: "Whistler Home",
    location: "Whistler, BC",
    year: "2023",
    type: "Mountain Retreat",
    photo: "https://remax-whistler.com/wpradmin/modules/wprrets/photos/W056844/mls-W056844-1.jpg",
  },
  {
    name: "Vancouver Home",
    location: "Vancouver, BC",
    year: "2025",
    type: "Interior Design",
    photo: "https://houseandhome.com/wp-content/uploads/2025/03/Feature-27.jpg",
  },
];
