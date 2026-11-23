"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, Home, Building2 } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

export default function UnauthorizedPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          setUser(json.data || null);
        }
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  return (
    <div className="w-full min-h-[65vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/40 p-8 sm:p-10 text-center shadow-lg dark:shadow-black/50 transition-colors">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/40 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Access Restricted (403)</h1>
        
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          You don&apos;t have sufficient permissions to access this page.
        </p>

        {user && (
          <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div>
              Signed in as <strong className="text-slate-900 dark:text-white">{user.name}</strong>
            </div>
            <div>
              Role: <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">{user.role}</span>
            </div>
            {user.role === "user" && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 mt-1">
                Owner &amp; Broker portals and property publishing tools require an Owner, Broker, or Admin account.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
          <Link
            href="/properties"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <Building2 className="w-4 h-4" /> Browse Properties
          </Link>
          <Link
            href="/favorites"
            className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            Saved Favorites
          </Link>
        </div>
      </div>
    </div>
  );
}
