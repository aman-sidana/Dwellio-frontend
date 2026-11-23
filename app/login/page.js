"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Building2, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { setToken } from "../../lib/auth";

function LoginFormContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: false });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus({
          loading: false,
          error: json.message || "Invalid email or password. Please try again.",
          success: false,
        });
        return;
      }

      if (json.token) {
        setToken(json.token);
      }

      setStatus({ loading: false, error: "", success: true });
      setTimeout(() => {
        let destination = redirectUrl;
        if (redirectUrl === "/dashboard" && json.data?.role === "super_admin") {
          destination = "/admin";
        } else if (redirectUrl === "/dashboard" && json.data?.role === "user") {
          destination = "/properties";
        }
        window.location.href = destination;
      }, 800);
    } catch {
      setStatus({
        loading: false,
        error: "Server connection failed. Please ensure the backend is running.",
        success: false,
      });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs dark:shadow-black/50 transition-colors">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-transparent dark:border-indigo-800/40 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your Dwellio account</p>
        </div>

        {status.error && (
          <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{status.error}</span>
          </div>
        )}

        {status.success && (
          <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Login successful! Redirecting to your dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status.loading || status.success}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 mt-2"
          >
            {status.loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create an account here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
