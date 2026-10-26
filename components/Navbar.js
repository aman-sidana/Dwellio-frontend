"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Building2, Heart, PlusCircle, User, Menu, X, Shield, LogOut } from "lucide-react";
import { getAuthHeaders, removeToken, getToken } from "../lib/auth";

export default function Navbar() {
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

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
    removeToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Dwell<span className="text-indigo-600">io</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Real Estate Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/properties?listingType=sale" className="hover:text-indigo-600 transition-colors">
              Buy
            </Link>
            <Link href="/properties?listingType=rent" className="hover:text-indigo-600 transition-colors">
              Rent
            </Link>
            <Link href="/properties?propertyType=commercial" className="hover:text-indigo-600 transition-colors">
              Commercial
            </Link>
            <Link href="/properties" className="hover:text-indigo-600 transition-colors">
              Explore All
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/favorites"
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition-colors"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard/properties/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              Post Property <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">FREE</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md">
                    {user.role}
                  </span>
                </Link>

                {user.role === "super_admin" && (
                  <Link
                    href="/admin/properties"
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition"
                    title="Super Admin Verification"
                  >
                    <Shield className="w-5 h-5" />
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/dashboard/properties/new" className="p-2 text-emerald-600">
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{user.name}</span>
                <span className="text-slate-500">{user.email}</span>
              </div>
              <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-indigo-100 text-indigo-700">
                {user.role}
              </span>
            </div>
          )}

          <Link
            href="/properties?listingType=sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Buy Properties
          </Link>
          <Link
            href="/properties?listingType=rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Rent Properties
          </Link>
          <Link
            href="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Explore All Properties
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Saved Favorites
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
          >
            Dashboard
          </Link>

          {user?.role === "super_admin" && (
            <Link
              href="/admin/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-amber-700 rounded-lg hover:bg-amber-50"
            >
              Admin Moderation Panel
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-sm font-semibold text-rose-600 border border-rose-200 rounded-xl"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl"
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
