"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Search,
  Mail,
  Phone,
  Trash2,
  Calendar,
  Building2,
  ExternalLink,
  Shield,
  UserCheck,
} from "lucide-react";
import { getAuthHeaders } from "@/lib/auth";

export default function AdminOwnersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Failed to load owners", isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete owner "${name}"?`)) return;
    setActionLoading(userId);
    setFeedback({ message: "", isError: false });
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      setFeedback({ message: "Owner account removed successfully.", isError: false });
    } catch (err) {
      setFeedback({ message: err.message, isError: true });
    } finally {
      setActionLoading(null);
    }
  };

  const owners = users.filter((u) => u.role === "owner");
  const filteredOwners = owners.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
              Stakeholder Management
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Property Owners</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage individual property owners, direct home sellers, and their listed inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold">
            {owners.length} Registered Owners
          </span>
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

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search owners by name, email, or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Owners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading owner profiles...
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No registered property owners found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase font-semibold bg-slate-50/70">
                <tr>
                  <th className="px-5 py-3.5">Owner Profile</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Registered On</th>
                  <th className="px-5 py-3.5">Role Authorization</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOwners.map((owner) => {
                  const isUpdating = actionLoading === owner.userId;
                  return (
                    <tr key={owner.userId} className="hover:bg-slate-50/70 transition">
                      {/* Name & Avatar */}
                      <td className="px-5 py-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {owner.name?.slice(0, 2) || "OW"}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block truncate">
                              {owner.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              Account ID: #{owner.userId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{owner.email}</span>
                        </div>
                        {owner.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{owner.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(owner.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Registered Role */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Property Owner
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/properties?searchTerm=${encodeURIComponent(owner.name)}`}
                            title="View Listed Properties"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                          >
                            <Building2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(owner.userId, owner.name)}
                            disabled={isUpdating}
                            title="Delete Account"
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
