"use client";

import { useState, useRef } from "react";
import { useApp } from "../store";
import { TeamMember, PortfolioProject } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

// ─── Photo upload helper ──────────────────────────────────────────────────────
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// ─── Team member card ─────────────────────────────────────────────────────────
function TeamCard({
  member,
  onChange,
  onRemove,
}: {
  member: TeamMember;
  onChange: (updated: TeamMember) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    onChange({ ...member, photo: dataUrl });
  };

  return (
    <div className="border border-[#E8E8E8] rounded-xl overflow-hidden bg-white">
      {/* Collapsed preview row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0A1628] flex-shrink-0 relative">
          {member.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-lg font-bold">
              {member.name.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0A1628] text-sm truncate">{member.name || "New Member"}</p>
          <p className="text-xs text-gray-400 truncate">{member.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
          >
            Remove
          </button>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="border-t border-[#E8E8E8] p-4 space-y-4 bg-gray-50/40">
          {/* Photo */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#0A1628] flex-shrink-0 relative border border-[#E8E8E8]">
              {member.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C9A84C] text-2xl font-bold">
                  {member.name.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</p>
              <input
                type="text"
                value={member.photo.startsWith("data:") ? "" : member.photo}
                onChange={e => onChange({ ...member, photo: e.target.value })}
                placeholder="Paste image URL..."
                className="w-full px-3 py-2 text-xs border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs px-3 py-1.5 bg-[#0A1628] text-[#C9A84C] rounded-lg hover:ring-1 hover:ring-[#C9A84C] transition-all cursor-pointer"
                >
                  Upload Photo
                </button>
                {member.photo && (
                  <button
                    onClick={() => onChange({ ...member, photo: "" })}
                    className="text-xs px-3 py-1.5 border border-[#E8E8E8] text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label>
              <input
                type="text"
                value={member.name}
                onChange={e => onChange({ ...member, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Credentials</label>
              <input
                type="text"
                value={member.credentials}
                onChange={e => onChange({ ...member, credentials: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Title / Role</label>
            <input
              type="text"
              value={member.title}
              onChange={e => onChange({ ...member, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Bio</label>
            <textarea
              value={member.bio}
              onChange={e => onChange({ ...member, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc] resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Portfolio project card ───────────────────────────────────────────────────
function PortfolioCard({
  project,
  onChange,
  onRemove,
}: {
  project: PortfolioProject;
  onChange: (updated: PortfolioProject) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    onChange({ ...project, photo: dataUrl });
  };

  return (
    <div className="border border-[#E8E8E8] rounded-xl overflow-hidden bg-white">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0A1628] flex-shrink-0 relative">
          {project.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.photo} alt={project.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0A1628] text-sm truncate">{project.name || "New Project"}</p>
          <p className="text-xs text-gray-400">{[project.location, project.year].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
          >
            Remove
          </button>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#E8E8E8] p-4 space-y-4 bg-gray-50/40">
          {/* Photo */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#0A1628] flex-shrink-0 relative border border-[#E8E8E8]">
              {project.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.photo} alt={project.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</p>
              <input
                type="text"
                value={project.photo.startsWith("data:") ? "" : project.photo}
                onChange={e => onChange({ ...project, photo: e.target.value })}
                placeholder="Paste image URL..."
                className="w-full px-3 py-2 text-xs border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-xs px-3 py-1.5 bg-[#0A1628] text-[#C9A84C] rounded-lg hover:ring-1 hover:ring-[#C9A84C] transition-all cursor-pointer"
                >
                  Upload Photo
                </button>
                {project.photo && (
                  <button
                    onClick={() => onChange({ ...project, photo: "" })}
                    className="text-xs px-3 py-1.5 border border-[#E8E8E8] text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={e => onChange({ ...project, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
              <input
                type="text"
                value={project.location}
                onChange={e => onChange({ ...project, location: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Year</label>
              <input
                type="text"
                value={project.year}
                onChange={e => onChange({ ...project, year: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
              <input
                type="text"
                value={project.type}
                onChange={e => onChange({ ...project, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section toggle wrapper ───────────────────────────────────────────────────
function SectionToggle({
  icon, title, description, enabled, onToggle, children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E8E8] overflow-hidden">
      <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-[#E8E8E8]">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-[#0A1628]/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-[#0A1628] text-sm">{title}</h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
          </div>
        </div>
        {/* Toggle switch */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            enabled ? "bg-[#0066cc]" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {enabled && <div className="px-6 py-5 space-y-3">{children}</div>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Step4Output() {
  const {
    projectInfo, scopeData, feeData, setCurrentStep,
    firmName, firmDescription, teamMembers, portfolioProjects,
    setFirmDescription, setTeamMembers, setPortfolioProjects,
    firmDataLoading, firmDataLoaded,
  } = useApp();

  const [showMessages, setShowMessages] = useState(false);
  const [copied, setCopied] = useState<"email" | "whatsapp" | null>(null);

  // Proposal customization toggles
  const [includeTeam, setIncludeTeam] = useState(true);
  const [includeFirmDesc, setIncludeFirmDesc] = useState(true);
  const [includePortfolio, setIncludePortfolio] = useState(true);

  const fullAddress = [projectInfo.projectAddress, projectInfo.city, projectInfo.province].filter(Boolean).join(", ");
  const emailSubject = `Proposal Ready - ${fullAddress}`;
  const emailBody = `Hi ${projectInfo.clientName},\n\nI've completed the fee proposal for your project at ${fullAddress}.\n\nI'd love to walk you through it in person — it takes about 30 minutes and I find it leads to a much better outcome for both of us.\n\nAre you available for a quick call this week to find a time?\n\nLooking forward to it.\n${firmName || "Your Firm"}`;
  const whatsappBody = `Hi ${projectInfo.clientName}, your proposal for ${fullAddress} is ready. I'd love to present it to you in person — usually takes 30 min and makes a big difference. Can we find a time this week?`;

  const copyToClipboard = async (text: string, type: "email" | "whatsapp") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const openProposal = () => {
    const proposalData = {
      projectInfo,
      scopeData,
      feeData,
      firmName,
      firmDescription: includeFirmDesc ? firmDescription : "",
      teamMembers: includeTeam ? teamMembers : [],
      portfolioProjects: includePortfolio ? portfolioProjects : [],
      includeTeam,
      includeFirmDescription: includeFirmDesc,
      includePortfolio,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("proposalData", JSON.stringify(proposalData));
    window.open("/proposal", "_blank");
  };

  // Team helpers
  const updateMember = (i: number, updated: TeamMember) => {
    const next = [...teamMembers];
    next[i] = updated;
    setTeamMembers(next);
  };
  const removeMember = (i: number) => setTeamMembers(teamMembers.filter((_, idx) => idx !== i));
  const addMember = () => setTeamMembers([...teamMembers, { name: "", title: "", credentials: "", bio: "", photo: "" }]);

  // Portfolio helpers
  const updateProject = (i: number, updated: PortfolioProject) => {
    const next = [...portfolioProjects];
    next[i] = updated;
    setPortfolioProjects(next);
  };
  const removeProject = (i: number) => setPortfolioProjects(portfolioProjects.filter((_, idx) => idx !== i));
  const addProject = () => setPortfolioProjects([...portfolioProjects, { name: "", location: "", year: "", type: "", photo: "" }]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="bg-[#0A1628] px-8 py-6">
          <h2 className="text-[#C9A84C] text-sm font-semibold tracking-wide uppercase mb-1">Step 4 of 4</h2>
          <h1 className="text-white text-2xl font-bold">Customize & Send</h1>
          <p className="text-blue-200 text-sm mt-1 opacity-70">
            Personalize your proposal before sending
          </p>
        </div>

        {/* Summary */}
        <div className="px-8 py-6">
          {/* AI firm data status */}
          {firmDataLoading && (
            <div className="mb-4 flex items-center gap-2 text-xs text-blue-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <svg className="w-3.5 h-3.5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Pulling your firm info from your website — will appear below when ready.
            </div>
          )}
          {firmDataLoaded && (
            <div className="mb-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Firm info pulled from your website — team and description pre-filled below.
            </div>
          )}
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Proposal Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400">Client</p>
              <p className="font-semibold text-[#1A1A2E]">{projectInfo.clientName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Project</p>
              <p className="font-semibold text-[#1A1A2E] text-sm">{projectInfo.projectAddress}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Fee</p>
              <p className="font-bold text-[#0A1628] text-xl">{feeData ? fmt(feeData.totalFee) : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Fee Rate</p>
              <p className="font-semibold text-[#C9A84C] text-lg">
                {feeData ? `${feeData.totalPercentage.toFixed(1)}%` : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: Team ── */}
      <SectionToggle
        icon={
          <svg className="w-5 h-5 text-[#0066cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
        title="Include your team in this proposal?"
        description="Show team members with photos and bios. Click any member to edit their details."
        enabled={includeTeam}
        onToggle={() => setIncludeTeam(!includeTeam)}
      >
        <div className="space-y-2">
          {teamMembers.map((member, i) => (
            <TeamCard
              key={i}
              member={member}
              onChange={(updated) => updateMember(i, updated)}
              onRemove={() => removeMember(i)}
            />
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={addMember}
            className="flex-1 py-2.5 border-2 border-dashed border-[#0066cc]/40 text-[#0066cc] text-xs font-semibold rounded-xl hover:border-[#0066cc] hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add Team Member
          </button>
          {teamMembers.length > 0 && (
            <button
              onClick={() => setTeamMembers([])}
              className="px-4 py-2.5 border border-red-200 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50 transition-all cursor-pointer"
            >
              Remove All
            </button>
          )}
        </div>
      </SectionToggle>

      {/* ── SECTION: Firm Description ── */}
      <SectionToggle
        icon={
          <svg className="w-5 h-5 text-[#0066cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        }
        title="Update the firm description?"
        description="This paragraph introduces your practice at the top of the team section."
        enabled={includeFirmDesc}
        onToggle={() => setIncludeFirmDesc(!includeFirmDesc)}
      >
        <textarea
          value={firmDescription}
          onChange={(e) => setFirmDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 text-sm border border-[#E8E8E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066cc] resize-none leading-relaxed text-[#1A1A2E]"
        />
        <p className="text-[10px] text-gray-400">
          {firmDescription.length} characters · Appears on the Our Team page of the proposal
        </p>
      </SectionToggle>

      {/* ── SECTION: Portfolio ── */}
      <SectionToggle
        icon={
          <svg className="w-5 h-5 text-[#0066cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
        title="Include portfolio examples?"
        description="Show past project photos to build trust. You can approve the current selection or add your own."
        enabled={includePortfolio}
        onToggle={() => setIncludePortfolio(!includePortfolio)}
      >
        <div className="space-y-2">
          {portfolioProjects.map((project, i) => (
            <PortfolioCard
              key={i}
              project={project}
              onChange={(updated) => updateProject(i, updated)}
              onRemove={() => removeProject(i)}
            />
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={addProject}
            className="flex-1 py-2.5 border-2 border-dashed border-[#0066cc]/40 text-[#0066cc] text-xs font-semibold rounded-xl hover:border-[#0066cc] hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add Project
          </button>
          {portfolioProjects.length > 0 && (
            <button
              onClick={() => setPortfolioProjects([])}
              className="px-4 py-2.5 border border-red-200 text-red-500 text-xs font-semibold rounded-xl hover:bg-red-50 transition-all cursor-pointer"
            >
              Remove All
            </button>
          )}
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 flex items-center gap-2 text-xs text-emerald-700">
          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          <span>
            {portfolioProjects.length > 0
              ? `${portfolioProjects.length} project${portfolioProjects.length > 1 ? "s" : ""} will be included — looks great!`
              : "No projects selected. Add some examples or leave this section off."}
          </span>
        </div>
      </SectionToggle>

      {/* ── Actions ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="px-8 py-6 space-y-4">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="w-full py-4 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-xl hover:ring-2 hover:ring-[#C9A84C] transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Schedule a Presentation
          </button>

          <button
            onClick={openProposal}
            className="w-full py-4 border-2 border-[#0A1628] text-[#0A1628] font-semibold rounded-xl hover:bg-[#0A1628] hover:text-white transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            View &amp; Print Proposal
          </button>
        </div>
      </div>

      {/* Pre-written Messages */}
      {showMessages && (
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
          <div className="px-8 py-6">
            <h3 className="text-sm font-semibold text-[#0A1628] uppercase tracking-wide mb-6">Pre-written Messages</h3>

            {/* Email */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#0A1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-semibold text-sm text-[#0A1628]">Email</span>
                </div>
                <button
                  onClick={() => copyToClipboard(`Subject: ${emailSubject}\n\n${emailBody}`, "email")}
                  className="text-xs px-3 py-1.5 bg-[#0A1628] text-[#C9A84C] rounded-lg hover:ring-1 hover:ring-[#C9A84C] transition-all cursor-pointer"
                >
                  {copied === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-[#E8E8E8]">
                <p className="text-xs font-semibold text-gray-500 mb-1">Subject: {emailSubject}</p>
                <pre className="text-sm text-[#1A1A2E] whitespace-pre-wrap font-sans leading-relaxed">{emailBody}</pre>
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="font-semibold text-sm text-[#0A1628]">WhatsApp</span>
                </div>
                <button
                  onClick={() => copyToClipboard(whatsappBody, "whatsapp")}
                  className="text-xs px-3 py-1.5 bg-[#0A1628] text-[#C9A84C] rounded-lg hover:ring-1 hover:ring-[#C9A84C] transition-all cursor-pointer"
                >
                  {copied === "whatsapp" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-[#E8E8E8]">
                <p className="text-sm text-[#1A1A2E] leading-relaxed">{whatsappBody}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setCurrentStep(3)}
        className="w-full py-4 border-2 border-[#0A1628] text-[#0A1628] font-semibold rounded-lg hover:bg-[#0A1628] hover:text-white transition-all duration-200 text-sm tracking-wide uppercase cursor-pointer"
      >
        ← Back to Fee Calculation
      </button>
    </div>
  );
}
