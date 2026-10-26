"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Building, ArrowRight, MapPin, Bed, Maximize2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FavoriteButton from "@/components/FavoriteButton";
import { getAuthHeaders } from "@/lib/auth";

function FavoritesContent({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/user/${user.userId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setFavorites(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-rose-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Saved Properties</h1>
          <p className="text-sm text-slate-500">Track and review all the homes you have shortlisted</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No properties saved yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Click the heart icon on any property card to save it here for quick access later.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Explore Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const p = fav.property;
            if (!p) return null;
            const primaryImg = p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
            return (
              <div
                key={fav.favoriteId || p.propertyId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col"
              >
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={primaryImg}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md tracking-wider bg-slate-900/80 backdrop-blur-xs text-white">
                      {p.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton
                      propertyId={p.propertyId}
                      initialFavorite={true}
                      onToggle={() => loadFavorites()}
                    />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="text-2xl font-black text-slate-900">
                        {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                      </div>
                      <span className="text-xs text-slate-500 font-medium capitalize">
                        {p.propertyType?.replace("_", " ")}
                      </span>
                    </div>

                    <Link href={`/properties/${p.propertyId}`}>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1 hover:text-indigo-600 transition">
                        {p.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {p.locality}, {p.city}
                    </p>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                      {p.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-indigo-600" />
                          {p.bedrooms} Beds
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4 text-indigo-600" />
                        {Number(p.areaSqFt).toLocaleString()} sq.ft
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/properties/${p.propertyId}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}
