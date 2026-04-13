"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, label: "Project Info" },
  { number: 2, label: "Scope" },
  { number: 3, label: "Fee & AI" },
  { number: 4, label: "Output" },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full bg-white border-b border-[#E8E8E8] sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step.number < currentStep
                      ? "bg-[#0A1628] text-[#C9A84C]"
                      : step.number === currentStep
                      ? "bg-[#C9A84C] text-[#0A1628]"
                      : "bg-[#E8E8E8] text-gray-400"
                  }`}
                >
                  {step.number < currentStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium hidden sm:block ${
                    step.number === currentStep
                      ? "text-[#C9A84C]"
                      : step.number < currentStep
                      ? "text-[#0A1628]"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    step.number < currentStep ? "bg-[#0A1628]" : "bg-[#E8E8E8]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
