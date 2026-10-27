"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Query with allStatuses=true to fetch all listings (sold, available, pending, rented)
      const res = await fetch("http://localhost:5000/api/properties?allStatuses=true&limit=100", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setProperties(json.data?.properties || []);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Failed to load properties", isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusChange = async (propertyId, newStatus) => {
    setActionLoading(propertyId);
    setFeedback({ message: "", isError: false });
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setProperties((prev) =>
        prev.map((p) => (p.propertyId === propertyId ? { ...p, status: newStatus } : p))
      );
      setFeedback({ message: `Property status updated to "${newStatus}"!`, isError: false });
    } catch (err) {
      setFeedback({ message: err.message, isError: true });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (propertyId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    setActionLoading(propertyId);
    setFeedback({ message: "", isError: false });
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to delete property");
      }

      setProperties((prev) => prev.filter((p) => p.propertyId !== propertyId));
      setFeedback({ message: "Property removed successfully.", isError: false });
    } catch (err) {
      setFeedback({ message: err.message, isError: true });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter properties by tab & search query
  const filtered = properties.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      p.title?.toLowerCase().includes(query) ||
      p.city?.toLowerCase().includes(query) ||
      p.locality?.toLowerCase().includes(query) ||
      p.owner?.name?.toLowerCase().includes(query) ||
      p.owner?.email?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const countByStatus = {
    all: properties.length,
    sold: properties.filter((p) => p.status === "sold").length,
    available: properties.filter((p) => p.status === "available").length,
    pending: properties.filter((p) => p.status === "pending").length,
    rented: properties.filter((p) => p.status === "rented").length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
              Inventory Control
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Property Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage all listings, mark properties as Sold, Available, or Pending, and review submissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/properties/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            + Add Property
          </Link>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.isError
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback({ message: "", isError: false })}
            className="font-bold underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {[
            { key: "all", label: "All Properties", color: "indigo" },
            { key: "sold", label: "Sold", color: "emerald" },
            { key: "available", label: "Available", color: "blue" },
            { key: "pending", label: "Pending Review", color: "amber" },
            { key: "rented", label: "Rented", color: "purple" },
          ].map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                    active
                      ? "bg-white/20 text-white"
                      : tab.key === "sold"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200/80 text-slate-700"
                  }`}
                >
                  {countByStatus[tab.key] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search listings by title, city, locality, owner name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading listings database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No properties found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase font-semibold bg-slate-50/70">
                <tr>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-5 py-3.5">Owner / Broker</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Type / Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((p) => {
                  const isSold = p.status === "sold";
                  const isUpdating = actionLoading === p.propertyId;
                  return (
                    <tr
                      key={p.propertyId}
                      className={`hover:bg-slate-50/70 transition ${
                        isSold ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      {/* Property Details */}
                      <td className="px-5 py-4 min-w-[220px]">
                        <span className="font-bold text-slate-900 block truncate max-w-xs">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          ID: #{p.propertyId} • {p.bedrooms ? `${p.bedrooms} BHK ` : ""}
                          {p.areaSqFt} sq.ft
                        </span>
                      </td>

                      {/* Owner Details */}
                      <td className="px-5 py-4 min-w-[160px]">
                        <span className="font-semibold text-slate-800 block truncate">
                          {p.owner?.name || "Direct Owner"}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {p.owner?.role || "user"}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">
                            {p.owner?.phone || p.owner?.email}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-black text-slate-900">
                        {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                      </td>

                      {/* Location & Type */}
                      <td className="px-5 py-4">
                        <span className="capitalize font-semibold text-slate-800 block">
                          {p.propertyType?.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {p.locality}, {p.city}
                        </span>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="px-5 py-4">
                        <select
                          value={p.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(p.propertyId, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none transition cursor-pointer ${
                            isSold
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold"
                              : p.status === "available"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : p.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          <option value="available">🟢 Available</option>
                          <option value="sold">🏷️ Sold</option>
                          <option value="pending">⏳ Pending</option>
                          <option value="rented">🟣 Rented</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/properties/${p.propertyId}`}
                            target="_blank"
                            title="Preview on Public Website"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.propertyId, p.title)}
                            disabled={isUpdating}
                            title="Delete Listing"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
