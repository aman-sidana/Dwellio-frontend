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
        const res = await fetch("http://localhost:5000/api/users/me", {
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
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 sm:p-10 text-center shadow-lg">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Access Restricted (403)</h1>
        
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          You don&apos;t have sufficient permissions to access this page.
        </p>

        {user && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            Signed in as <strong className="text-slate-900">{user.name}</strong>
            <div className="mt-1">
              Role: <span className="font-bold uppercase text-indigo-600">{user.role}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
          <Link
            href="/properties"
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <Building2 className="w-4 h-4" /> Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
