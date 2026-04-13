"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProposalData } from "../types";
import { TEAM_MEMBERS, PORTFOLIO_PROJECTS } from "./firmConfig";

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

// ── Photo placeholder (shown when image file doesn't exist yet) ───────────────
function PhotoFrame({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div
        className={className}
        style={{ ...style, backgroundColor: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "6px" }}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span style={{ fontSize: "9px", color: "#C9A84C", opacity: 0.7, textAlign: "center", padding: "0 8px" }}>
          {src}
        </span>
      </div>
    );
  }
  return (
    <div className={className} style={{ ...style, position: "relative", overflow: "hidden" }}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover", objectPosition: "center top" }}
        onError={() => setErrored(true)}
      />
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

// ── Main document ─────────────────────────────────────────────────────────────
export default function ProposalDocument() {
  const [data, setData] = useState<ProposalData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("proposalData");
      if (raw) setData(JSON.parse(raw));
    } catch (e) {
      console.error("Proposal parse error:", e);
    }
  }, []);

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
  const fullAddress = [projectInfo.projectAddress, projectInfo.city, projectInfo.province].filter(Boolean).join(", ");
  const totalDesignWeeks = selectedBasic.filter((s) => s.weeks !== null).reduce((sum, s) => sum + (s.weeks ?? 0), 0);

  return (
    <>
      {/* Print / Back buttons */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button onClick={() => window.print()} className="px-5 py-2.5 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-lg shadow-lg hover:ring-2 hover:ring-[#C9A84C] transition-all text-sm">
          Print / Save PDF
        </button>
        <button onClick={() => window.history.back()} className="px-4 py-2.5 bg-white border border-[#E8E8E8] text-gray-600 font-medium rounded-lg shadow-lg hover:bg-gray-50 transition-all text-sm">
          ← Back
        </button>
      </div>

      <div className="max-w-[800px] mx-auto bg-white">

        {/* ── PAGE 1: COVER ── */}
        <div className="proposal-cover bg-[#0A1628] min-h-screen flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
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
              {[0,40,80,120,160].map((o) => (
                <line key={o} x1="288" y1={o} x2={o} y2="288" stroke="#C9A84C" strokeWidth="1"/>
              ))}
            </svg>
          </div>
          <div className="relative z-10 px-16 pt-14">
            <div className="flex items-center gap-3 mb-20">
              <div className="w-10 h-10 border-2 border-[#C9A84C] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span className="text-[#C9A84C] font-semibold tracking-[0.2em] text-xs uppercase">
                Otávio Pires Chaves, Architect
              </span>
            </div>
          </div>
          <div className="relative z-10 flex-1 flex flex-col justify-center px-16 pb-16">
            <div className="w-16 h-1 bg-[#C9A84C] mb-10" />
            <p className="text-[#C9A84C] text-xs uppercase tracking-[0.3em] font-semibold mb-4">
              Architectural Fee Proposal
            </p>
            <h1 className="text-white text-5xl font-bold leading-tight mb-3">
              {projectInfo.projectAddress || projectInfo.city}
            </h1>
            <p className="text-blue-200 text-xl opacity-70 mb-10">
              {[projectInfo.city, projectInfo.province].filter(Boolean).join(", ")}
            </p>
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
                <p className="text-white font-bold text-sm">Otávio Pires Chaves</p>
                <p className="text-[#C9A84C] text-xs">Architect · Vancouver, BC</p>
              </div>
              <p className="text-blue-200 text-xs opacity-40">CONFIDENTIAL</p>
            </div>
          </div>
        </div>

        {/* ── PAGE 2: OUR TEAM ── */}
        <div className="proposal-section px-16 py-16">
          <SectionHeader num="02" title="Our Team" />

          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl">
            We are a boutique architectural practice based in Vancouver, BC, dedicated to delivering thoughtful, high-quality residential design. Every project is led by a principal architect from concept to completion.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="flex flex-col">
                {/* Photo */}
                <PhotoFrame
                  src={member.photo}
                  alt={member.name}
                  style={{ width: "100%", height: "220px", borderRadius: "12px", marginBottom: "16px", flexShrink: 0 }}
                />
                {/* Info */}
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

        {/* ── PAGE 3: TRANSFORMATIONS ── */}
        <div className="proposal-section px-16 py-16 bg-[#0A1628]">
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
            {PORTFOLIO_PROJECTS.map((project, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl">
                <PhotoFrame
                  src={project.photo}
                  alt={project.name}
                  style={{ width: "100%", height: "220px", borderRadius: "12px" }}
                />
                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-4 rounded-b-xl">
                  <p className="text-white text-sm font-bold leading-tight">{project.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[#C9A84C] text-xs">{project.location}</span>
                    <span className="text-white/30 text-xs">·</span>
                    <span className="text-white/60 text-xs">{project.year}</span>
                    <span className="text-white/30 text-xs">·</span>
                    <span className="text-white/60 text-xs">{project.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PAGE 4: SCOPE OF SERVICES ── */}
        <div className="proposal-section px-16 py-16">
          <SectionHeader num="04" title="Scope of Services" />

          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl">
            {projectInfo.description}
          </p>

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
                      {item.hasSiteVisits
                        ? `${item.phase} (${scopeData.siteVisits ?? 10} site visits)`
                        : item.phase}
                    </h4>
                    <span className="text-[#C9A84C] text-xs font-semibold ml-4 flex-shrink-0">
                      {item.phaseWeight}% of fee{item.weeks ? ` · ${item.weeks}w` : ""}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.deliverables.map((d) => (
                      <span key={d} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedAdditional.length > 0 && (
            <>
              <h3 className="text-[#0A1628] font-bold text-sm uppercase tracking-wider mb-5">Extended Scope — Additional Services</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedAdditional.map((s) => (
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

        {/* ── PAGE 5: PROJECT TIMELINE ── */}
        <div className="proposal-section px-16 py-16 bg-gray-50/50">
          <SectionHeader num="05" title="Project Timeline" />

          <p className="text-gray-500 text-sm mb-10">
            Estimated schedule from contract signing. Timelines are subject to client review periods, municipal processing times, and contractor selection.
          </p>

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

        {/* ── PAGE 6: FEE SUMMARY ── */}
        <div className="proposal-section px-16 py-16">
          <SectionHeader num="06" title="Fee Summary" />

          {/* Hero total */}
          <div className="bg-[#0A1628] rounded-2xl px-10 py-8 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 128 128" fill="none">
                <circle cx="128" cy="0" r="80" stroke="#C9A84C" strokeWidth="1"/>
                <circle cx="128" cy="0" r="50" stroke="#C9A84C" strokeWidth="1"/>
              </svg>
            </div>
            <p className="text-[#C9A84C]/70 text-xs uppercase tracking-[0.2em] mb-2">Total Professional Fee</p>
            <p className="text-white text-5xl font-bold mb-2">{fmt(totalFee)}</p>
            <p className="text-[#C9A84C] font-semibold">
              {feeData.totalPercentage.toFixed(1)}% of estimated construction cost ({fmt(projectInfo.constructionCost)})
            </p>
          </div>

          {/* Phase breakdown table */}
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
                    <td className="px-6 py-3 font-semibold text-sm text-gray-600" colSpan={2}>
                      Additional Services (+{(feeData.totalPercentage - feeData.basePercentage).toFixed(1)}%)
                    </td>
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

          {/* Payment schedule */}
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

        {/* ── PAGE 7: AGREEMENT ── */}
        <div className="proposal-section px-16 py-16 bg-gray-50/30">
          <SectionHeader num="07" title="Agreement" />

          <p className="text-gray-500 text-sm mb-8">
            This agreement is entered into between <strong>{projectInfo.clientName}</strong> (&ldquo;Client&rdquo;) and
            Otávio Pires Chaves, Architect (&ldquo;Architect&rdquo;), for professional architectural services
            related to the project at {fullAddress}.
          </p>

          <div className="space-y-5 text-sm">
            {[
              {
                num: "1", title: "Scope of Services",
                custom: (
                  <div className="text-xs text-gray-600 space-y-3">
                    <p>The Architect shall provide professional architectural services as described in this proposal. The following services are included under this agreement:</p>
                    {selectedBasic.length > 0 && (
                      <div>
                        <p className="font-semibold text-[#0A1628] mb-1.5">Basic Services:</p>
                        <ul className="space-y-1">
                          {selectedBasic.map((s, i) => (
                            <li key={s.id} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-[#0A1628] text-[#C9A84C] text-[8px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span><strong>{s.phase}</strong></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedAdditional.length > 0 && (
                      <div>
                        <p className="font-semibold text-[#0A1628] mb-1.5">Additional Services:</p>
                        <ul className="space-y-1">
                          {selectedAdditional.map((s) => (
                            <li key={s.id} className="flex items-start gap-2">
                              <svg className="w-3 h-3 text-[#C9A84C] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                              </svg>
                              <span>{s.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p>Services not listed above are excluded from this agreement and would require a separate written amendment.</p>
                  </div>
                )
              },
              {
                num: "2", title: "Project Specifications",
                custom: (
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div><span className="font-semibold text-[#0A1628]">Client:</span> {projectInfo.clientName}</div>
                    <div><span className="font-semibold text-[#0A1628]">Address:</span> {fullAddress}</div>
                    <div><span className="font-semibold text-[#0A1628]">Construction Cost:</span> {fmt(projectInfo.constructionCost)}</div>
                    <div><span className="font-semibold text-[#0A1628]">Area:</span> {projectInfo.area?.toLocaleString()} sq ft · {projectInfo.floors} floor{projectInfo.floors !== 1 ? "s" : ""}</div>
                    <div className="col-span-2 text-gray-500 mt-1">{projectInfo.description}</div>
                  </div>
                )
              },
              {
                num: "3", title: "Schedule",
                body: `The design phase is estimated at approximately ${totalDesignWeeks} weeks from contract signing to completed Construction Documents, subject to timely client decisions and approvals. Site Supervision commences at groundbreaking and continues through substantial completion.`
              },
              {
                num: "4", title: "Fees and Payment",
                body: `The total fee is ${fmt(totalFee)} (${feeData.totalPercentage.toFixed(1)}% of the estimated construction cost). Payment shall be made in six equal installments of ${fmt(installmentAmount)} each, due on Days 5, 30, 60, 90, 120, and 150 from contract signing. Invoices are due within 15 days. Interest of 1.5% per month applies to overdue balances.`
              },
              {
                num: "5", title: "Client Responsibilities",
                body: "The Client shall provide timely decisions, approvals, and required information, and shall designate a single authorized representative. Delays caused by the Client's failure to provide required information or decisions shall not constitute a breach by the Architect."
              },
              {
                num: "6", title: "Architect Responsibilities",
                body: "The Architect shall perform services with the skill and care ordinarily provided by competent architects practising in British Columbia, and shall maintain professional liability insurance throughout the duration of this agreement."
              },
              {
                num: "7", title: "Exclusions",
                custom: (
                  <ul className="space-y-1 list-disc list-inside text-xs text-gray-600">
                    <li>Permit application fees and municipal levies</li>
                    <li>Engineering consultants (structural, mechanical, electrical, civil)</li>
                    <li>Construction supervision beyond Site Supervision scope</li>
                    <li>Printing beyond the standard permit submission set</li>
                    <li>Land surveying, geotechnical investigations, and environmental assessments</li>
                  </ul>
                )
              },
              {
                num: "8", title: "Termination",
                custom: (
                  <div className="text-xs text-gray-600">
                    <p className="mb-2">Either party may terminate upon 14 days written notice. Upon termination, the Client shall pay for all services performed to date:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[["Pre-Design", 0.15], ["Schematic Design", 0.40], ["Design Development", 0.60], ["CD Permit Set", 0.70], ["CD Full Set", 1.00]].map(([phase, pct]) => (
                        <div key={phase as string} className="flex justify-between bg-gray-50 rounded px-3 py-1.5">
                          <span>{phase as string}: {((pct as number) * 100).toFixed(0)}%</span>
                          <span className="font-semibold text-[#0A1628]">{fmt(totalFee * (pct as number))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                num: "9", title: "Intellectual Property",
                body: `All drawings and documents remain the intellectual property of the Architect. Upon full payment, the Client is granted a non-exclusive licence to use the documents for the construction and maintenance of the project at ${fullAddress} only.`
              },
              {
                num: "10", title: "Governing Law",
                body: "This agreement shall be governed by and construed in accordance with the laws of the Province of British Columbia and the federal laws of Canada applicable therein."
              },
            ].map((clause) => (
              <div key={clause.num} className="border border-[#E8E8E8] rounded-xl overflow-hidden bg-white">
                <div className="bg-[#0A1628] px-5 py-3">
                  <h4 className="text-[#C9A84C] font-semibold text-xs uppercase tracking-wider">
                    {clause.num}. {clause.title}
                  </h4>
                </div>
                <div className="px-5 py-4 text-gray-600 text-xs leading-relaxed">
                  {clause.custom ?? <p>{clause.body}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Signatures */}
          <div className="mt-12">
            <h3 className="font-bold text-[#0A1628] text-sm uppercase tracking-wider mb-8">Signatures</h3>
            <div className="grid grid-cols-2 gap-10 mb-10">
              {["Client", "Architect"].map((role) => (
                <div key={role}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">{role}</p>
                  <div className="border-b-2 border-[#0A1628] mb-2 pb-10" />
                  <p className="text-sm font-semibold text-[#1A1A2E]">
                    {role === "Client" ? projectInfo.clientName : "Otávio Pires Chaves, Architect"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Date: _______________</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-10">
              {["Witness (Client)", "Witness (Architect)"].map((role) => (
                <div key={role}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">{role}</p>
                  <div className="border-b border-gray-300 mb-2 pb-10" />
                  <p className="text-xs text-gray-400">Print name: _______________</p>
                  <p className="text-xs text-gray-400 mt-1">Date: _______________</p>
                </div>
              ))}
            </div>
          </div>

          {/* DocuSign footer */}
          <div className="mt-12 bg-[#1A1A2E] rounded-xl px-8 py-5 flex items-center justify-between">
            <p className="text-gray-300 text-sm">Ready to sign digitally?</p>
            <button className="text-[#C9A84C] font-semibold text-sm hover:underline">
              Send via DocuSign →
            </button>
          </div>
        </div>

        <div className="h-8 bg-white" />
      </div>
    </>
  );
}
