"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Building2, Heart, PlusCircle, User, Menu, X, Shield, LogOut } from "lucide-react";
import { getAuthHeaders, removeToken, getToken } from "../lib/auth";
import { ThemeToggle } from "@/context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = getToken();
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          setUser(json.data || null);
        } else {
          removeToken();
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/";
  };

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-xs transition-colors duration-200">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Dwell<span className="text-indigo-600 dark:text-indigo-400">io</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase -mt-1">
                Real Estate Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Link href="/properties?listingType=sale" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Buy
            </Link>
            <Link href="/properties?listingType=rent" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Rent
            </Link>
            <Link href="/properties?propertyType=commercial" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Commercial
            </Link>
            <Link href="/properties" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Explore All
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              href="/favorites"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              Post Property <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">FREE</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "super_admin" ? "/admin" : "/dashboard"}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 rounded-xl transition"
                >
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-md">
                    {user.role}
                  </span>
                </Link>

                {user.role === "super_admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-xl transition shadow-xs"
                    title="Super Admin Portal"
                  >
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/properties/new" className="p-2 text-emerald-600 dark:text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 transition-colors duration-200">
          {user && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{user.name}</span>
                <span className="text-slate-500 dark:text-slate-400">{user.email}</span>
              </div>
              <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {user.role}
              </span>
            </div>
          )}

          <Link
            href="/properties?listingType=sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Buy Properties
          </Link>
          <Link
            href="/properties?listingType=rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Rent Properties
          </Link>
          <Link
            href="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Explore All Properties
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Saved Favorites
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Dashboard
          </Link>

          {user?.role === "super_admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/40 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/40"
            >
              Super Admin Dashboard
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
