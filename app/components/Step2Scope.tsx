"use client";

import { useState } from "react";
import { useApp } from "../store";
import { ScopeData, Professional, CustomExpense, DEFAULT_PROFESSIONALS } from "../types";

let expenseCounter = 0;
const newExpenseId = () => `exp-${++expenseCounter}-${Date.now()}`;
const newProfessionalId = () => `prof-custom-${++expenseCounter}-${Date.now()}`;
const newCustomServiceId = () => `custom-svc-${++expenseCounter}-${Date.now()}`;

const ROLE_PRESETS = [
  { role: "Principal Architect", internalRate: 86 },
  { role: "Project Architect", internalRate: 51 },
  { role: "Intern Architect", internalRate: 30 },
  { role: "Technologist", internalRate: 25 },
  { role: "Admin", internalRate: 19 },
  { role: "Interior Designer", internalRate: 45 },
  { role: "Landscape Architect", internalRate: 48 },
  { role: "Project Manager", internalRate: 55 },
];

export default function Step2Scope() {
  const { scopeData, setScopeData, setCurrentStep } = useApp();
  const [form, setForm] = useState<ScopeData>(() => ({
    ...scopeData,
    basicServices: scopeData.basicServices.map((s) => ({ ...s })),
    additionalServices: scopeData.additionalServices.map((s) => ({ ...s })),
    professionals: scopeData.professionals.map((p) => ({ ...p })),
    customExpenses: [...(scopeData.customExpenses ?? [])],
  }));
  const [newRole, setNewRole] = useState("");
  const [newRate, setNewRate] = useState<number | "">("");
  const [newServiceLabel, setNewServiceLabel] = useState("");
  const [newServicePct, setNewServicePct] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScopeData(form);
    setCurrentStep(3);
  };

  const toggleBasic = (id: string) => {
    setForm((f) => ({
      ...f,
      basicServices: f.basicServices.map((s) =>
        s.id === id ? { ...s, selected: !s.selected } : s
      ),
    }));
  };

  const toggleAdditional = (id: string) => {
    setForm((f) => ({
      ...f,
      additionalServices: f.additionalServices.map((s) =>
        s.id === id ? { ...s, selected: !s.selected } : s
      ),
    }));
  };

  const toggleProfessional = (id: string) => {
    setForm((f) => ({
      ...f,
      professionals: f.professionals.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p
      ),
    }));
  };

  const removeProfessional = (id: string) => {
    setForm((f) => ({
      ...f,
      professionals: f.professionals.filter((p) => p.id !== id),
    }));
  };

  const addProfessional = () => {
    if (!newRole.trim()) return;
    const rate = Number(newRate) || 40;
    setForm((f) => ({
      ...f,
      professionals: [
        ...f.professionals,
        { id: newProfessionalId(), role: newRole.trim(), internalRate: rate, hours: 80, selected: true },
      ],
    }));
    setNewRole("");
    setNewRate("");
  };

  const addPresetProfessional = (preset: { role: string; internalRate: number }) => {
    const already = form.professionals.find((p) => p.role === preset.role);
    if (already) {
      toggleProfessional(already.id);
      return;
    }
    setForm((f) => ({
      ...f,
      professionals: [
        ...f.professionals,
        { id: newProfessionalId(), role: preset.role, internalRate: preset.internalRate, hours: 80, selected: true },
      ],
    }));
  };

  const addCustomService = () => {
    if (!newServiceLabel.trim()) return;
    const pct = Number(newServicePct) || 1;
    setForm((f) => ({
      ...f,
      additionalServices: [
        ...f.additionalServices,
        { id: newCustomServiceId(), label: newServiceLabel.trim(), percentage: pct, selected: true, isCustom: true },
      ],
    }));
    setNewServiceLabel("");
    setNewServicePct("");
  };

  const removeCustomService = (id: string) => {
    setForm((f) => ({
      ...f,
      additionalServices: f.additionalServices.filter((s) => s.id !== id),
    }));
  };

  const addExpense = () => {
    setForm((f) => ({
      ...f,
      customExpenses: [...f.customExpenses, { id: newExpenseId(), label: "", amount: 0 }],
    }));
  };

  const updateExpense = (id: string, field: keyof CustomExpense, value: string | number) => {
    setForm((f) => ({
      ...f,
      customExpenses: f.customExpenses.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  };

  const removeExpense = (id: string) => {
    setForm((f) => ({ ...f, customExpenses: f.customExpenses.filter((e) => e.id !== id) }));
  };

  const selectedBasicCount = form.basicServices.filter((s) => s.selected).length;
  const selectedAdditionalPct = form.additionalServices
    .filter((s) => s.selected)
    .reduce((sum, s) => sum + s.percentage, 0);
  const selectedProfessionals = form.professionals.filter((p) => p.selected);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── BASIC SERVICES ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
          <div className="bg-[#0A1628] px-8 py-6">
            <h2 className="text-[#C9A84C] text-xl font-semibold tracking-wide uppercase text-sm mb-1">Step 2 of 4</h2>
            <h1 className="text-white text-2xl font-bold">Scope of Services</h1>
            <p className="text-blue-200 text-sm mt-1 opacity-70">Toggle phases on or off to tailor the scope</p>
          </div>

          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <h3 className="font-semibold text-[#0A1628]">Basic Services</h3>
              <span className="ml-auto text-xs text-gray-400">{selectedBasicCount}/{form.basicServices.length} selected</span>
            </div>

            <div className="space-y-3">
              {form.basicServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => toggleBasic(service.id)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-150 ${
                    service.selected
                      ? "border-[#0A1628] bg-[#0A1628]/3"
                      : "border-[#E8E8E8] bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      service.selected ? "bg-[#0A1628]" : "bg-gray-200"
                    }`}>
                      {service.selected ? (
                        <svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#1A1A2E] text-sm">{service.phase}</h4>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{service.phaseWeight}% of fee</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{service.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {service.deliverables.map((d) => (
                          <span key={d} className="text-xs bg-white border border-[#E8E8E8] text-gray-500 px-2 py-0.5 rounded-full">{d}</span>
                        ))}
                      </div>
                      {service.hasSiteVisits && service.selected && (
                        <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <label className="text-xs font-semibold text-[#0A1628]">Site visits included:</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={form.siteVisits}
                            onChange={(e) => setForm((f) => ({ ...f, siteVisits: Number(e.target.value) }))}
                            className="w-16 px-2 py-1 border border-[#E8E8E8] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ADDITIONAL SERVICES ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <h3 className="font-semibold text-[#0A1628]">Additional Services</h3>
              {selectedAdditionalPct > 0 && (
                <span className="ml-auto text-xs bg-[#C9A84C]/20 text-[#0A1628] px-2 py-0.5 rounded-full font-medium">
                  +{selectedAdditionalPct.toFixed(1)}% added
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs mb-4">Each selected service adds to the base fee percentage</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {form.additionalServices.filter((s) => !s.isCustom).map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                    service.selected ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#E8E8E8] hover:border-[#C9A84C]/40"
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                    service.selected ? "bg-[#0A1628] border-[#0A1628]" : "border-gray-300"
                  }`}>
                    {service.selected && (
                      <svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input type="checkbox" checked={service.selected} onChange={() => toggleAdditional(service.id)} className="sr-only" />
                  <span className="text-sm font-medium text-[#1A1A2E] flex-1">{service.label}</span>
                  <span className="text-xs font-semibold text-[#C9A84C] flex-shrink-0">+{service.percentage}%</span>
                </label>
              ))}
            </div>

            {/* Custom additional services */}
            {form.additionalServices.filter((s) => s.isCustom).length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Custom Services</p>
                {form.additionalServices.filter((s) => s.isCustom).map((service) => (
                  <div key={service.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/5">
                    <div className="w-5 h-5 rounded bg-[#0A1628] border-[#0A1628] border-2 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-[#1A1A2E] flex-1">{service.label}</span>
                    <span className="text-xs font-semibold text-[#C9A84C]">+{service.percentage}%</span>
                    <button
                      type="button"
                      onClick={() => removeCustomService(service.id)}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add custom service input */}
            <div className="mt-3 pt-3 border-t border-[#E8E8E8] flex gap-2">
              <input
                type="text"
                placeholder="Custom service description..."
                value={newServiceLabel}
                onChange={(e) => setNewServiceLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomService())}
                className="flex-1 px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
              />
              <div className="relative w-24">
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                <input
                  type="number"
                  placeholder="0.5"
                  min={0.1}
                  step={0.5}
                  value={newServicePct}
                  onChange={(e) => setNewServicePct(e.target.value ? Number(e.target.value) : "")}
                  className="w-full pr-8 pl-2 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
                />
              </div>
              <button
                type="button"
                onClick={addCustomService}
                className="px-4 py-2 bg-[#0A1628] text-[#C9A84C] text-sm font-semibold rounded-lg hover:ring-2 hover:ring-[#C9A84C] transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* ── TEAM / PROFESSIONALS ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <h3 className="font-semibold text-[#0A1628]">Project Team</h3>
              <span className="ml-auto text-xs text-gray-400 italic">Internal only — not shown to client</span>
            </div>
            <p className="text-gray-400 text-xs mb-5">Select professionals involved. Hours are editable in Step 3.</p>

            <div className="space-y-2.5 mb-5">
              {form.professionals.map((prof) => (
                <div
                  key={prof.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    prof.selected ? "border-[#0A1628]/30 bg-[#0A1628]/3" : "border-[#E8E8E8] opacity-55"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleProfessional(prof.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      prof.selected ? "bg-[#0A1628] border-[#0A1628]" : "border-gray-300"
                    }`}
                  >
                    {prof.selected && (
                      <svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E]">{prof.role}</p>
                    <p className="text-xs text-gray-400">CAD ${prof.internalRate}/h internal rate</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 hidden sm:block">{prof.hours}h planned</span>
                    <button
                      type="button"
                      onClick={() => removeProfessional(prof.id)}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors rounded"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick-add presets */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick add</p>
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.filter(
                  (preset) => !form.professionals.some((p) => p.role === preset.role)
                ).map((preset) => (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => addPresetProfessional(preset)}
                    className="text-xs px-3 py-1.5 border border-[#E8E8E8] rounded-full text-gray-600 hover:border-[#C9A84C] hover:text-[#0A1628] transition-all"
                  >
                    + {preset.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom add */}
            <div className="flex gap-2 pt-3 border-t border-[#E8E8E8]">
              <input
                type="text"
                placeholder="Custom role..."
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addProfessional())}
                className="flex-1 px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
              />
              <div className="relative w-28">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Rate/h"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value ? Number(e.target.value) : "")}
                  className="w-full pl-5 pr-2 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
                />
              </div>
              <button
                type="button"
                onClick={addProfessional}
                className="px-4 py-2 bg-[#0A1628] text-[#C9A84C] text-sm font-semibold rounded-lg hover:ring-2 hover:ring-[#C9A84C] transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* ── DIRECT COSTS & CUSTOM EXPENSES ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <h3 className="font-semibold text-[#0A1628]">Expenses &amp; Direct Costs</h3>
            </div>

            {/* Fixed costs */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Travel / Mileage (CAD $)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={form.travelMileage || ""}
                    onChange={(e) => setForm((f) => ({ ...f, travelMileage: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2.5 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Printing &amp; Plotting (CAD $)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={form.printingPlotting || ""}
                    onChange={(e) => setForm((f) => ({ ...f, printingPlotting: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2.5 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
                  />
                </div>
              </div>
            </div>

            {/* Custom expenses */}
            {form.customExpenses.length > 0 && (
              <div className="space-y-2.5 mb-4">
                {form.customExpenses.map((exp) => (
                  <div key={exp.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Expense description..."
                      value={exp.label}
                      onChange={(e) => updateExpense(exp.id, "label", e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
                    />
                    <div className="relative w-32">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={exp.amount || ""}
                        onChange={(e) => updateExpense(exp.id, "amount", Number(e.target.value))}
                        placeholder="0"
                        className="w-full pl-5 pr-2 py-2 border border-[#E8E8E8] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A1A2E]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExpense(exp.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addExpense}
              className="flex items-center gap-2 text-sm text-[#0A1628] font-medium hover:text-[#C9A84C] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add expense line
            </button>
          </div>
        </div>

        {/* ── SCHEDULE / TIMELINE ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <h3 className="font-semibold text-[#0A1628]">Project Schedule</h3>
              <span className="ml-auto text-xs text-gray-400">
                {form.basicServices
                  .filter((s) => s.selected && s.weeks !== null)
                  .reduce((sum, s) => sum + (s.weeks ?? 0), 0)}{" "}
                design weeks total
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-5">
              Set the estimated duration for each selected phase — this builds the Gantt chart in the proposal.
            </p>
            <div className="space-y-3">
              {form.basicServices.filter((s) => s.selected).map((service) => (
                <div key={service.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E] truncate">{service.phase}</p>
                    <p className="text-xs text-gray-400">{service.phaseWeight}% of fee</p>
                  </div>
                  {service.weeks === null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 italic">During construction</span>
                      <span className="text-xs bg-[#0A1628]/10 text-[#0A1628] px-2 py-0.5 rounded-full">Open-ended</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={52}
                        value={service.weeks}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1);
                          setForm((f) => ({
                            ...f,
                            basicServices: f.basicServices.map((s) =>
                              s.id === service.id ? { ...s, weeks: val } : s
                            ),
                          }));
                        }}
                        className="w-16 text-center border border-[#E8E8E8] rounded-lg px-2 py-1.5 text-sm font-semibold text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                      />
                      <span className="text-xs text-gray-400 w-10">
                        {service.weeks === 1 ? "week" : "weeks"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mini Gantt preview */}
            {(() => {
              const phases = form.basicServices.filter((s) => s.selected && s.weeks !== null);
              const caPhase = form.basicServices.find((s) => s.selected && s.hasSiteVisits);
              const totalDesignWeeks = phases.reduce((sum, s) => sum + (s.weeks ?? 0), 0);
              if (totalDesignWeeks === 0) return null;
              const caDisplayWeeks = Math.round(totalDesignWeeks * 0.5);
              const totalDisplay = totalDesignWeeks + (caPhase ? caDisplayWeeks : 0);
              let cursor = 0;
              const COLORS = ["#0A1628","#1a2d4a","#1e3a5f","#2c4a70","#C9A84C","#b8933e"];
              return (
                <div className="mt-6 pt-4 border-t border-[#E8E8E8]">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Timeline Preview</p>
                  <div className="space-y-1.5">
                    {phases.map((p, i) => {
                      const w = p.weeks ?? 0;
                      const leftPct = (cursor / totalDisplay) * 100;
                      const widthPct = (w / totalDisplay) * 100;
                      cursor += w;
                      return (
                        <div key={p.id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-32 truncate shrink-0">{p.phase.split("—")[0].trim()}</span>
                          <div className="flex-1 relative h-5 bg-gray-100 rounded overflow-hidden">
                            <div
                              className="absolute h-full rounded flex items-center justify-center"
                              style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                            >
                              <span className="text-white text-[9px] font-bold px-1 truncate">{p.weeks}w</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {caPhase && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-32 truncate shrink-0">CA</span>
                        <div className="flex-1 relative h-5 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="absolute h-full rounded flex items-center justify-center"
                            style={{ left: `${(cursor / totalDisplay) * 100}%`, width: `${(caDisplayWeeks / totalDisplay) * 100}%`, backgroundColor: "#0A1628", borderRight: "3px dashed #C9A84C" }}
                          >
                            <span className="text-[#C9A84C] text-[9px] font-bold px-1">→ construction</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex-1 py-4 border-2 border-[#0A1628] text-[#0A1628] font-semibold rounded-lg hover:bg-[#0A1628] hover:text-white transition-all duration-200 text-sm tracking-wide uppercase"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="flex-grow py-4 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-lg hover:ring-2 hover:ring-[#C9A84C] transition-all duration-200 text-sm tracking-wide uppercase"
          >
            Continue to Fee Calculation →
          </button>
        </div>
      </form>
    </div>
  );
}
