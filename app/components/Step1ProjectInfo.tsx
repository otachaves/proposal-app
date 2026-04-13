"use client";

import { useState } from "react";
import { useApp } from "../store";
import { ProjectInfo } from "../types";

export default function Step1ProjectInfo() {
  const { projectInfo, setProjectInfo, setCurrentStep } = useApp();
  const [form, setForm] = useState<ProjectInfo>(projectInfo);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInfo, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof ProjectInfo, string>> = {};
    if (!form.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!form.projectAddress.trim()) newErrors.projectAddress = "Project address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.constructionCost || form.constructionCost <= 0)
      newErrors.constructionCost = "Enter a valid construction cost";
    if (!form.area || form.area <= 0) newErrors.area = "Enter a valid area";
    if (!form.floors || form.floors < 1) newErrors.floors = "Enter number of floors";
    if (!form.description.trim()) newErrors.description = "Project description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setProjectInfo(form);
      setCurrentStep(2);
    }
  };

  const field = (key: keyof ProjectInfo) => ({
    value: form[key] as string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val =
        key === "constructionCost" || key === "area" || key === "floors"
          ? Number(e.target.value)
          : e.target.value;
      setForm((f) => ({ ...f, [key]: val }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="bg-[#0A1628] px-8 py-6">
          <h2 className="text-[#C9A84C] text-xl font-semibold tracking-wide uppercase text-sm mb-1">
            Step 1 of 4
          </h2>
          <h1 className="text-white text-2xl font-bold">Project Information</h1>
          <p className="text-blue-200 text-sm mt-1 opacity-70">
            Basic details about the project and client
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {/* Client Name */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
              Client Name
            </label>
            <input
              type="text"
              placeholder="e.g. John & Sarah Smith"
              {...field("clientName")}
              className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                errors.clientName ? "border-red-400" : "border-[#E8E8E8]"
              }`}
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Project Address */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
              Project Address (Street)
            </label>
            <input
              type="text"
              placeholder="e.g. 1234 Maple Street"
              {...field("projectAddress")}
              className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                errors.projectAddress ? "border-red-400" : "border-[#E8E8E8]"
              }`}
            />
            {errors.projectAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.projectAddress}</p>
            )}
          </div>

          {/* City + Province/State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
                City
              </label>
              <input
                type="text"
                placeholder="e.g. West Vancouver"
                {...field("city")}
                className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                  errors.city ? "border-red-400" : "border-[#E8E8E8]"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
                Province / State
              </label>
              <input
                type="text"
                placeholder="e.g. BC"
                {...field("province")}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E8E8] text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition"
              />
            </div>
          </div>

          {/* Construction Cost */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
              Estimated Construction Cost (CAD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="0"
                step="10000"
                placeholder="1,500,000"
                value={form.constructionCost || ""}
                onChange={(e) => {
                  setForm((f) => ({ ...f, constructionCost: Number(e.target.value) }));
                  if (errors.constructionCost)
                    setErrors((er) => ({ ...er, constructionCost: undefined }));
                }}
                className={`w-full pl-8 pr-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                  errors.constructionCost ? "border-red-400" : "border-[#E8E8E8]"
                }`}
              />
            </div>
            {errors.constructionCost && (
              <p className="text-red-500 text-xs mt-1">{errors.constructionCost}</p>
            )}
          </div>

          {/* Area and Floors side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
                Approximate Area (sq ft)
              </label>
              <input
                type="number"
                min="0"
                placeholder="4,500"
                value={form.area || ""}
                onChange={(e) => {
                  setForm((f) => ({ ...f, area: Number(e.target.value) }));
                  if (errors.area) setErrors((er) => ({ ...er, area: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                  errors.area ? "border-red-400" : "border-[#E8E8E8]"
                }`}
              />
              {errors.area && (
                <p className="text-red-500 text-xs mt-1">{errors.area}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
                Number of Floors
              </label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="2"
                value={form.floors || ""}
                onChange={(e) => {
                  setForm((f) => ({ ...f, floors: Number(e.target.value) }));
                  if (errors.floors) setErrors((er) => ({ ...er, floors: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                  errors.floors ? "border-red-400" : "border-[#E8E8E8]"
                }`}
              />
              {errors.floors && (
                <p className="text-red-500 text-xs mt-1">{errors.floors}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
              Project Description
            </label>
            <p className="text-gray-400 text-xs mb-2">
              This will appear on the proposal cover and scope section
            </p>
            <textarea
              rows={4}
              placeholder="e.g. New custom single-family home with 4 bedrooms, open-concept main floor, and a detached garage. The design emphasizes natural light and blends contemporary West Coast architecture with sustainable materials."
              value={form.description}
              onChange={(e) => {
                setForm((f) => ({ ...f, description: e.target.value }));
                if (errors.description)
                  setErrors((er) => ({ ...er, description: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition resize-none ${
                errors.description ? "border-red-400" : "border-[#E8E8E8]"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-lg hover:bg-[#0A1628]/90 hover:ring-2 hover:ring-[#C9A84C] transition-all duration-200 text-sm tracking-wide uppercase"
          >
            Continue to Scope Selection →
          </button>
        </form>
      </div>
    </div>
  );
}
