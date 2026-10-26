"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function ForgotPasswordPage() {

  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Enter OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      const res = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus({
          loading: false,
          error: json.message || "Failed to send OTP. Please check your email and try again.",
          success: "",
        });
        return;
      }

      setStatus({
        loading: false,
        error: "",
        success: "Verification code sent! Please check your email inbox.",
      });
      setStep(2);
    } catch (err) {
      setStatus({
        loading: false,
        error: "Server connection failed. Please ensure the backend is running.",
        success: "",
      });
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    if (newPassword.length < 6) {
      setStatus({
        loading: false,
        error: "Password must be at least 6 characters long.",
        success: "",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        loading: false,
        error: "New password and confirmation password do not match.",
        success: "",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
          confirmPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus({
          loading: false,
          error: json.message || "Failed to reset password. Please check your OTP.",
          success: "",
        });
        return;
      }

      setStatus({
        loading: false,
        error: "",
        success: "Password reset successful! Redirecting to login...",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setStatus({
        loading: false,
        error: "Server connection failed. Please ensure the backend is running.",
        success: "",
      });
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl shadow-slate-200/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            {step === 1
              ? "Enter your registered email address and we'll send a 4-digit verification OTP."
              : `Enter the 4-digit code sent to ${email} and choose your new password.`}
          </p>
        </div>

        {/* Status Alerts */}
        {status.error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{status.error}</span>
          </div>
        )}

        {status.success && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{status.success}</span>
          </div>
        )}

        {/* STEP 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {status.loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send Verification OTP
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP & New Password Form */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">4-Digit OTP Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  className="w-full pl-10 pr-4 py-2.5 text-sm tracking-widest font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-center"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Check your inbox or spam folder for the code.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {status.loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setStatus({ loading: false, error: "", success: "" });
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-indigo-600 transition"
            >
              Didn&apos;t receive code? Change email or resend
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
