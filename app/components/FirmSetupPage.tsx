"use client";

import { useState } from "react";
import { useApp } from "../store";

export default function FirmSetupPage() {
  const { userEmail, setFirmName, setFirmWebsite, setFirmSetupDone, logout } = useApp();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!name.trim()) {
      setError("Please enter your firm or practice name.");
      return;
    }
    setFirmName(name.trim());

    // Normalise website URL and kick off background AI fetch
    const raw = website.trim();
    if (raw) {
      const url = raw.startsWith("http") ? raw : `https://${raw}`;
      setFirmWebsite(url); // triggers background fetch in provider
    }

    setFirmSetupDone(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo bar */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-[#0066cc] rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <span className="font-bold text-gray-900 text-base block">Proposal App</span>
            <span className="text-[10px] text-[#0066cc] font-semibold tracking-wider uppercase block">Archipelago Showcase</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[#E8E8E8] overflow-hidden">
          {/* Header */}
          <div className="bg-[#0A1628] px-8 py-7 text-center">
            <div className="w-14 h-14 bg-[#0066cc]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h1 className="text-white text-xl font-bold mb-1">Welcome to Proposal App!</h1>
            <p className="text-blue-300 text-sm opacity-80">Signed in as {userEmail}</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-5">
            <div className="space-y-1.5 text-center">
              <h2 className="text-lg font-bold text-[#0A1628]">Quick setup</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tell us about your firm so every proposal looks like yours from day one.
              </p>
            </div>

            {/* Firm name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Firm / Practice Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                placeholder="e.g. Mitchell Architecture"
                className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition text-sm ${
                  error ? "border-red-400" : "border-[#E8E8E8]"
                }`}
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">⚠️ {error}</p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                Firm Website
                <span className="ml-2 text-[10px] normal-case font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Optional — used to pull your firm info with AI</span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                placeholder="e.g. mitchellarchitecture.com"
                className="w-full px-4 py-3 rounded-lg border border-[#E8E8E8] text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition text-sm"
              />
              {website.trim() && (
                <p className="text-xs text-blue-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  AI will extract your firm description and team while you work — ready by Step 4.
                </p>
              )}
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3.5 bg-[#0066cc] text-white font-semibold rounded-lg hover:bg-[#0052cc] transition-all text-sm tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Proposal Builder
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>

            <div className="pt-2 border-t border-gray-100 flex justify-center">
              <button
                onClick={logout}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
