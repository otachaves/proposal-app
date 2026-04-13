"use client";

import { useEffect, useState, useCallback } from "react";
import { useApp } from "../store";
import { FeeData, ProfessionalCost, OVERHEAD_RATE } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

const pct = (n: number) => `${n.toFixed(1)}%`;

export default function Step3Fee() {
  const { projectInfo, scopeData, feeData, setFeeData, setCurrentStep } = useApp();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [localFee, setLocalFee] = useState<FeeData | null>(null);

  // Editable base percentage — starts at 10, but user can change it
  const [basePercentage, setBasePercentage] = useState<number>(feeData?.basePercentage ?? 10);

  // Local copy of professional hours for editing without mutating global scope
  const [profHours, setProfHours] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    scopeData.professionals.forEach((p) => { map[p.id] = p.hours; });
    return map;
  });

  const calculate = useCallback((): FeeData => {
    const additionalPct = scopeData.additionalServices
      .filter((s) => s.selected)
      .reduce((sum, s) => sum + s.percentage, 0);

    const totalPercentage = basePercentage + additionalPct;
    const baseFee = projectInfo.constructionCost * (basePercentage / 100);
    const additionalServicesFee = projectInfo.constructionCost * (additionalPct / 100);

    const customExpensesTotal = scopeData.customExpenses.reduce((sum, e) => sum + e.amount, 0);
    const directCosts = scopeData.travelMileage + scopeData.printingPlotting + customExpensesTotal;
    const totalFee = baseFee + additionalServicesFee + directCosts;

    // Phase breakdown — normalize selected phases so they sum to 100% of architect fee
    const selectedBasic = scopeData.basicServices.filter((s) => s.selected);
    const weightSum = selectedBasic.reduce((sum, s) => sum + s.phaseWeight, 0) || 1;
    const architectFee = baseFee + additionalServicesFee;
    const phaseBreakdown = selectedBasic.map((s) => ({
      phase: s.phase,
      percentage: Math.round((s.phaseWeight / weightSum) * 100),
      amount: architectFee * (s.phaseWeight / weightSum),
    }));

    // Professional costs
    const professionalCosts: ProfessionalCost[] = scopeData.professionals
      .filter((p) => p.selected)
      .map((p) => {
        const hours = profHours[p.id] ?? p.hours;
        const laborCost = hours * p.internalRate;
        const withOverhead = laborCost * (1 + OVERHEAD_RATE);
        return {
          id: p.id,
          role: p.role,
          hours,
          rate: p.internalRate,
          laborCost,
          withOverhead,
        };
      });

    const totalLaborCost = professionalCosts.reduce((sum, c) => sum + c.withOverhead, 0);
    const totalOverhead = professionalCosts.reduce((sum, c) => sum + (c.withOverhead - c.laborCost), 0);
    const expectedProfit = totalFee - totalLaborCost - directCosts;
    const profitMarginPct = totalFee > 0 ? (expectedProfit / totalFee) * 100 : 0;

    return {
      basePercentage,
      totalPercentage,
      baseFee,
      additionalServicesFee,
      directCosts,
      totalFee,
      phaseBreakdown,
      professionalCosts,
      totalLaborCost,
      totalOverhead,
      expectedProfit,
      profitMarginPct,
      aiInsight: feeData?.aiInsight ?? null,
    };
  }, [projectInfo, scopeData, feeData?.aiInsight, basePercentage, profHours]);

  useEffect(() => {
    const fee = calculate();
    setLocalFee(fee);
    setFeeData(fee);
  }, [calculate, setFeeData]);

  const fetchAiInsight = async () => {
    if (!localFee) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const selectedServices = scopeData.additionalServices
        .filter((s) => s.selected)
        .map((s) => s.label);

      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectType: "Residential New Construction",
          constructionCost: projectInfo.constructionCost,
          totalFee: localFee.totalFee,
          feePercentage: localFee.totalPercentage,
          additionalServices: selectedServices,
          city: projectInfo.city,
          province: projectInfo.province,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch AI insight");
      const data = await res.json();
      const updated = { ...localFee, aiInsight: data.insight };
      setLocalFee(updated);
      setFeeData(updated);
    } catch {
      setAiError("Could not load AI insight. Check your API key.");
    } finally {
      setAiLoading(false);
    }
  };

  const updateHours = (id: string, value: number) => {
    setProfHours((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const fee = localFee;
  if (!fee) return null;

  const installmentAmount = fee.totalFee / 6;
  const installmentLabels = ["Upon signing", "Day 30", "Day 60", "Day 90", "Day 120", "Day 150"];
  const profitColor = fee.expectedProfit >= 0 ? "text-emerald-600" : "text-red-500";
  const profitBg = fee.expectedProfit >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="bg-[#0A1628] px-8 py-6">
          <h2 className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-1">
            Step 3 of 4
          </h2>
          <h1 className="text-white text-2xl font-bold">Fee Calculation</h1>
          <p className="text-blue-200 text-sm mt-1 opacity-70">
            Real-time fee breakdown with AI competitive analysis
          </p>
        </div>

        {/* Editable base % + total hero */}
        <div className="px-8 py-8 border-b border-[#E8E8E8]">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Base Fee Rate</p>
              <div className="flex items-center gap-1 justify-center">
                <input
                  type="number"
                  min={1}
                  max={30}
                  step={0.5}
                  value={basePercentage}
                  onChange={(e) => setBasePercentage(parseFloat(e.target.value) || 10)}
                  className="w-20 text-center text-2xl font-bold text-[#0A1628] border-b-2 border-[#C9A84C] bg-transparent focus:outline-none"
                />
                <span className="text-xl font-bold text-[#0A1628]">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">of construction cost</p>
            </div>
            <div className="text-gray-300 text-2xl">→</div>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Proposed Fee</p>
              <p className="text-3xl font-bold text-[#0A1628]">{fmt(fee.totalFee)}</p>
              <p className="text-[#C9A84C] text-sm font-semibold mt-0.5">
                {pct(fee.totalPercentage)} total
              </p>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs">
            Construction cost: {fmt(projectInfo.constructionCost)}
          </p>
        </div>

        {/* Fee Breakdown */}
        <div className="px-8 py-6">
          <h3 className="text-xs font-semibold text-[#0A1628] uppercase tracking-widest mb-4">
            Fee Breakdown
          </h3>
          <div className="space-y-0">
            <div className="flex justify-between items-center py-2.5 border-b border-[#E8E8E8]">
              <span className="text-sm text-gray-600">
                Base Architectural Fee ({pct(basePercentage)})
              </span>
              <span className="font-semibold text-[#1A1A2E]">{fmt(fee.baseFee)}</span>
            </div>
            {fee.additionalServicesFee > 0 && (
              <div className="flex justify-between items-center py-2.5 border-b border-[#E8E8E8]">
                <span className="text-sm text-gray-600">
                  Additional Services (+{pct(fee.totalPercentage - fee.basePercentage)})
                </span>
                <span className="font-semibold text-[#1A1A2E]">{fmt(fee.additionalServicesFee)}</span>
              </div>
            )}
            {fee.directCosts > 0 && (
              <div className="flex justify-between items-center py-2.5 border-b border-[#E8E8E8]">
                <span className="text-sm text-gray-600">Direct Costs &amp; Expenses</span>
                <span className="font-semibold text-[#1A1A2E]">{fmt(fee.directCosts)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3">
              <span className="font-bold text-[#0A1628]">Total</span>
              <span className="font-bold text-[#0A1628] text-lg">{fmt(fee.totalFee)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Cost Analysis — professionals */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="px-8 py-5 border-b border-[#E8E8E8] flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            Internal Only — Not Shown to Client
          </span>
          <h3 className="text-xs font-semibold text-[#0A1628] uppercase tracking-widest">
            Project Team — Labor Costs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-right font-semibold">Rate ($/h)</th>
                <th className="px-4 py-3 text-right font-semibold">Hours</th>
                <th className="px-4 py-3 text-right font-semibold">Labor</th>
                <th className="px-4 py-3 text-right font-semibold">+45% OH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {fee.professionalCosts.map((pc) => (
                <tr key={pc.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 text-[#0A1628] font-medium">{pc.role}</td>
                  <td className="px-4 py-3 text-right text-gray-600">${pc.rate}</td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={profHours[pc.id] ?? pc.hours}
                      onChange={(e) => updateHours(pc.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-right border border-[#E8E8E8] rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white"
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{fmt(pc.laborCost)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#0A1628]">{fmt(pc.withOverhead)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#0A1628]/5 border-t-2 border-[#0A1628]/10">
                <td className="px-6 py-3 font-bold text-[#0A1628]" colSpan={3}>Total Labor</td>
                <td className="px-4 py-3 text-right text-gray-500 text-xs">
                  OH: {fmt(fee.totalOverhead)}
                </td>
                <td className="px-4 py-3 text-right font-bold text-[#0A1628]">
                  {fmt(fee.totalLaborCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-8 py-3 bg-gray-50 border-t border-[#E8E8E8]">
          <p className="text-xs text-gray-400 italic">
            Overhead rate: 45% applied on raw labor costs (benefits, insurance, office, etc.)
          </p>
        </div>
      </div>

      {/* Profit Analysis */}
      <div className={`bg-white rounded-2xl shadow-lg border overflow-hidden ${profitBg}`}>
        <div className="px-8 py-5 border-b border-[#E8E8E8]/60 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            Internal Only
          </span>
          <h3 className="text-xs font-semibold text-[#0A1628] uppercase tracking-widest">
            Expected Profit Breakdown
          </h3>
        </div>
        <div className="px-8 py-6 space-y-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Proposed Fee</span>
            <span className="font-semibold text-[#0A1628]">{fmt(fee.totalFee)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">− Labor Costs (with 45% OH)</span>
            <span className="font-semibold text-red-500">−{fmt(fee.totalLaborCost)}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-[#E8E8E8] pb-2.5">
            <span className="text-gray-600">− Direct Costs &amp; Expenses</span>
            <span className="font-semibold text-red-500">−{fmt(fee.directCosts)}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="font-bold text-[#0A1628]">Expected Profit</span>
            <div className="text-right">
              <span className={`text-xl font-bold ${profitColor}`}>{fmt(fee.expectedProfit)}</span>
              <span className={`ml-2 text-sm font-semibold ${profitColor}`}>
                ({pct(fee.profitMarginPct)})
              </span>
            </div>
          </div>
          {fee.expectedProfit < 0 && (
            <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-200">
              <p className="text-xs text-red-700 font-medium">
                ⚠ Projected loss — consider increasing the base fee percentage or reducing hours.
              </p>
            </div>
          )}
          {fee.profitMarginPct >= 0 && fee.profitMarginPct < 15 && fee.expectedProfit >= 0 && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700 font-medium">
                ⚡ Margin below 15% — consider optimizing hours or increasing the base rate.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Phase Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="px-8 py-6">
          <h3 className="text-xs font-semibold text-[#0A1628] uppercase tracking-widest mb-4">
            Fee by Phase (AIA Structure)
          </h3>
          <div className="space-y-3">
            {fee.phaseBreakdown.map((phase) => (
              <div key={phase.phase}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700 truncate mr-2">{phase.phase}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400">{phase.percentage}%</span>
                    <span className="text-sm font-semibold text-[#1A1A2E] w-24 text-right">
                      {fmt(phase.amount)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] rounded-full"
                    style={{ width: `${phase.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Schedule */}
          <div className="mt-6 pt-6 border-t border-[#E8E8E8]">
            <h3 className="text-xs font-semibold text-[#0A1628] uppercase tracking-widest mb-4">
              Payment Schedule (6 equal installments)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {installmentLabels.map((label, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-[#0A1628]">{fmt(installmentAmount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.346.346a5 5 0 01-1.395 3.6v1.154a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1.154a5 5 0 01-1.395-3.6l-.346-.346z"
                />
              </svg>
              <h3 className="text-xs font-semibold text-[#0A1628] uppercase tracking-widest">
                AI Market Insight
              </h3>
            </div>
            <button
              onClick={fetchAiInsight}
              disabled={aiLoading}
              className="px-4 py-2 bg-[#0A1628] text-[#C9A84C] text-xs font-semibold rounded-lg hover:ring-2 hover:ring-[#C9A84C] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiLoading ? "Analyzing..." : fee.aiInsight ? "Refresh" : "Analyze Fee"}
            </button>
          </div>

          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
              {aiError}
            </div>
          )}

          {aiLoading && (
            <div className="flex items-center gap-3 py-4">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">Claude is analyzing your fee...</span>
            </div>
          )}

          {fee.aiInsight && !aiLoading && (
            <div className="bg-[#0A1628]/5 border border-[#C9A84C]/30 rounded-xl p-5">
              <p className="text-sm text-[#1A1A2E] leading-relaxed">{fee.aiInsight}</p>
            </div>
          )}

          {!fee.aiInsight && !aiLoading && !aiError && (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm">
                Click &ldquo;Analyze Fee&rdquo; to get a competitive market assessment from Claude AI
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="flex-1 py-4 border-2 border-[#0A1628] text-[#0A1628] font-semibold rounded-lg hover:bg-[#0A1628] hover:text-white transition-all duration-200 text-sm tracking-wide uppercase"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          className="flex-grow py-4 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-lg hover:bg-[#0A1628]/90 hover:ring-2 hover:ring-[#C9A84C] transition-all duration-200 text-sm tracking-wide uppercase"
        >
          Continue to Output →
        </button>
      </div>
    </div>
  );
}
