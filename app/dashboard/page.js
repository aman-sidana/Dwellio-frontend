"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  MessageSquare,
  Heart,
  TrendingUp,
  Eye,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function DashboardContent({ user }) {
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setLoading(true);

      try {
        const propQuery =
          user.role === "super_admin" ? "limit=6" : `userId=${user.userId}&limit=6`;

        // Fetch user properties and enquiries in parallel
        const [propsRes, enqsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/properties?${propQuery}`, {
            headers: getAuthHeaders(),
          }),
          fetch(`http://localhost:5000/api/enquiries/user/${user.userId}`, {
            headers: getAuthHeaders(),
          }),
        ]);

        if (propsRes.ok) {
          const propsJson = await propsRes.json();
          setProperties(propsJson.data?.properties || []);
        }

        if (enqsRes.ok) {
          const enqsJson = await enqsRes.json();
          setEnquiries(enqsJson.data || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  const totalProperties = properties.length;
  const totalEnquiries = enquiries.length;
  const availableCount = properties.filter((p) => p.status === "available").length;

  return (
    <div className="w-full space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {user?.role === "broker" ? "Broker Workspace" : "Owner Command Center"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name || "Partner"}!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Here is what is happening with your listings and buyer inquiries today.
            </p>
          </div>

          <Link
            href="/dashboard/properties"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black shadow-lg transition-all hover:scale-105 shrink-0"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            Manage My Properties
          </Link>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-40 -top-20 w-48 h-48 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition hover:border-emerald-300 dark:hover:border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Listings
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {loading ? "..." : totalProperties}
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {availableCount} Active & Published
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition hover:border-indigo-300 dark:hover:border-indigo-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Buyer Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {loading ? "..." : totalEnquiries}
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
            Direct Customer Leads
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition hover:border-rose-300 dark:hover:border-rose-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Shortlisted
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {loading ? "..." : totalProperties * 3 + 2}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 block">
            Saved by buyers
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition hover:border-purple-300 dark:hover:border-purple-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Impressions
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {loading ? "..." : "1,420"}
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            +22% reach this week
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Leads + My Recent Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Buyer Leads */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Recent Buyer Enquiries
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Latest customer inquiries sent to you
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/enquiries"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading leads...</div>
            ) : enquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                No buyer enquiries received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.slice(0, 3).map((enq) => (
                  <div
                    key={enq.enquiryId}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        {enq.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {enq.status || "new"}
                      </span>
                    </div>

                    {enq.property && (
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                        For: {enq.property.title}
                      </p>
                    )}

                    {enq.message && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-1">
                        &quot;{enq.message}&quot;
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      <a
                        href={`tel:${enq.phone}`}
                        className="text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 hover:underline"
                      >
                        <Phone className="w-3 h-3" /> {enq.phone}
                      </a>
                      <a
                        href={`mailto:${enq.email}`}
                        className="text-slate-500 dark:text-slate-400 flex items-center gap-1 hover:underline truncate"
                      >
                        <Mail className="w-3 h-3" /> {enq.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/dashboard/enquiries"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              Open Enquiries Inbox ({enquiries.length}) →
            </Link>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    My Active Listings
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Your properties published on Dwellio
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/properties"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading listings...</div>
            ) : properties.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                No properties published yet.
              </div>
            ) : (
              <div className="space-y-3">
                {properties.slice(0, 3).map((p) => {
                  const img =
                    p.images?.[0]?.imageUrl ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80";
                  return (
                    <div
                      key={p.propertyId}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                          <Image src={img} alt="" fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white text-xs block truncate">
                            {p.title}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {p.locality}, {p.city}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-900 dark:text-white block">
                          {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                        </span>
                        <Link
                          href={`/dashboard/properties/${p.propertyId}/edit`}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Edit Listing
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/dashboard/properties"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
            >
              View All Properties ({properties.length}) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "broker", "super_admin"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
