"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, UploadCloud, CheckCircle } from "lucide-react";
import { CITIES, PROPERTY_TYPES, BHK_OPTIONS } from "@/lib/constants";

import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function NewPropertyContent({ user }) {

  const [form, setForm] = useState({
    userId: user?.userId || 1,
    title: "",
    description: "",
    listingType: "sale",
    propertyType: "apartment",
    price: "",
    bedrooms: "3",
    bathrooms: "2",
    balconies: "1",
    areaSqFt: "",
    furnishing: "semi_furnished",
    city: "Mumbai",
    locality: "",
    address: "",
    pincode: "",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  });

  const [status, setStatus] = useState({ loading: false, error: "", success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: false });

    try {
      const res = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          ...form,
          userId: user?.userId || form.userId || 1,
          price: parseFloat(form.price),
          areaSqFt: parseFloat(form.areaSqFt),
          bedrooms: form.bedrooms ? parseInt(form.bedrooms, 10) : null,
          bathrooms: form.bathrooms ? parseInt(form.bathrooms, 10) : null,
          balconies: form.balconies ? parseInt(form.balconies, 10) : 0,
          images: form.imageUrl ? [form.imageUrl] : [],
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setStatus({ loading: false, error: "", success: true });
        setTimeout(() => {
          window.location.href = `/properties/${json.data.propertyId}`;
        }, 1200);
      } else {
        setStatus({ loading: false, error: json.message || "Failed to publish property", success: false });
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message || "Network error", success: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/dashboard/properties" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Properties
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Post Property Advertisement</h1>
          <p className="text-sm text-slate-500 mt-1">Publish your residential or commercial property on Dwellio</p>
        </div>

        {status.error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Property listed successfully! Redirecting to listing...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Listing Intent & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listing Purpose</label>
              <select
                value={form.listingType}
                onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="sale">Sell (For Sale)</option>
                <option value="rent">Rent (For Lease)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Property Category</label>
              <select
                value={form.propertyType}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Listing Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Spacious 3 BHK Sea-Facing Apartment in Bandra West"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Pricing & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {form.listingType === "rent" ? "Monthly Rent (₹)" : "Expected Price (₹)"}
              </label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 7500000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Carpet / Super Area (sq.ft)</label>
              <input
                type="number"
                required
                value={form.areaSqFt}
                onChange={(e) => setForm({ ...form, areaSqFt: e.target.value })}
                placeholder="e.g. 1450"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Configurations: BHK, Bathrooms, Furnishing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms (BHK)</label>
              <select
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {BHK_OPTIONS.map((bhk) => (
                  <option key={bhk.value} value={bhk.value}>{bhk.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Furnishing</label>
              <select
                value={form.furnishing}
                onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi_furnished">Semi-Furnished</option>
                <option value="fully_furnished">Fully Furnished</option>
              </select>
            </div>
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Sector</label>
              <input
                type="text"
                required
                value={form.locality}
                onChange={(e) => setForm({ ...form, locality: e.target.value })}
                placeholder="e.g. Whitefield or Indiranagar"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Image URL (Cloudinary / Unsplash demonstration) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Property Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Property Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe amenities, highlights, neighborhood, transport connectivity..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-xs"
          >
            {status.loading ? "Publishing Property..." : "Publish Listing for Free"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewPropertyPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "broker", "super_admin"]}>
      <NewPropertyContent />
    </ProtectedRoute>
  );
}
