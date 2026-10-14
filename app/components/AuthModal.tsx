"use client";

import { useState } from "react";
import { useApp } from "../store";

interface AuthModalProps {
  onClose?: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., name@example.com).");
      return;
    }

    setIsLoading(true);

    // Fire notification — intentionally not awaited, never blocks auth flow
    fetch("/api/notify-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});

    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E8E8E8] overflow-hidden flex flex-col">
        <div className="bg-[#0A1628] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-[#0066cc] rounded flex items-center justify-center">
              <span className="text-[#0066cc] text-[10px] font-bold">P</span>
            </div>
            <span className="text-white text-sm font-semibold tracking-wide uppercase">Proposal App Portal</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-lg font-medium p-1 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        <div className="px-8 py-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#1A1A2E] text-left">Sign in</h2>
                <p className="text-gray-500 text-sm leading-relaxed text-left">
                  Enter your email to receive a magic sign-in link. No password needed.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 text-left">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066cc] transition ${
                    error ? "border-red-400 focus:ring-red-300" : "border-[#E8E8E8]"
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-500 flex items-center gap-1 text-left">
                    ⚠️ {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#0066cc] text-white font-semibold rounded-lg hover:bg-[#0052cc] hover:ring-2 hover:ring-[#0060df] transition-all flex items-center justify-center gap-2 text-sm tracking-wide uppercase disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    Sending magic link...
                  </span>
                ) : (
                  "Send magic link"
                )}
              </button>

              <div className="text-xs text-center text-gray-400 leading-relaxed pt-2 border-t border-gray-100">
                Check your spam folder if the email doesn&apos;t arrive within a minute.
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 text-2xl">
                  ✉️
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E]">Check your inbox!</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We sent a magic sign-in link to:<br />
                  <strong className="text-[#0A1628]">{email}</strong>
                </p>
              </div>

              <div className="bg-amber-50/75 border border-amber-100 rounded-lg p-3.5 text-xs text-amber-800 leading-relaxed text-left">
                🛡️ <strong>Note on spam folders:</strong> If the email doesn&apos;t arrive within a minute, remember to check your spam/junk folder.
              </div>

              <div className="border border-dashed border-[#0066cc]/50 rounded-xl p-4 bg-[#eff6ff]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#0066cc] uppercase tracking-wider">Demo Sandbox Inbox</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066cc] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066cc]"></span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-gray-700 text-left">Simulate incoming email:</h4>
                <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm text-xs space-y-2">
                  <div className="flex justify-between border-b border-gray-50 pb-1 text-[10px] text-gray-400">
                    <span>From: noreply@proposalapp.co</span>
                    <span>Just now</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-left">🪄 Your Magic Sign-in Link</p>
                  <p className="text-[11px] text-gray-500 text-left">Click the button below to sign in instantly.</p>
                  <button
                    onClick={() => login(email)}
                    className="w-full mt-1.5 py-2 px-3 bg-blue-50 text-[#0066cc] hover:bg-[#0066cc] hover:text-white font-bold rounded text-center transition-all duration-200 cursor-pointer"
                  >
                    Log in instantly →
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={() => setSent(false)}
                  className="text-gray-500 hover:text-gray-800 underline cursor-pointer"
                >
                  Change email
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-[#0A1628] font-semibold hover:underline cursor-pointer"
                  >
                    Back to Home
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
