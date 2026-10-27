"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Briefcase,
  Home,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Eye,
  AlertCircle,
  Tag,
  DollarSign,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("Failed to load admin statistics");
      }
      const json = await res.json();
      setStats(json.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching admin statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatPrice = (val) => {
    const num = Number(val) || 0;
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lac`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">
          Loading Super Admin metrics & analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
        <h3 className="font-bold text-base">Unable to load dashboard</h3>
        <p className="text-xs text-rose-600 mt-1">{error}</p>
        <button
          onClick={() => fetchStats(true)}
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const properties = stats?.properties || {
    total: 0,
    sold: 0,
    available: 0,
    rented: 0,
    pending: 0,
    soldValue: 0,
    totalValue: 0,
  };

  const users = stats?.users || {
    total: 0,
    owners: 0,
    brokers: 0,
    regularUsers: 0,
    superAdmins: 0,
  };

  const totalProps = Math.max(properties.total, 1);
  const soldPercent = Math.round((properties.sold / totalProps) * 100);
  const availPercent = Math.round((properties.available / totalProps) * 100);
  const pendingPercent = Math.round((properties.pending / totalProps) * 100);
  const rentedPercent = Math.round((properties.rented / totalProps) * 100);

  const totalUsersCount = Math.max(users.total, 1);
  const ownerPercent = Math.round((users.owners / totalUsersCount) * 100);
  const brokerPercent = Math.round((users.brokers / totalUsersCount) * 100);
  const userPercent = Math.round((users.regularUsers / totalUsersCount) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
              Super Admin Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Platform Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time monitoring of property sales, inventory turnover, and stakeholder accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
          <Link
            href="/admin/properties"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            Manage Listings
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (Properties & Sold metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Properties Sold Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
          <div className="absolute right-2 -bottom-2 opacity-10">
            <TrendingUp className="w-28 h-28" />
          </div>
          <div className="flex items-center justify-between text-emerald-100">
            <span className="text-xs font-bold uppercase tracking-wider">Properties Sold</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase">
              Completed
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black">{properties.sold}</span>
            <span className="text-xs font-medium text-emerald-100">
              ({soldPercent}% of inventory)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-emerald-100">Total Sold Volume:</span>
            <span className="font-extrabold text-white text-sm">
              {formatPrice(properties.soldValue)}
            </span>
          </div>
        </div>

        {/* Total Properties Listed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Properties
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              {properties.total}
            </span>
            <span className="text-xs text-slate-400 font-medium">All Time</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Available on Portal:</span>
            <span className="font-bold text-emerald-600">{properties.available} units</span>
          </div>
        </div>

        {/* Total Users / Stakeholders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Stakeholders
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">
              {users.total}
            </span>
            <span className="text-xs text-slate-400 font-medium">Registered</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Home Buyers:</span>
            <span className="font-bold text-slate-900">{users.regularUsers} users</span>
          </div>
        </div>

        {/* Gross Listed Inventory Value */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gross Listed Asset Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatPrice(properties.totalValue)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Pending Review:</span>
            <span className="font-bold text-amber-600">{properties.pending} units</span>
          </div>
        </div>
      </div>

      {/* Stakeholders Breakdown (Owners, Brokers, Regular Users) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Owners Card */}
        <Link
          href="/admin/owners"
          className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Property Owners
              </div>
              <div className="text-xl font-black text-slate-900">{users.owners}</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition" />
        </Link>

        {/* Brokers Card */}
        <Link
          href="/admin/brokers"
          className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Brokers & Agents
              </div>
              <div className="text-xl font-black text-slate-900">{users.brokers}</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition" />
        </Link>

        {/* Regular Users Card */}
        <Link
          href="/admin/users"
          className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Home Buyers / Users
              </div>
              <div className="text-xl font-black text-slate-900">{users.regularUsers}</div>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition" />
        </Link>
      </div>

      {/* Visual Analytics Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Property Inventory Breakdown
              </h2>
              <p className="text-xs text-slate-500">Distribution by current listing status</p>
            </div>
            <Link
              href="/admin/properties"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Multi-colored Progress Bar */}
          <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden mb-4 shadow-inner">
            <div
              style={{ width: `${soldPercent}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Sold: ${properties.sold} (${soldPercent}%)`}
            />
            <div
              style={{ width: `${availPercent}%` }}
              className="bg-indigo-600 transition-all duration-500"
              title={`Available: ${properties.available} (${availPercent}%)`}
            />
            <div
              style={{ width: `${pendingPercent}%` }}
              className="bg-amber-400 transition-all duration-500"
              title={`Pending: ${properties.pending} (${pendingPercent}%)`}
            />
            <div
              style={{ width: `${rentedPercent}%` }}
              className="bg-purple-500 transition-all duration-500"
              title={`Rented: ${properties.rented} (${rentedPercent}%)`}
            />
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Sold
              </div>
              <div className="text-lg font-black text-emerald-900 mt-1">{properties.sold}</div>
              <div className="text-[10px] text-emerald-600 font-medium">{soldPercent}% of total</div>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-1.5 text-indigo-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                Available
              </div>
              <div className="text-lg font-black text-indigo-900 mt-1">{properties.available}</div>
              <div className="text-[10px] text-indigo-600 font-medium">{availPercent}% of total</div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                Pending
              </div>
              <div className="text-lg font-black text-amber-900 mt-1">{properties.pending}</div>
              <div className="text-[10px] text-amber-600 font-medium">{pendingPercent}% of total</div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-1.5 text-purple-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                Rented
              </div>
              <div className="text-lg font-black text-purple-900 mt-1">{properties.rented}</div>
              <div className="text-[10px] text-purple-600 font-medium">{rentedPercent}% of total</div>
            </div>
          </div>
        </div>

        {/* Stakeholder Composition */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                User Role Composition
              </h2>
              <p className="text-xs text-slate-500">Breakdown of registered accounts</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Manage Users <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Multi-colored Progress Bar */}
          <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden mb-4 shadow-inner">
            <div
              style={{ width: `${ownerPercent}%` }}
              className="bg-blue-600 transition-all duration-500"
              title={`Owners: ${users.owners} (${ownerPercent}%)`}
            />
            <div
              style={{ width: `${brokerPercent}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Brokers: ${users.brokers} (${brokerPercent}%)`}
            />
            <div
              style={{ width: `${userPercent}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Buyers: ${users.regularUsers} (${userPercent}%)`}
            />
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <Link
              href="/admin/owners"
              className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 hover:bg-blue-100/60 transition"
            >
              <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Owners
              </div>
              <div className="text-xl font-black text-blue-900 mt-1">{users.owners}</div>
              <div className="text-[10px] text-blue-600 font-medium">{ownerPercent}% of users</div>
            </Link>

            <Link
              href="/admin/brokers"
              className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 hover:bg-amber-100/60 transition"
            >
              <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Brokers
              </div>
              <div className="text-xl font-black text-amber-900 mt-1">{users.brokers}</div>
              <div className="text-[10px] text-amber-600 font-medium">{brokerPercent}% of users</div>
            </Link>

            <Link
              href="/admin/users"
              className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-100/60 transition"
            >
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Buyers
              </div>
              <div className="text-xl font-black text-emerald-900 mt-1">{users.regularUsers}</div>
              <div className="text-[10px] text-emerald-600 font-medium">{userPercent}% of users</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Tables: Recent Properties & Stakeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-800">
              Recent Listings & Sold Activity
            </h3>
            <Link
              href="/admin/properties"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              See All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {stats?.recentProperties?.length > 0 ? (
              stats.recentProperties.map((p) => {
                const isSold = p.status === "sold";
                return (
                  <div
                    key={p.propertyId}
                    className="p-3.5 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{p.title}</span>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isSold
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : p.status === "available"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {p.locality}, {p.city} • Owner:{" "}
                        <span className="text-slate-600 font-medium">{p.owner?.name || "User"}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-slate-900">
                        {p.priceDisplay || formatPrice(p.price)}
                      </div>
                      <Link
                        href={`/properties/${p.propertyId}`}
                        className="text-[11px] text-indigo-600 font-bold hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">No properties found</div>
            )}
          </div>
        </div>

        {/* Recent Registered Stakeholders */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-800">
              Recent Registered Stakeholders
            </h3>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              See All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {stats?.recentUsers?.length > 0 ? (
              stats.recentUsers.map((u) => (
                <div
                  key={u.userId}
                  className="p-3.5 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {u.name?.slice(0, 2) || "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{u.name}</div>
                      <div className="text-slate-400 text-[11px] truncate">{u.email}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        u.role === "owner"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : u.role === "broker"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : u.role === "super_admin"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {u.role}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">No users registered yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
