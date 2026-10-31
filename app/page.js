"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Building2,
  Home as HomeIcon,
  Bed,
  Bath,
  Maximize2,
  Heart,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  PlusCircle
} from "lucide-react";
import { CITIES, PROPERTY_TYPES, BHK_OPTIONS } from "@/lib/constants";
import FavoriteButton from "@/components/FavoriteButton";

export default function Home() {

  // Search Bar State
  const [activeTab, setActiveTab] = useState("sale"); // 'sale' | 'rent' | 'commercial'
  const [city, setCity] = useState("Mumbai");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bhk, setBhk] = useState("");

  // Featured Properties State
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("http://localhost:5000/api/properties/featured?limit=6");
        if (res.ok) {
          const json = await res.json();
          setFeaturedProperties(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load featured properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeTab === "commercial") {
      params.append("propertyType", "commercial");
    } else {
      params.append("listingType", activeTab);
      if (propertyType) params.append("propertyType", propertyType);
    }
    if (city) params.append("city", city);
    if (bhk) params.append("bedrooms", bhk);
    if (searchQuery) params.append("search", searchQuery);

    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div className="w-full space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="w-full relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative w-full max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            India&apos;s Preferred Property Destination
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Find Your Dream Home on <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-blue-200 to-indigo-100">
              Dwellio
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Explore 10,000+ verified flats, luxury villas, and plots across Mumbai, Bangalore, Gurgaon, Pune, and Hyderabad.
          </p>

          {/* 99acres-Style Tabbed Search Container */}
          <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-slate-900/95 dark:backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl dark:shadow-black/60 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
            {/* Tabs (Buy / Rent / Commercial) */}
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("sale")}
                className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                  activeTab === "sale"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rent")}
                className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                  activeTab === "rent"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                Rent
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("commercial")}
                className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                  activeTab === "commercial"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                Commercial
              </button>
            </div>

            {/* Search Input Row */}
            <form onSubmit={handleSearch} className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-left">
                {/* City Dropdown */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Keyword / Locality Search */}
                <div className="md:col-span-6">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                    Locality / Project
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Bandra, Whitefield, Sector 62..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-3 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Pills (Property type & BHK) */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="font-semibold text-slate-400 dark:text-slate-400">Popular:</span>
                {BHK_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBhk(bhk === opt.value ? "" : opt.value)}
                    className={`px-3 py-1 rounded-full font-medium transition ${
                      bhk === opt.value
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                {PROPERTY_TYPES.slice(0, 3).map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setPropertyType(propertyType === pt.value ? "" : pt.value)}
                    className={`px-3 py-1 rounded-full font-medium transition ${
                      propertyType === pt.value
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-700/60"
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Handpicked for you</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Featured Properties</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Verified premium residences with top amenities</p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            View all properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-transparent dark:border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => {
              const imgUrl = p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
              return (
                <div
                  key={p.propertyId}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl dark:hover:border-slate-700 transition duration-300 group flex flex-col"
                >
                  <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider bg-slate-900/80 backdrop-blur-xs text-white">
                        {p.listingType === "sale" ? "For Sale" : "For Rent"}
                      </span>
                      <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider bg-amber-500 text-white">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <FavoriteButton propertyId={p.propertyId} />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                          {p.propertyType?.replace("_", " ")}
                        </span>
                      </div>

                      <Link href={`/properties/${p.propertyId}`}>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                          {p.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                        {p.locality}, {p.city}
                      </p>

                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {p.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            {p.bedrooms} Beds
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          {Number(p.areaSqFt).toLocaleString()} sq.ft
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                        By <span className="text-slate-700 dark:text-slate-300 font-medium">{p.owner?.name || "Owner"}</span>
                      </span>
                      <Link
                        href={`/properties/${p.propertyId}`}
                        className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 border border-transparent dark:border-indigo-800/40 rounded-lg text-xs font-semibold transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TOP METRO CITIES */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Explore by region</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Properties in Top Cities</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Find residential properties in prime metropolitan areas</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { city: "Mumbai", count: "3,400+ Properties", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80" },
            { city: "Bangalore", count: "4,200+ Properties", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80" },
            { city: "Gurgaon", count: "2,100+ Properties", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" },
            { city: "Pune", count: "1,800+ Properties", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80" },
            { city: "Hyderabad", count: "2,900+ Properties", img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" },
          ].map((item) => (
            <Link
              key={item.city}
              href={`/properties?city=${encodeURIComponent(item.city)}`}
              className="relative h-44 rounded-2xl overflow-hidden group shadow-xs hover:shadow-md border border-transparent dark:border-slate-800 transition"
            >
              <Image
                src={item.img}
                alt={item.city}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover group-hover:scale-110 transition duration-500 brightness-75 group-hover:brightness-60"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <h4 className="font-bold text-base">{item.city}</h4>
                <span className="text-[11px] text-slate-200">{item.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POST PROPERTY CALL TO ACTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-transparent dark:border-emerald-600/30">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 dark:bg-black/20 px-3 py-1 rounded-full">
              Post Property Free
            </span>
            <h3 className="text-3xl font-black">Sell or Rent Your Property Faster</h3>
            <p className="text-sm text-emerald-100 dark:text-emerald-200 leading-relaxed">
              Connect directly with genuine verified buyers and tenants. Zero brokerage, instant lead alerts, and maximum visibility on Dwellio.
            </p>
          </div>
          <Link
            href="/dashboard/properties/new"
            className="px-6 py-3.5 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-transparent dark:border-emerald-700/40 font-extrabold text-sm rounded-xl shadow-lg transition shrink-0"
          >
            Post Your Property Ad
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE DWELLIO */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">The Dwellio Edge</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Why Choose Dwellio?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-3 shadow-xs hover:shadow-lg dark:hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-transparent dark:border-indigo-800/40 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">100% Verified Listings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every property undergoes physical or document verification to prevent duplicate ads and spam.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-3 shadow-xs hover:shadow-lg dark:hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-transparent dark:border-blue-800/40 flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Direct Owner Contacts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Skip middlemen and connect with verified landlords and builders directly via enquiry forms.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-3 shadow-xs hover:shadow-lg dark:hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-transparent dark:border-emerald-800/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Transparent Pricing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No hidden fees or misleading quotes. Accurate carpet area calculations and price trends.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
