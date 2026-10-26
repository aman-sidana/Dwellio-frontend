"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Edit, Trash2, Eye, Building } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function MyPropertiesContent({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const query = user.role === "super_admin" ? "limit=50" : `userId=${user.userId}&limit=50`;
      const res = await fetch(`http://localhost:5000/api/properties?${query}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setProperties(json.data?.properties || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {user?.role === "super_admin" ? "All Marketplace Properties" : "My Property Listings"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review, edit, and monitor your listed properties</p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Property
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading listings...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No properties posted yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Post your first property advertisement to start receiving buyer leads.</p>
          <Link
            href="/dashboard/properties/new"
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            Post Property
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {properties.map((p) => {
                  const img = p.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80";
                  return (
                    <tr key={p.propertyId} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <Image src={img} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block max-w-xs truncate">{p.title}</span>
                            <span className="text-slate-400 text-[11px]">{p.locality}, {p.city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                      </td>
                      <td className="px-6 py-4 uppercase font-semibold text-[11px] text-slate-500">
                        {p.listingType} • {p.propertyType?.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${p.propertyId}`}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/properties/${p.propertyId}/edit`}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                            title="Edit Listing"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "broker", "super_admin"]}>
      <MyPropertiesContent />
    </ProtectedRoute>
  );
}
