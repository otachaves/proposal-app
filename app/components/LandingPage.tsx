"use client";

import { useState, useEffect } from "react";
import { useApp } from "../store";
import { ArrowRight, Sparkles } from "lucide-react";

// ─── Proposal slide mockups for the carousel ─────────────────────────────────
const SLIDES = [
  // 01 Project Info
  <div key="s1" className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
    <div className="bg-[#0A1628] px-5 py-4">
      <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-widest mb-1">Step 1 of 4</p>
      <p className="text-white font-bold text-sm">Project Information</p>
    </div>
    <div className="px-5 py-4 space-y-3">
      <div className="space-y-1">
        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Client</p>
        <div className="h-7 bg-slate-100 rounded-lg px-3 flex items-center">
          <span className="text-[11px] text-slate-600 font-medium">John & Sarah Smith</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Project Address</p>
        <div className="h-7 bg-slate-100 rounded-lg px-3 flex items-center">
          <span className="text-[11px] text-slate-600 font-medium">1240 Maple Court, West Vancouver</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Construction Cost</p>
          <div className="h-7 bg-[#0A1628] rounded-lg px-3 flex items-center">
            <span className="text-[11px] text-white font-bold">$2,100,000</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Area</p>
          <div className="h-7 bg-slate-100 rounded-lg px-3 flex items-center">
            <span className="text-[11px] text-slate-600">3,800 sq ft</span>
          </div>
        </div>
      </div>
    </div>
  </div>,

  // 02 Services
  <div key="s2" className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
    <div className="bg-[#0A1628] px-5 py-4">
      <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-widest mb-1">Step 2 of 4</p>
      <p className="text-white font-bold text-sm">Services & Scope</p>
    </div>
    <div className="px-5 py-4 space-y-2">
      {[
        ["Schematic Design", "15%", true],
        ["Design Development", "40%", true],
        ["Construction Documents", "20%", true],
        ["Site Supervision", "20%", true],
        ["3D Renderings", "+2%", false],
      ].map(([label, pct, checked]) => (
        <div key={label as string} className={`flex items-center justify-between rounded-lg px-3 py-2 ${checked ? "bg-[#0A1628]/5 border border-[#0A1628]/10" : "bg-slate-50 border border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked ? "bg-[#0066cc] border-[#0066cc]" : "border-slate-300"}`}>
              {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className={`text-[11px] font-medium ${checked ? "text-[#0A1628]" : "text-slate-400"}`}>{label as string}</span>
          </div>
          <span className={`text-[10px] font-bold ${checked ? "text-[#C9A84C]" : "text-slate-300"}`}>{pct as string}</span>
        </div>
      ))}
    </div>
  </div>,

  // 03 Fee & Margins
  <div key="s3" className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
    <div className="bg-[#0A1628] px-5 py-4">
      <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-widest mb-1">Step 3 of 4</p>
      <p className="text-white font-bold text-sm">Fee & Profit Analysis</p>
    </div>
    <div className="px-5 py-4 space-y-3">
      <div className="bg-[#0A1628] rounded-xl p-3">
        <p className="text-slate-400 text-[9px] uppercase tracking-wider mb-1">Total Professional Fee</p>
        <p className="text-white text-xl font-bold">$210,000</p>
        <p className="text-[#C9A84C] text-[10px] font-semibold mt-0.5">10.0% of $2,100,000</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 rounded-lg p-2.5 text-center border border-slate-100">
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Labor Cost</p>
          <p className="text-[13px] font-bold text-[#0A1628] mt-0.5">$111,510</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2.5 text-center border border-emerald-100">
          <p className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider">Profit Margin</p>
          <p className="text-[13px] font-bold text-emerald-700 mt-0.5">23% · $48k</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {[["Schematic Design", "$31,500"], ["Design Development", "$84,000"], ["Site Supervision", "$42,000"]].map(([p, v]) => (
          <div key={p as string} className="flex justify-between text-[10px]">
            <span className="text-slate-500">{p as string}</span>
            <span className="font-semibold text-[#0A1628]">{v as string}</span>
          </div>
        ))}
      </div>
    </div>
  </div>,

  // 04 Schedule
  <div key="s4" className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
    <div className="bg-[#0A1628] px-5 py-4">
      <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-widest mb-1">Proposal Output</p>
      <p className="text-white font-bold text-sm">Project Schedule</p>
    </div>
    <div className="px-5 py-4 space-y-2.5">
      {[
        ["Pre-Design", 2, "#0A1628", "0"],
        ["Schematic Design", 3, "#1a3a5c", "20"],
        ["Design Development", 3, "#1e4a7a", "45"],
        ["Permit Set", 5, "#0A1628", "70"],
        ["Site Supervision", 4, "#C9A84C", "78"],
      ].map(([label, w, color, left]) => (
        <div key={label as string} className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[10px] font-semibold text-slate-600">{label as string}</span>
            <span className="text-[9px] text-slate-400">{w as number}w</span>
          </div>
          <div className="relative h-4 bg-slate-100 rounded overflow-hidden">
            <div
              className="absolute h-full rounded"
              style={{ backgroundColor: color as string, left: `${left}%`, width: `${(w as number) * 6}%`, minWidth: "20px" }}
            />
          </div>
        </div>
      ))}
      <p className="text-[9px] text-slate-400 pt-1">~13 weeks design phase from contract signing</p>
    </div>
  </div>,

  // 05 Proposal Cover
  <div key="s5" className="w-full bg-[#0A1628] rounded-2xl overflow-hidden shadow-md">
    <div className="px-5 pt-6 pb-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10 w-20 h-20">
        <svg viewBox="0 0 80 80" fill="none">
          {[0,15,30,45].map(o => <line key={o} x1="80" y1={o} x2={o} y2="80" stroke="#C9A84C" strokeWidth="1"/>)}
        </svg>
      </div>
      <div className="w-6 h-1 bg-[#C9A84C] mb-4" />
      <p className="text-[#C9A84C] text-[9px] uppercase tracking-widest font-semibold mb-2">Architectural Fee Proposal</p>
      <p className="text-white font-bold text-base leading-tight">1240 Maple Court</p>
      <p className="text-blue-300 text-[11px] opacity-70 mt-0.5">West Vancouver, BC</p>
      <div className="border-t border-[#C9A84C]/20 mt-4 pt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[#C9A84C]/60 text-[8px] uppercase tracking-wider">Prepared for</p>
          <p className="text-white text-[11px] font-semibold mt-0.5">John & Sarah Smith</p>
        </div>
        <div>
          <p className="text-[#C9A84C]/60 text-[8px] uppercase tracking-wider">Total Fee</p>
          <p className="text-[#C9A84C] text-[11px] font-bold mt-0.5">$210,000 CAD</p>
        </div>
      </div>
    </div>
    <div className="border-t border-white/5 px-5 py-3 flex justify-between items-center">
      <p className="text-white text-[10px] font-semibold">Your Firm Name, Architect</p>
      <p className="text-blue-300 text-[9px] opacity-40">CONFIDENTIAL</p>
    </div>
  </div>,

  // 06 Agreement & Signature
  <div key="s6" className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
    <div className="bg-[#0A1628] px-5 py-4">
      <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-widest mb-1">Agreement</p>
      <p className="text-white font-bold text-sm">Ready to Sign</p>
    </div>
    <div className="px-5 py-4 space-y-3">
      <p className="text-[10px] text-slate-500 leading-relaxed italic">
        &quot;This agreement is entered into between John & Sarah Smith and Your Firm, for architectural services at 1240 Maple Court...&quot;
      </p>
      <div className="grid grid-cols-2 gap-4 pt-2">
        {["CLIENT", "ARCHITECT"].map(role => (
          <div key={role}>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">{role}</p>
            <div className="border-b-2 border-[#0A1628] pb-5 mb-1" />
            <p className="text-[9px] text-slate-400">Date: ___________</p>
          </div>
        ))}
      </div>
      <div className="bg-[#0A1628]/5 rounded-lg px-3 py-2.5 flex items-center justify-between">
        <span className="text-[10px] text-[#0A1628] font-semibold">Send via DocuSign</span>
        <span className="text-[#C9A84C] text-[10px]">→</span>
      </div>
    </div>
  </div>,
];

// ─── Step-based vertical carousel ────────────────────────────────────────────
function ProposalCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const hold = setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length);
        setAnimating(false);
      }, 500); // transition duration
    }, 3000); // hold duration

    return () => clearTimeout(hold);
  }, [current]);

  return (
    <div className="relative w-full max-w-[280px] mx-auto" style={{ height: "480px" }}>
      {/* Top/bottom fade masks */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f8fafc] to-transparent z-10 pointer-events-none" />

      {/* Slide window */}
      <div className="overflow-hidden rounded-2xl" style={{ height: "480px" }}>
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(-12px)" : "translateY(0)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {SLIDES[current]}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "16px" : "6px",
              height: "6px",
              backgroundColor: i === current ? "#0066cc" : "#cbd5e1",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main landing page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const { setShowAuthModal } = useApp();

  return (
    <div className="bg-[#f8fafc] text-[#1A1A2E] font-sans antialiased min-h-screen">

      {/* ── Header ── */}
      <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#0066cc] rounded flex items-center justify-center border border-[#0052cc]">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900 tracking-tight text-base block">Proposal App</span>
              <span className="text-[10px] text-[#0066cc] font-semibold tracking-wider uppercase block font-mono">Archipelago Showcase</span>
            </div>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="px-5 py-2.5 bg-[#0066cc] hover:bg-[#0052cc] text-white hover:shadow-md text-xs font-semibold rounded-lg transition-all tracking-wide cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-white to-[#f8fafc] pt-16 pb-24 border-b border-[#e2e8f0] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0066cc_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Left column */}
          <div className="space-y-8 lg:col-span-7">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-[#0066cc] rounded-full text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Architectural Proposal Automation
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold tracking-tight text-gray-900 leading-[1.1] text-balance">
              You&apos;re spending hours on proposals<br className="hidden sm:block" />
              <span className="text-[#0066cc]"> that should take minutes.</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Define your scope, calculate real margins, generate a schedule, and deliver a signed proposal —{" "}
              <strong className="text-[#0A1628]">in one session.</strong>
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 bg-[#0066cc] text-white hover:bg-[#0052cc] text-sm font-bold rounded-xl transition-all tracking-wider flex items-center gap-2 border border-transparent shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Start your first proposal
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-sm text-gray-400">
                No spreadsheets. No back-and-forth. No guessing on fees.
              </p>
            </div>
          </div>

          {/* Right column — step-based carousel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end pt-6">
            <ProposalCarousel />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="values-block" className="bg-[#030712] text-white py-20 px-6 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0066cc_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="max-w-xl space-y-5">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Want one for your firm?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              We&apos;ll guide you to build it.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Or customize this one to fit how you actually work. Archipelago works with AEC firms to design, build, and deploy AI tools scoped to your workflows. No dev team required.
            </p>
            <div className="pt-2">
              <button
                onClick={() => alert("Thank you for your interest! In this showcase sandbox, please sign in with any email to test the complete proposal app.")}
                className="px-6 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 text-sm tracking-wide text-center inline-flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
              >
                Talk to Archipelago →
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-slate-800 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 select-none">
          <span>© 2026 Archipelago Showcase. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Settings</a>
            <a href="#" className="hover:text-white transition-colors">AEC Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
