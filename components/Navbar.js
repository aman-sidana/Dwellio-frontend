"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Building2,
  Heart,
  PlusCircle,
  User,
  Menu,
  X,
  Shield,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  MessageSquare,
  Compass,
} from "lucide-react";
import { getAuthHeaders, removeToken, getToken } from "../lib/auth";
import { useTheme, ThemeToggle } from "@/context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    async function loadUser() {
      try {
        const token = getToken();
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    if (dropdownOpen || mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen, mobileMenuOpen]);

  const logout = () => {
    removeToken();
    setUser(null);
    setDropdownOpen(false);
    window.location.href = "/";
  };

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  const canPublishProperty =
    user?.role === "owner" || user?.role === "broker" || user?.role === "super_admin";

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-200">
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

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // ===============================================================
              // Authenticated View: Clean Icon-Only Trigger + Dropdown Modal
              // ===============================================================
              <div className="relative flex items-center gap-3" ref={dropdownRef}>
                {canPublishProperty && (
                  <Link
                    href="/dashboard/properties/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Property</span>
                    <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold">
                      FREE
                    </span>
                  </Link>
                )}

                {/* Theme Toggle Button next to Profile Icon */}
                <ThemeToggle />

                {/* Profile Icon-Only Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-label="User Account Menu"
                  title={user.name}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs border ${
                    dropdownOpen
                      ? "bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-500/20 scale-105"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Dropdown Modal Container */}
                {dropdownOpen && (
                  <>
                    {/* Semi-transparent Backdrop Overlay */}
                    <div
                      className="fixed inset-0 bg-slate-950/30 dark:bg-black/60 backdrop-blur-xs z-50 transition-opacity"
                      onClick={() => setDropdownOpen(false)}
                      aria-hidden="true"
                    />

                    {/* Floating Dropdown Modal Dialog */}
                    <div
                      className="fixed sm:absolute right-4 sm:right-0 top-18 sm:top-14 w-[calc(100vw-2rem)] sm:w-84 max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl dark:shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
                      role="dialog"
                      aria-modal="true"
                      aria-label="User Account Profile"
                    >
                      {/* Modal Header */}
                      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-800/50 dark:to-slate-900">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md uppercase tracking-wider">
                              {user.name?.slice(0, 2) || "U"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                                {user.name}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setDropdownOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            aria-label="Close modal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Modal Body / Navigation Links */}
                      <div className="p-2 space-y-1">
                        {/* Super Admin Options */}
                        {user.role === "super_admin" && (
                          <>
                            <Link
                              href="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                            >
                              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <div className="flex-1">
                                <span className="block">Super Admin Console</span>
                                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 block">
                                  Platform overview & user management
                                </span>
                              </div>
                            </Link>
                            <Link
                              href="/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                              <span>Owner & Broker Portal</span>
                            </Link>
                          </>
                        )}

                        {/* Owner / Broker Options */}
                        {(user.role === "owner" || user.role === "broker") && (
                          <>
                            <Link
                              href="/dashboard"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <div className="flex-1">
                                <span className="block">Dashboard Overview</span>
                                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 block">
                                  Analytics & lead performance
                                </span>
                              </div>
                            </Link>
                            <Link
                              href="/dashboard/properties"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                              <span>My Property Listings</span>
                            </Link>
                            <Link
                              href="/dashboard/enquiries"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                              <span>Buyer Enquiries</span>
                            </Link>
                            <Link
                              href="/dashboard/properties/new"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                            >
                              <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span>Post New Property</span>
                            </Link>
                          </>
                        )}

                        {/* Standard User (Buyer/Tenant) - Safe links only (NO /dashboard to prevent 403) */}
                        {user.role === "user" && (
                          <Link
                            href="/properties"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <div className="flex-1">
                              <span className="block font-bold">Explore Marketplace</span>
                              <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 block">
                                Search verified flats, villas & plots
                              </span>
                            </div>
                          </Link>
                        )}

                        {/* Saved Favorites Link */}
                        <Link
                          href="/favorites"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition"
                        >
                          <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 text-rose-500" />
                            <div>
                              <span className="block font-bold">Saved Favorites</span>
                              <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 block">
                                View shortlisted homes
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                            Wishlist
                          </span>
                        </Link>
                      </div>

                      {/* Logout Row */}
                      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer shadow-xs"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // ===============================================================
              // Guest View (Not Logged In): Theme, Favorites, Post Ad & Auth
              // ===============================================================
              <>
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
                  <span>Post Property</span>
                  <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold">
                    FREE
                  </span>
                </Link>

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
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                aria-label="User Account"
              >
                <User className="w-4 h-4" />
              </button>
            ) : (
              <ThemeToggle />
            )}

            {canPublishProperty && (
              <Link
                href="/dashboard/properties/new"
                className="p-2 text-emerald-600 dark:text-emerald-400"
              >
                <PlusCircle className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 transition-colors duration-200">
          {user && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {user.name}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{user.email}</span>
              </div>
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

          {/* Only show dashboard to owners, brokers, and admins (never regular users) */}
          {user &&
            (user.role === "owner" || user.role === "broker" || user.role === "super_admin") && (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                Dashboard
              </Link>
            )}

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
