"use client";

import Link from "next/link";
import { Building2, PlusCircle, MessageSquare, Heart, Shield, Settings, TrendingUp, Users } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

function DashboardContent({ user }) {

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Owner & Agent Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your active listings, customer leads, and account</p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Property
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">My Listings</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">6 Active</div>
          <span className="text-xs text-emerald-600 font-medium">Published on portal</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Buyer Enquiries</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">12 Leads</div>
          <span className="text-xs text-indigo-600 font-medium">3 unread messages</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Shortlists</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">45 Times</div>
          <span className="text-xs text-slate-400 font-medium">Saved by buyers</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Listing Views</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-3">1,240</div>
          <span className="text-xs text-emerald-600 font-medium">+18% this week</span>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/properties"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition group"
        >
          <Building2 className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition" />
          <h3 className="text-base font-bold text-slate-900">Manage Properties</h3>
          <p className="text-xs text-slate-500 mt-1">View, edit price, update images, and toggle listing status.</p>
        </Link>

        <Link
          href="/dashboard/enquiries"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition group"
        >
          <MessageSquare className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition" />
          <h3 className="text-base font-bold text-slate-900">Customer Enquiries</h3>
          <p className="text-xs text-slate-500 mt-1">Review contact numbers and messages submitted by interested buyers.</p>
        </Link>

        {/* Conditionally rendered only for super_admin */}
        {user?.role === "super_admin" && (
          <Link
            href="/admin/properties"
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition group"
          >
            <Shield className="w-8 h-8 text-amber-600 mb-3 group-hover:scale-110 transition" />
            <h3 className="text-base font-bold text-slate-900">Admin Approval</h3>
            <p className="text-xs text-slate-500 mt-1">Review pending properties, approve verified ads, or reject spam.</p>
          </Link>
        )}
      </div>

      {/* Role Permissions Matrix */}
      <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-black text-slate-900 mb-2">Platform Roles & Capabilities</h3>
        <p className="text-xs text-slate-500 mb-6">Dwellio operates with 4 defined role levels:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Role 1: Super Admin */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                super_admin
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Super Admin</h4>
            <p className="text-xs text-slate-600 mt-1">Platform Manager</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li>• Approve / reject property listings</li>
              <li>• Manage owners, brokers & users</li>
              <li>• Suspend accounts / remove spam</li>
              <li>• View platform statistics & reports</li>
            </ul>
          </div>

          {/* Role 2: Broker */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                broker
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Broker / Agent</h4>
            <p className="text-xs text-slate-600 mt-1">Property Professional</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li>• List properties for multiple clients</li>
              <li>• Manage photos, pricing & amenities</li>
              <li>• Receive direct buyer enquiry leads</li>
              <li>• Track performance across listings</li>
            </ul>
          </div>

          {/* Role 3: Property Owner */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                owner
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Property Owner</h4>
            <p className="text-xs text-slate-600 mt-1">Direct Landlord / Seller</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li>• Post own property for sale or rent</li>
              <li>• Zero brokerage listing management</li>
              <li>• Respond to tenant & buyer leads</li>
              <li>• Manage only personal listings</li>
            </ul>
          </div>

          {/* Role 4: User / Buyer / Renter */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                user
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">User / Buyer / Renter</h4>
            <p className="text-xs text-slate-600 mt-1">Property Seeker</p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              <li>• Search across cities, BHK & budgets</li>
              <li>• View photos & verified amenities</li>
              <li>• Shortlist favorites for quick access</li>
              <li>• Contact owners and brokers directly</li>
            </ul>
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
