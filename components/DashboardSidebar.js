"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  Heart,
  Globe,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Briefcase,
  Home,
  UserCheck,
} from "lucide-react";
import { removeToken } from "../lib/auth";
import { ThemeToggle } from "@/context/ThemeContext";

const navItems = [
  {
    name: "Dashboard Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Analytics & lead performance",
  },
  {
    name: "My Properties",
    href: "/dashboard/properties",
    icon: Building2,
    description: "Manage listings & status",
  },
  {
    name: "Post New Property",
    href: "/dashboard/properties/new",
    icon: PlusCircle,
    description: "Upload photos & publish",
    badge: "FREE",
  },
  {
    name: "Buyer Enquiries",
    href: "/dashboard/enquiries",
    icon: MessageSquare,
    description: "Customer calls & leads",
  },
  {
    name: "Saved Properties",
    href: "/favorites",
    icon: Heart,
    description: "Your shortlisted homes",
  },
];

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const isBroker = user?.role === "broker";
  const isSuperAdmin = user?.role === "super_admin";

  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : isBroker
      ? "Licensed Broker"
      : "Verified Owner";

  const roleBadgeStyle = isSuperAdmin
    ? "bg-amber-400/20 text-amber-300 border-amber-400/30"
    : isBroker
      ? "bg-blue-400/20 text-blue-300 border-blue-400/30"
      : "bg-emerald-400/20 text-emerald-300 border-emerald-400/30";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              {isBroker ? <Briefcase className="w-5 h-5" /> : <Home className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white">
                  Dwell<span className="text-emerald-400">io</span>
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${roleBadgeStyle}`}>
                  {user?.role || "Owner"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {isBroker ? "Broker Workspace" : "Owner Portal"}
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Mini Profile Card */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{user?.name || "Account User"}</p>
          <p className="text-[11px] text-slate-400 truncate">{user?.email || ""}</p>
        </div>
        <div className="shrink-0">
          <UserCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
          Workspace Navigation
        </div>

        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                active
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400 group-hover:text-emerald-400"} transition-colors`} />
                <div>
                  <span className="block leading-tight">{item.name}</span>
                  <span className={`text-[10px] ${active ? "text-emerald-100" : "text-slate-400"} font-normal`}>
                    {item.description}
                  </span>
                </div>
              </div>

              {item.badge ? (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {item.badge}
                </span>
              ) : active ? (
                <ChevronRight className="w-4 h-4 text-emerald-200" />
              ) : null}
            </Link>
          );
        })}

        {/* Super admin quick switch if applicable */}
        {isSuperAdmin && (
          <div className="pt-2">
            <Link
              href="/admin"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Super Admin Panel</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] text-slate-400">Theme Preference</span>
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Globe className="w-4 h-4 text-indigo-400" />
          <span>Back to Marketplace</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm text-white">
            Dwell<span className="text-emerald-400">io</span>
          </span>
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${roleBadgeStyle}`}>
            {user?.role || "Owner"}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/dashboard/properties/new"
            className="p-1.5 bg-emerald-600 text-white rounded-lg"
            title="Post Property"
          >
            <PlusCircle className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-72 z-30 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (with Backdrop) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
