"use client";

import { useApp } from "./store";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import FirmSetupPage from "./components/FirmSetupPage";
import ProgressBar from "./components/ProgressBar";
import Step1ProjectInfo from "./components/Step1ProjectInfo";
import Step2Scope from "./components/Step2Scope";
import Step3Fee from "./components/Step3Fee";
import Step4Output from "./components/Step4Output";

export default function Home() {
  const { isLoggedIn, showAuthModal, setShowAuthModal, firmSetupDone, userEmail, logout, currentStep } = useApp();

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage />
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </>
    );
  }

  if (!firmSetupDone) {
    return <FirmSetupPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-[#0A1628] text-white py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#C9A84C] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide">Otávio Pires Chaves</p>
              <p className="text-[#C9A84C] text-xs">Architect · Vancouver, BC</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-xs hidden sm:block">Fee Proposal Generator</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="hidden sm:inline">{userEmail}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={4} />

      <main className="pb-16">
        {currentStep === 1 && <Step1ProjectInfo />}
        {currentStep === 2 && <Step2Scope />}
        {currentStep === 3 && <Step3Fee />}
        {currentStep === 4 && <Step4Output />}
      </main>
    </div>
  );
}
