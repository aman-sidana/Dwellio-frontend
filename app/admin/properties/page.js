"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Check, X, Eye, AlertCircle, ShieldAlert, ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function AdminPropertiesContent({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("http://localhost:5000/api/properties?limit=15", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          setProperties(json.data?.properties || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user && user.role === "super_admin") {
      fetchListings();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 py-16 text-center text-slate-500 text-sm">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Verifying administrator credentials...
      </div>
    );
  }

  // Security Guard: Prevent non-super_admin users from accessing
  if (!user || user.role !== "super_admin") {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Restricted Access Portal</h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            This administration portal is exclusively accessible to authorized <strong className="text-slate-900">Super Admins</strong>.
            {user ? (
              <span className="block mt-2 text-xs bg-slate-100 p-2 rounded-lg text-slate-700">
                You are currently signed in as <span className="font-bold">{user.name}</span> with role: <code className="font-mono text-indigo-700 uppercase font-bold">{user.role}</code>.
              </span>
            ) : (
              <span className="block mt-2 text-xs text-slate-500">
                You are not currently logged in.
              </span>
            )}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </Link>
            {!user && (
              <Link
                href="/login?redirect=/admin/properties"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Sign In as Super Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Super Admin Listing Moderation</h1>
          <p className="text-sm text-slate-500">Review, approve, or reject property advertisements across India</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading admin data...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Submitted Listings ({properties.length})
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Super Admin Session Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase font-semibold bg-white">
                <tr>
                  <th className="px-6 py-3.5">Property</th>
                  <th className="px-6 py-3.5">Owner / Agent</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {properties.map((p) => (
                  <tr key={p.propertyId} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block max-w-sm truncate">{p.title}</span>
                      <span className="text-slate-400 text-[11px]">{p.locality}, {p.city}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">{p.owner?.name || "User"}</span>
                      <span className="text-slate-400 text-[11px]">{p.owner?.email || "verified"}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/properties/${p.propertyId}`}
                          className="px-2.5 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition"
                        >
                          Review
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <AdminPropertiesContent />
    </ProtectedRoute>
  );
}
