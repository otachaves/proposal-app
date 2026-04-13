"use client";

import { useState } from "react";
import { useApp } from "../store";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);

export default function Step4Output() {
  const { projectInfo, scopeData, feeData, setCurrentStep } = useApp();
  const [showMessages, setShowMessages] = useState(false);
  const [copied, setCopied] = useState<"email" | "whatsapp" | null>(null);

  const fullAddress = [projectInfo.projectAddress, projectInfo.city, projectInfo.province].filter(Boolean).join(", ");
  const emailSubject = `Proposal Ready - ${fullAddress}`;
  const emailBody = `Hi ${projectInfo.clientName},

I've completed the fee proposal for your project at ${fullAddress}.

I'd love to walk you through it in person — it takes about 30 minutes and I find it leads to a much better outcome for both of us.

Are you available for a quick call this week to find a time?

Looking forward to it.
Otávio`;

  const whatsappBody = `Hi ${projectInfo.clientName}, your proposal for ${fullAddress} is ready. I'd love to present it to you in person — usually takes 30 min and makes a big difference. Can we find a time this week?`;

  const copyToClipboard = async (text: string, type: "email" | "whatsapp") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const openProposal = () => {
    // Store proposal data in localStorage for the proposal page
    const proposalData = {
      projectInfo,
      scopeData,
      feeData,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("proposalData", JSON.stringify(proposalData));
    window.open("/proposal", "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E8E8] overflow-hidden">
        <div className="bg-[#0A1628] px-8 py-6">
          <h2 className="text-[#C9A84C] text-xl font-semibold tracking-wide uppercase text-sm mb-1">
            Step 4 of 4
          </h2>
          <h1 className="text-white text-2xl font-bold">Ready to Send</h1>
          <p className="text-blue-200 text-sm mt-1 opacity-70">
            Schedule a presentation or view the final proposal
          </p>
        </div>

        {/* Summary */}
        <div className="px-8 py-6 border-b border-[#E8E8E8]">
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

        {/* Action Buttons */}
        <div className="px-8 py-6 space-y-4">
          {/* Schedule Presentation */}
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="w-full py-4 bg-[#0A1628] text-[#C9A84C] font-semibold rounded-xl hover:ring-2 hover:ring-[#C9A84C] transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Schedule a Presentation
          </button>

          {/* View Proposal */}
          <button
            onClick={openProposal}
            className="w-full py-4 border-2 border-[#0A1628] text-[#0A1628] font-semibold rounded-xl hover:bg-[#0A1628] hover:text-white transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-2"
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
            <h3 className="text-sm font-semibold text-[#0A1628] uppercase tracking-wide mb-6">
              Pre-written Messages
            </h3>

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
                  className="text-xs px-3 py-1.5 bg-[#0A1628] text-[#C9A84C] rounded-lg hover:ring-1 hover:ring-[#C9A84C] transition-all"
                >
                  {copied === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-[#E8E8E8]">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Subject: {emailSubject}
                </p>
                <pre className="text-sm text-[#1A1A2E] whitespace-pre-wrap font-sans leading-relaxed">
                  {emailBody}
                </pre>
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
                  className="text-xs px-3 py-1.5 bg-[#0A1628] text-[#C9A84C] rounded-lg hover:ring-1 hover:ring-[#C9A84C] transition-all"
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
        className="w-full py-4 border-2 border-[#0A1628] text-[#0A1628] font-semibold rounded-lg hover:bg-[#0A1628] hover:text-white transition-all duration-200 text-sm tracking-wide uppercase"
      >
        ← Back to Fee Calculation
      </button>
    </div>
  );
}
