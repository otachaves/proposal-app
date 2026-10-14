"use client";

import { useEffect, useState } from "react";
import { ProposalData, TeamMember, PortfolioProject } from "../types";
import { TEAM_MEMBERS, PORTFOLIO_PROJECTS, DEFAULT_FIRM_DESCRIPTION } from "./firmConfig";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

const today = () =>
  new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="w-1 h-12 bg-[#C9A84C]" />
      <div>
        <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-semibold">{num}</p>
        <h2 className="text-[#0A1628] text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
}

// ── Gantt chart ───────────────────────────────────────────────────────────────
function GanttChart({ basicServices }: { basicServices: ProposalData["scopeData"]["basicServices"] }) {
  const selected = basicServices.filter((s) => s.selected);
  const designPhases = selected.filter((s) => s.weeks !== null);
  const caPhase = selected.find((s) => s.hasSiteVisits);

  const totalDesignWeeks = designPhases.reduce((sum, s) => sum + (s.weeks ?? 0), 0);
  if (totalDesignWeeks === 0) return null;

  const caDisplayWeeks = caPhase ? Math.round(totalDesignWeeks * 0.55) : 0;
  const totalDisplay = totalDesignWeeks + caDisplayWeeks;

  const tickInterval = totalDisplay <= 12 ? 2 : totalDisplay <= 24 ? 4 : 5;
  const ticks: number[] = [];
  for (let w = 0; w <= totalDisplay; w += tickInterval) ticks.push(w);

  const PHASE_COLORS = ["#0A1628", "#1a2d4a", "#1e3a5f", "#2c4a70", "#C9A84C", "#b8933e"];
  let cursor = 0;

  return (
    <div style={{ fontFamily: "inherit" }}>
      <div className="flex mb-1 pl-40">
        <div className="flex-1 relative h-4">
          {ticks.map((w) => (
            <div key={w} className="absolute top-0 flex flex-col items-center" style={{ left: `${(w / totalDisplay) * 100}%`, transform: "translateX(-50%)" }}>
              <span style={{ fontSize: "8px", color: "#9ca3af" }}>w{w}</span>
              <div style={{ width: "1px", height: "4px", backgroundColor: "#d1d5db" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {designPhases.map((phase, i) => {
          const weeks = phase.weeks ?? 0;
          const leftPct = (cursor / totalDisplay) * 100;
          const widthPct = (weeks / totalDisplay) * 100;
          cursor += weeks;
          const color = PHASE_COLORS[i % PHASE_COLORS.length];
          const isGold = color === "#C9A84C";
          return (
            <div key={phase.id} className="flex items-center gap-2">
              <div style={{ width: "160px", flexShrink: 0 }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#0A1628", lineHeight: 1.2 }}>
                  {phase.phase.split("—")[0].trim().replace(" & Data Collection", "")}
                </p>
                <p style={{ fontSize: "9px", color: "#9ca3af" }}>{phase.phaseWeight}% of fee · {weeks}w</p>
              </div>
              <div className="flex-1 relative" style={{ height: "24px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: `${leftPct}%`, width: `${widthPct}%`, height: "100%", backgroundColor: color, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "24px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, color: isGold ? "#0A1628" : "white", padding: "0 4px", whiteSpace: "nowrap" }}>
                    {weeks} {weeks === 1 ? "wk" : "wks"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {caPhase && (
          <div className="flex items-center gap-2">
            <div style={{ width: "160px", flexShrink: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "#0A1628", lineHeight: 1.2 }}>Site Supervision</p>
              <p style={{ fontSize: "9px", color: "#9ca3af" }}>{caPhase.phaseWeight}% of fee · open-ended</p>
            </div>
            <div className="flex-1 relative" style={{ height: "24px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: `${(cursor / totalDisplay) * 100}%`, width: `${(caDisplayWeeks / totalDisplay) * 100}%`, height: "100%", backgroundColor: "#0A1628", borderRadius: "4px", borderRight: "3px dashed #C9A84C", display: "flex", alignItems: "center", paddingLeft: "8px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#C9A84C", whiteSpace: "nowrap" }}>→ During construction</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 flex justify-between items-center" style={{ borderTop: "1px solid #e5e7eb" }}>
        <p style={{ fontSize: "10px", color: "#6b7280" }}>Estimated design phase: ~{totalDesignWeeks} weeks from contract signing</p>
        <p style={{ fontSize: "10px", color: "#6b7280" }}>Permit review: typically 6–12 weeks (not shown)</p>
      </div>
    </div>
  );
}

// ── DocuSign demo modal ───────────────────────────────────────────────────────
function DocuSignModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E8E8E8] overflow-hidden">
        <div className="bg-[#0A1628] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#C9A84C]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span className="text-white text-sm font-semibold tracking-wide uppercase">DocuSign Integration</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-lg cursor-pointer">✕</button>
        </div>
        <div className="px-8 py-8 space-y-5">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">🔗</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-[#0A1628]">This is a demo</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              To enable real e-signatures, personalize this project and connect it to your DocuSign account. SMAC can configure this integration for your firm.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-[#0A1628] space-y-2">
            <p className="font-semibold">What the full integration includes:</p>
            <ul className="space-y-1 text-gray-600">
              <li>✓ Send the agreement directly for e-signature</li>
              <li>✓ Real-time signature status tracking</li>
              <li>✓ Automatic PDF archiving on completion</li>
              <li>✓ Client & architect signing workflows</li>
            </ul>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-xl hover:ring-2 hover:ring-[#C9A84C] transition-all text-sm tracking-wide uppercase cursor-pointer"
          >
            Got it — close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Photo frame ───────────────────────────────────────────────────────────────
function DynamicPhotoFrame({ src, alt, className, style }: {
  src: string; alt: string; className?: string; style?: React.CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className={className} style={{ ...style, backgroundColor: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "6px" }}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span style={{ fontSize: "9px", color: "#C9A84C", opacity: 0.7, textAlign: "center", padding: "0 8px" }}>No photo</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} style={{ ...style, objectFit: "cover", objectPosition: "center top" }} onError={() => setErrored(true)} />
  );
}

// ── Agreement text generator ──────────────────────────────────────────────────
function buildAgreementText(data: ProposalData, activeFirmName: string): string {
  const { projectInfo, scopeData, feeData } = data;
  if (!feeData) return "";
  const fullAddress = [projectInfo.projectAddress, projectInfo.city, projectInfo.province].filter(Boolean).join(", ");
  const totalFee = feeData.totalFee;
  const installmentAmount = totalFee / 6;
  const selectedBasic = scopeData?.basicServices?.filter(s => s.selected) ?? [];
  const selectedAdditional = scopeData?.additionalServices?.filter(s => s.selected) ?? [];
  const totalDesignWeeks = selectedBasic.filter(s => s.weeks !== null).reduce((sum, s) => sum + (s.weeks ?? 0), 0);

  return `ARCHITECTURAL SERVICES AGREEMENT

Date: ${today()}
Prepared by: ${activeFirmName}

This agreement is entered into between ${projectInfo.clientName} ("Client") and ${activeFirmName} ("Architect"), for professional architectural services related to the project at ${fullAddress}.

────────────────────────────────────────────

1. SCOPE OF SERVICES

The Architect shall provide professional architectural services as described in this proposal. The following services are included under this agreement:

Basic Services:
${selectedBasic.map((s, i) => `  ${String.fromCharCode(65 + i)}. ${s.phase}`).join("\n")}${selectedAdditional.length > 0 ? `\n\nAdditional Services:\n${selectedAdditional.map(s => `  • ${s.label}`).join("\n")}` : ""}

Services not listed above are excluded from this agreement and would require a separate written amendment.

────────────────────────────────────────────

2. PROJECT SPECIFICATIONS

Client: ${projectInfo.clientName}
Project Address: ${fullAddress}
Estimated Construction Cost: ${fmt(projectInfo.constructionCost)}
Floor Area: ${projectInfo.area?.toLocaleString()} sq ft · ${projectInfo.floors} floor${projectInfo.floors !== 1 ? "s" : ""}

Project Description:
${projectInfo.description}

────────────────────────────────────────────

3. SCHEDULE

The design phase is estimated at approximately ${totalDesignWeeks} weeks from contract signing to completed Construction Documents, subject to timely client decisions and approvals. Site Supervision commences at groundbreaking and continues through substantial completion.

────────────────────────────────────────────

4. FEES AND PAYMENT

Total Professional Fee: ${fmt(totalFee)}
(${feeData.totalPercentage.toFixed(1)}% of estimated construction cost of ${fmt(projectInfo.constructionCost)})

Payment shall be made in six equal installments of ${fmt(installmentAmount)} each, due on Days 5, 30, 60, 90, 120, and 150 from contract signing. Invoices are due within 15 days. Interest of 1.5% per month applies to overdue balances.

────────────────────────────────────────────

5. CLIENT RESPONSIBILITIES

The Client shall provide timely decisions, approvals, and required information, and shall designate a single authorized representative. Delays caused by the Client's failure to provide required information or decisions shall not constitute a breach by the Architect.

────────────────────────────────────────────

6. ARCHITECT RESPONSIBILITIES

The Architect shall perform services with the skill and care ordinarily provided by competent architects practising in British Columbia, and shall maintain professional liability insurance throughout the duration of this agreement.

────────────────────────────────────────────

7. EXCLUSIONS

The following are excluded from this agreement:
  • Permit application fees and municipal levies
  • Engineering consultants (structural, mechanical, electrical, civil)
  • Construction supervision beyond Site Supervision scope
  • Printing beyond the standard permit submission set
  • Land surveying, geotechnical investigations, and environmental assessments

────────────────────────────────────────────

8. TERMINATION

Either party may terminate upon 14 days written notice. Upon termination, the Client shall pay for all services performed to date, based on the following completion percentages:
  • Pre-Design: 15% = ${fmt(totalFee * 0.15)}
  • Schematic Design: 40% = ${fmt(totalFee * 0.40)}
  • Design Development: 60% = ${fmt(totalFee * 0.60)}
  • CD Permit Set: 70% = ${fmt(totalFee * 0.70)}
  • CD Full Set: 100% = ${fmt(totalFee)}

────────────────────────────────────────────

9. INTELLECTUAL PROPERTY

All drawings and documents remain the intellectual property of the Architect. Upon full payment, the Client is granted a non-exclusive licence to use the documents for the construction and maintenance of the project at ${fullAddress} only.

────────────────────────────────────────────

10. GOVERNING LAW

This agreement shall be governed by and construed in accordance with the laws of the Province of British Columbia and the federal laws of Canada applicable therein.

════════════════════════════════════════════
SIGNATURES
════════════════════════════════════════════

CLIENT: ${projectInfo.clientName}

Signature: _______________________________________________

Print Name: ______________________________________________

Date: ___________________________________________________

Witness Signature: _______________________________________

Witness Print Name: ______________________________________

Date: ___________________________________________________


ARCHITECT: ${activeFirmName}

Signature: _______________________________________________

Print Name: ______________________________________________

Date: ___________________________________________________

Witness Signature: _______________________________________

Witness Print Name: ______________________________________

Date: ___________________________________________________
`;
}

// ── Main document ─────────────────────────────────────────────────────────────
export default function ProposalDocument() {
  const [data, setData] = useState<ProposalData | null>(null);
  const [showDocuSign, setShowDocuSign] = useState(false);
  const [activeTab, setActiveTab] = useState<"proposal" | "agreement">("proposal");
  const [agreementText, setAgreementText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("proposalData");
      if (raw) setData(JSON.parse(raw));
    } catch (e) {
      console.error("Proposal parse error:", e);
    }
  }, []);

  // Build agreement text once data loads
  useEffect(() => {
    if (data) {
      const activeFirmName = data.firmName || "Your Firm, Architect";
      setAgreementText(buildAgreementText(data, activeFirmName));
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No proposal data found.</p>
          <a href="/" className="text-[#0A1628] underline">← Return to proposal builder</a>
        </div>
      </div>
    );
  }

  const { projectInfo, scopeData, feeData } = data;
  if (!feeData) return null;

  const activeFirmName = data.firmName || "Your Firm, Architect";
  const activeFirmDesc = data.firmDescription ?? DEFAULT_FIRM_DESCRIPTION;
  const activeTeam: TeamMember[] = (data.teamMembers && data.teamMembers.length > 0) ? data.teamMembers : TEAM_MEMBERS;
  const activePortfolio: PortfolioProject[] = (data.portfolioProjects && data.portfolioProjects.length > 0) ? data.portfolioProjects : PORTFOLIO_PROJECTS;
  const showTeam = data.includeTeam !== false;
  const showPortfolio = data.includePortfolio !== false;

  const totalFee = feeData.totalFee;
  const installmentAmount = totalFee / 6;
  const installmentSchedule = [
    { label: "1st Installment", when: "Upon contract signing (Day 5)" },
    { label: "2nd Installment", when: "Day 30" },
    { label: "3rd Installment", when: "Day 60" },
    { label: "4th Installment", when: "Day 90" },
    { label: "5th Installment", when: "Day 120" },
    { label: "6th Installment", when: "Day 150" },
  ];

  const selectedBasic = scopeData?.basicServices?.filter((s) => s.selected) ?? [];
  const selectedAdditional = scopeData?.additionalServices?.filter((s) => s.selected) ?? [];
  const totalDesignWeeks = selectedBasic.filter((s) => s.weeks !== null).reduce((sum, s) => sum + (s.weeks ?? 0), 0);

  const printDoc = () => {
    document.body.setAttribute("data-print-tab", activeTab);
    window.print();
    setTimeout(() => document.body.removeAttribute("data-print-tab"), 1000);
  };

  return (
    <>
      {showDocuSign && <DocuSignModal onClose={() => setShowDocuSign(false)} />}

      {/* ── Print CSS ── */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; }
          @page { margin: 0; size: A4; }

          /* Default: hide agreement when printing proposal tab */
          .agreement-print-only { display: none !important; }

          /* When printing agreement tab */
          body[data-print-tab="agreement"] .proposal-print-only { display: none !important; }
          body[data-print-tab="agreement"] .agreement-print-only { display: block !important; }

          /* Agreement textarea prints like a div */
          .agreement-textarea {
            border: none !important;
            resize: none !important;
            overflow: visible !important;
            height: auto !important;
            min-height: unset !important;
            font-family: "Courier New", monospace !important;
            font-size: 11pt !important;
            line-height: 1.7 !important;
            white-space: pre-wrap !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* ── Fixed tab header (no-print) ── */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8E8E8] shadow-sm">
        <div className="max-w-[800px] mx-auto px-4 py-2 flex items-center gap-3">
          {/* Tabs */}
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => setActiveTab("proposal")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "proposal"
                  ? "bg-[#0A1628] text-[#C9A84C]"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              📄 Proposal
            </button>
            <button
              onClick={() => setActiveTab("agreement")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "agreement"
                  ? "bg-[#0A1628] text-[#C9A84C]"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              ✍️ Agreement
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={printDoc}
              className="px-4 py-2 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-lg shadow hover:ring-2 hover:ring-[#C9A84C] transition-all text-xs cursor-pointer whitespace-nowrap"
            >
              🖨 Print {activeTab === "proposal" ? "Proposal" : "Agreement"}
            </button>
            {activeTab === "agreement" && (
              <button
                onClick={() => setShowDocuSign(true)}
                className="px-4 py-2 bg-[#C9A84C] text-[#0A1628] font-semibold rounded-lg shadow hover:opacity-90 transition-all text-xs cursor-pointer whitespace-nowrap"
              >
                Send via DocuSign →
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="px-3 py-2 bg-white border border-[#E8E8E8] text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-all text-xs cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* ── Content (pt-12 to clear fixed header) ── */}
      <div className="max-w-[800px] mx-auto bg-white pt-12">

        {/* ══ PROPOSAL TAB ══════════════════════════════════════════════════════ */}
        <div className="proposal-print-only" style={{ display: activeTab === "proposal" ? "block" : "none" }}>

          {/* PAGE 1: COVER */}
          <div className="bg-[#0A1628] min-h-screen flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-72 h-72 opacity-10">
              <svg viewBox="0 0 288 288" fill="none">
                {[0,40,80,120,160].map(o => <line key={o} x1="288" y1={o} x2={o} y2="288" stroke="#C9A84C" strokeWidth="1"/>)}
              </svg>
            </div>
            <div className="relative z-10 px-16 pt-14">
              <div className="flex items-center gap-3 mb-20">
                <div className="w-10 h-10 border-2 border-[#C9A84C] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <span className="text-[#C9A84C] font-semibold tracking-[0.2em] text-xs uppercase">{activeFirmName}</span>
              </div>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center px-16 pb-16">
              <div className="w-16 h-1 bg-[#C9A84C] mb-10" />
              <p className="text-[#C9A84C] text-xs uppercase tracking-[0.3em] font-semibold mb-4">Architectural Fee Proposal</p>
              <h1 className="text-white text-5xl font-bold leading-tight mb-3">{projectInfo.projectAddress || projectInfo.city}</h1>
              <p className="text-blue-200 text-xl opacity-70 mb-10">{[projectInfo.city, projectInfo.province].filter(Boolean).join(", ")}</p>
              <div className="w-full h-px bg-[#C9A84C]/30 mb-10" />
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[#C9A84C]/60 text-xs uppercase tracking-wider mb-1">Prepared for</p>
                  <p className="text-white text-xl font-semibold">{projectInfo.clientName}</p>
                </div>
                <div>
                  <p className="text-[#C9A84C]/60 text-xs uppercase tracking-wider mb-1">Date</p>
                  <p className="text-white text-xl font-semibold">{today()}</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 px-16 pb-12">
              <div className="w-full h-px bg-[#C9A84C]/30 mb-8" />
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white font-bold text-sm">{activeFirmName}</p>
                  <p className="text-[#C9A84C] text-xs">Architect · Vancouver, BC</p>
                </div>
                <p className="text-blue-200 text-xs opacity-40">CONFIDENTIAL</p>
              </div>
            </div>
          </div>

          {/* PAGE 2: TEAM */}
          {showTeam && (
            <div className="px-16 py-16">
              <SectionHeader num="02" title="Our Team" />
              {activeFirmDesc && <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl">{activeFirmDesc}</p>}
              <div className="grid grid-cols-2 gap-8">
                {activeTeam.map((member, i) => (
                  <div key={i} className="flex flex-col">
                    <DynamicPhotoFrame src={member.photo} alt={member.name} style={{ width: "100%", height: "220px", borderRadius: "12px", marginBottom: "16px", flexShrink: 0 }} />
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-[#0A1628] text-base leading-tight">{member.name}</h3>
                        <span className="text-xs text-[#C9A84C] font-semibold ml-2 flex-shrink-0">{member.credentials}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{member.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 3: PORTFOLIO */}
          {showPortfolio && (
            <div className="px-16 py-16 bg-[#0A1628]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-1 h-12 bg-[#C9A84C]" />
                <div>
                  <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-semibold">03</p>
                  <h2 className="text-white text-3xl font-bold">Transformations</h2>
                </div>
              </div>
              <p className="text-blue-200 text-sm opacity-70 mb-10 max-w-xl">
                A selection of recently completed projects — each one a collaboration between our team, our clients, and the communities they call home.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {activePortfolio.map((project, i) => (
                  <div key={i} className="relative overflow-hidden rounded-xl">
                    <DynamicPhotoFrame src={project.photo} alt={project.name} style={{ width: "100%", height: "220px", borderRadius: "12px", display: "block" }} />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-4 rounded-b-xl">
                      <p className="text-white text-sm font-bold leading-tight">{project.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#C9A84C] text-xs">{project.location}</span>
                        {project.year && <><span className="text-white/30 text-xs">·</span><span className="text-white/60 text-xs">{project.year}</span></>}
                        {project.type && <><span className="text-white/30 text-xs">·</span><span className="text-white/60 text-xs">{project.type}</span></>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 4: SCOPE */}
          <div className="px-16 py-16">
            <SectionHeader num="04" title="Scope of Services" />
            <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl">{projectInfo.description}</p>
            <h3 className="text-[#0A1628] font-bold text-sm uppercase tracking-wider mb-6">Basic Services — Included</h3>
            <div className="space-y-5 mb-12">
              {selectedBasic.map((item, i) => (
                <div key={item.id} className="flex gap-5 pb-5 border-b border-[#E8E8E8] last:border-0">
                  <div className="w-7 h-7 rounded-full bg-[#0A1628] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#C9A84C] text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-bold text-[#0A1628] text-sm">
                        {item.hasSiteVisits ? `${item.phase} (${scopeData.siteVisits ?? 10} site visits)` : item.phase}
                      </h4>
                      <span className="text-[#C9A84C] text-xs font-semibold ml-4 flex-shrink-0">
                        {item.phaseWeight}% of fee{item.weeks ? ` · ${item.weeks}w` : ""}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.deliverables.map(d => <span key={d} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{d}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedAdditional.length > 0 && (
              <>
                <h3 className="text-[#0A1628] font-bold text-sm uppercase tracking-wider mb-5">Extended Scope — Additional Services</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedAdditional.map(s => (
                    <div key={s.id} className="flex items-center gap-2 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-lg px-3 py-2">
                      <div className="w-4 h-4 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-[#1A1A2E] flex-1">{s.label}</span>
                      <span className="text-xs text-[#C9A84C] font-semibold">+{s.percentage}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* PAGE 5: TIMELINE */}
          <div className="px-16 py-16 bg-gray-50/50">
            <SectionHeader num="05" title="Project Timeline" />
            <p className="text-gray-500 text-sm mb-10">Estimated schedule from contract signing. Timelines are subject to client review periods, municipal processing times, and contractor selection.</p>
            <div className="bg-white rounded-xl border border-[#E8E8E8] p-6 mb-8">
              <GanttChart basicServices={scopeData?.basicServices ?? []} />
            </div>
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-5">
              <p className="text-xs font-semibold text-[#0A1628] mb-2">Timeline Notes</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Design phase total: ~{totalDesignWeeks} weeks from contract signing to completed Construction Documents</li>
                <li>• Municipal permit review: typically 6–12 weeks (not included above)</li>
                <li>• Client review periods: approximately 1 week per phase, not included</li>
                <li>• Site Supervision begins at groundbreaking and runs to occupancy</li>
                <li>• Schedule may be adjusted based on project complexity and client feedback</li>
              </ul>
            </div>
          </div>

          {/* PAGE 6: FEE SUMMARY */}
          <div className="px-16 py-16">
            <SectionHeader num="06" title="Fee Summary" />
            <div className="bg-[#0A1628] rounded-2xl px-10 py-8 mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <svg viewBox="0 0 128 128" fill="none">
                  <circle cx="128" cy="0" r="80" stroke="#C9A84C" strokeWidth="1"/>
                  <circle cx="128" cy="0" r="50" stroke="#C9A84C" strokeWidth="1"/>
                </svg>
              </div>
              <p className="text-[#C9A84C]/70 text-xs uppercase tracking-[0.2em] mb-2">Total Professional Fee</p>
              <p className="text-white text-5xl font-bold mb-2">{fmt(totalFee)}</p>
              <p className="text-[#C9A84C] font-semibold">{feeData.totalPercentage.toFixed(1)}% of estimated construction cost ({fmt(projectInfo.constructionCost)})</p>
            </div>

            <div className="bg-white rounded-xl border border-[#E8E8E8] overflow-hidden mb-10">
              <div className="px-6 py-4 bg-[#0A1628]/5 border-b border-[#E8E8E8]">
                <h3 className="font-bold text-[#0A1628] text-sm uppercase tracking-wider">Fee Breakdown by Phase</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E8E8]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Phase</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Weight</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {feeData.phaseBreakdown.map((phase, i) => (
                    <tr key={i} className="border-b border-[#E8E8E8] last:border-0">
                      <td className="px-6 py-3 text-sm text-[#1A1A2E]">{phase.phase}</td>
                      <td className="px-6 py-3 text-sm text-center text-gray-500">{phase.percentage}%</td>
                      <td className="px-6 py-3 text-sm font-semibold text-right">{fmt(phase.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {feeData.additionalServicesFee > 0 && (
                    <tr className="bg-[#0A1628]/5">
                      <td className="px-6 py-3 font-semibold text-sm text-gray-600" colSpan={2}>Additional Services (+{(feeData.totalPercentage - feeData.basePercentage).toFixed(1)}%)</td>
                      <td className="px-6 py-3 font-semibold text-right text-sm">{fmt(feeData.additionalServicesFee)}</td>
                    </tr>
                  )}
                  {feeData.directCosts > 0 && (
                    <tr className="bg-[#0A1628]/3">
                      <td className="px-6 py-2 text-sm text-gray-600" colSpan={2}>Direct Costs</td>
                      <td className="px-6 py-2 text-sm font-semibold text-right">{fmt(feeData.directCosts)}</td>
                    </tr>
                  )}
                  <tr className="bg-[#0A1628]">
                    <td className="px-6 py-4 font-bold text-white text-lg" colSpan={2}>TOTAL FEE</td>
                    <td className="px-6 py-4 font-bold text-right text-[#C9A84C] text-xl">{fmt(totalFee)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-white rounded-xl border border-[#E8E8E8] overflow-hidden">
              <div className="px-6 py-4 bg-[#0A1628]/5 border-b border-[#E8E8E8]">
                <h3 className="font-bold text-[#0A1628] text-sm uppercase tracking-wider">Payment Schedule</h3>
                <p className="text-xs text-gray-400 mt-0.5">Six equal installments from contract signing</p>
              </div>
              <table className="w-full">
                <tbody>
                  {installmentSchedule.map((inst, i) => (
                    <tr key={i} className="border-b border-[#E8E8E8] last:border-0">
                      <td className="px-6 py-3 text-sm font-medium text-[#1A1A2E]">{inst.label}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{inst.when}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-right">{fmt(installmentAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGE 7: CLOSING CTA */}
          <div className="bg-[#0A1628] px-16 py-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%">
                <defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#grid2)" />
              </svg>
            </div>
            <div className="relative z-10 max-w-lg mx-auto space-y-8">
              <div className="w-12 h-0.5 bg-[#C9A84C] mx-auto" />
              <div className="space-y-3">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.3em] font-semibold">Next Steps</p>
                <h2 className="text-white text-4xl font-bold leading-tight">Ready to move forward?</h2>
                <p className="text-blue-200 text-base opacity-70 leading-relaxed">
                  We&apos;re excited about the potential of this project and confident we can deliver exceptional results. Review the agreement and let&apos;s get started.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
                <button
                  onClick={() => setActiveTab("agreement")}
                  className="px-8 py-4 bg-[#C9A84C] text-[#0A1628] font-bold rounded-xl hover:opacity-90 transition-all text-sm tracking-wide cursor-pointer shadow-lg"
                >
                  Approve — View Agreement →
                </button>
                <button
                  onClick={() => alert("Demo: In your personalized version, this would open your booking link (e.g. Calendly).")}
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-all text-sm tracking-wide cursor-pointer"
                >
                  Need more info — Book a meeting
                </button>
              </div>

              <div className="pt-4 border-t border-[#C9A84C]/20">
                <p className="text-white font-bold text-sm">{activeFirmName}</p>
                <p className="text-[#C9A84C] text-xs opacity-70 mt-1">Thank you for the opportunity to present this proposal.</p>
              </div>
            </div>
          </div>

        </div>{/* end proposal-print-only */}


        {/* ══ AGREEMENT TAB ═════════════════════════════════════════════════════ */}
        <div className="agreement-print-only" style={{ display: activeTab === "agreement" ? "block" : "none" }}>
          <div className="px-8 py-8">

            {/* Agreement header */}
            <div className="bg-[#0A1628] rounded-2xl px-8 py-6 mb-8">
              <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-semibold mb-1">07</p>
              <h1 className="text-white text-3xl font-bold">Agreement</h1>
              <p className="text-blue-200 text-sm opacity-70 mt-1">
                Review and edit the agreement below. When ready, print or send via DocuSign.
              </p>
            </div>

            {/* Editable agreement text */}
            <textarea
              className="agreement-textarea w-full px-6 py-5 font-mono text-sm text-gray-800 border border-[#E8E8E8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066cc] resize-none leading-relaxed bg-gray-50"
              value={agreementText}
              onChange={e => setAgreementText(e.target.value)}
              rows={70}
              spellCheck={false}
            />

            <p className="text-xs text-gray-400 mt-2 mb-6">
              This agreement is fully editable. Changes made here are reflected in the printed version.
            </p>

            {/* Agreement actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={printDoc}
                className="no-print flex-1 py-3.5 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-xl hover:ring-2 hover:ring-[#C9A84C] transition-all text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                🖨 Print Agreement / Save PDF
              </button>
              <button
                onClick={() => setShowDocuSign(true)}
                className="no-print flex-1 py-3.5 bg-[#C9A84C] text-[#0A1628] font-semibold rounded-xl hover:opacity-90 transition-all text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                Send via DocuSign →
              </button>
            </div>
          </div>
        </div>

        <div className="h-8 bg-white" />
      </div>
    </>
  );
}
