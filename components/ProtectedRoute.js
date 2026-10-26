"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { getAuthHeaders } from "../lib/auth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const rolesKey = allowedRoles.join(",");

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (isMounted) {
            const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
          return;
        }

        const data = await response.json();
        const currentUser = data.data;

        if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
          if (isMounted) {
            window.location.href = "/unauthorized";
          }
          return;
        }

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        if (isMounted) {
          const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [rolesKey]);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium text-sm">Verifying login session...</p>
      </div>
    );
  }

  // Not logged in yet
  if (!user) {
    return null;
  }

  // Role restriction fallback
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 mt-2">
            This section requires one of the following roles:{" "}
            <strong className="text-slate-700">{allowedRoles.join(", ")}</strong>. Your current role is{" "}
            <code className="text-indigo-600 font-bold uppercase">{user.role}</code>.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Provide user to children via function or clone with user prop
  if (typeof children === "function") {
    return children({ user });
  }

  if (React.isValidElement(children)) {
    return React.cloneElement(children, { user });
  }

  return children;
}
