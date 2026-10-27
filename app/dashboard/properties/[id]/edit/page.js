"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { CITIES, PROPERTY_TYPES, BHK_OPTIONS } from "@/lib/constants";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function EditPropertyContent({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ saving: false, error: "", success: false });

  useEffect(() => {
    async function loadProperty() {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (res.ok) {
          const json = await res.json();
          setForm(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ saving: true, error: "", success: false });

    try {
      const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          areaSqFt: parseFloat(form.areaSqFt),
          bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
          city: form.city,
          locality: form.locality,
          listingType: form.listingType,
          propertyType: form.propertyType,
        }),
      });

      if (res.ok) {
        setStatus({ saving: false, error: "", success: true });
        setTimeout(() => {
          window.location.href = `/properties/${id}`;
        }, 1000);
      } else {
        const json = await res.json();
        setStatus({ saving: false, error: json.message || "Failed to update property", success: false });
      }
    } catch (err) {
      setStatus({ saving: false, error: err.message, success: false });
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-sm">Loading listing details...</div>;
  }

  if (!form) {
    return <div className="text-center py-16 text-slate-800 font-bold">Property not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link href="/dashboard/properties" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Properties
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Edit Property #{id}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update price, title, or details for your listing</p>

        {status.error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Changes saved! Redirecting to updated page...
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area (sq.ft)</label>
              <input
                type="number"
                required
                value={form.areaSqFt || ""}
                onChange={(e) => setForm({ ...form, areaSqFt: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <select
                value={form.city || ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Locality</label>
              <input
                type="text"
                required
                value={form.locality || ""}
                onChange={(e) => setForm({ ...form, locality: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={status.saving}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition"
          >
            {status.saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditPropertyPage(props) {
  return (
    <ProtectedRoute allowedRoles={["owner", "broker", "super_admin"]}>
      <EditPropertyContent {...props} />
    </ProtectedRoute>
  );
}
