"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getAuthHeaders } from "../lib/auth";

export default function FavoriteButton({ propertyId, initialFavorite = false, onToggle, className = "" }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkFav() {
      if (!propertyId) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/favorites/check?propertyId=${propertyId}`,
          { headers: getAuthHeaders() }
        );
        if (res.ok) {
          const json = await res.json();
          setIsFavorite(!!json.data?.isFavorite);
        }
      } catch (err) {
      }
    }
    checkFav();
  }, [propertyId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    const prev = isFavorite;
    setIsFavorite(!prev);

    try {
      const res = await fetch("http://localhost:5000/api/favorites/toggle", {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ propertyId }),
      });

      if (res.status === 401) {
        setIsFavorite(prev);
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        setIsFavorite(prev);
      } else if (onToggle) {
        onToggle(!prev);
      }
    } catch (err) {
      setIsFavorite(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      type="button"
      title={isFavorite ? "Remove from Saved" : "Save Property"}
      className={`p-2 rounded-full transition shadow-xs flex items-center justify-center ${isFavorite
        ? "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/80"
        : "bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600"
        } ${className}`}
    >
      <Heart className={`w-4 h-4 transition-transform ${isFavorite ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
    </button>
  );
}
