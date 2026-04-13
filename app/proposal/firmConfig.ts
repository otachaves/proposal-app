// ─────────────────────────────────────────────────────────────────────────────
// FIRM CONFIGURATION
// Edit this file to update team members, portfolio projects, and firm details.
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string;
  title: string;
  credentials: string;
  bio: string;
  photo: string;
}

export interface PortfolioProject {
  name: string;
  location: string;
  year: string;
  type: string;
  photo: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Otávio Chaves",
    title: "Principal Architect",
    credentials: "M.Arch, AIBC",
    bio: "Over 15 years of experience in high-end residential design across Vancouver and the Lower Mainland. Passionate about spaces that connect people to their environment.",
    photo: "https://s12arquitetura.com.br/static/4a7e18dfebd001593093605a0985a908/d0ea7/otavio-chaves.jpg",
  },
  {
    name: "Carolina Bailune",
    title: "Associate Architect",
    credentials: "M.Arch, AIBC",
    bio: "Specialist in sustainable design and building performance. Leads technical coordination and construction documentation across all projects.",
    photo: "https://s12arquitetura.com.br/static/f197974754bf7e5c724d8c7efd13154a/d0ea7/carolina-bailune.jpg",
  },
  {
    name: "Lívia Bragança",
    title: "Design Lead",
    credentials: "M.Arch",
    bio: "Brings a strong conceptual vision to each project with expertise in 3D visualization, interior architecture, and material selection.",
    photo: "https://s12arquitetura.com.br/static/97f8d81eb1dd48e7565e4abc92e172b9/d0ea7/livia-braganca.jpg",
  },
  {
    name: "Marcos Balli",
    title: "Project Manager",
    credentials: "B.Arch, PMP",
    bio: "Oversees project delivery, client communications, and contractor coordination to ensure every project is completed on time and within budget.",
    photo: "https://s12arquitetura.com.br/static/1d8bd929bcc559d96afda977537ccad0/d0ea7/marcos-balli.jpg",
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
