"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { CITIES, PROPERTY_TYPES, BHK_OPTIONS } from "@/lib/constants";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function EditPropertyContent({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ saving: false, error: "", success: false });

  // AI Description Generator State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const isPlot = form?.propertyType === "plot";
  const isCommercial = form?.propertyType === "commercial";

  const handleGenerateWithAI = async () => {
    if (!form) return;
    setAiLoading(true);
    setAiError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/property-description`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          propertyType: form.propertyType,
          bedrooms: isPlot || isCommercial ? null : form.bedrooms,
          bathrooms: isPlot ? null : form.bathrooms,
          city: form.city,
          locality: form.locality,
          areaSqFt: form.areaSqFt,
          price: form.price,
          furnishing: isPlot ? "unfurnished" : form.furnishing,
          listingType: form.listingType,
          currentTitle: form.title,
        }),
      });

      const json = await res.json();

      if (res.ok && json.data?.description) {
        setForm((prev) => ({
          ...prev,
          description: json.data.description,
        }));
      } else {
        setAiError(json.message || "Failed to generate AI description");
      }
    } catch (err) {
      setAiError(err.message || "Network error while connecting to AI service");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    async function loadProperty() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          areaSqFt: parseFloat(form.areaSqFt),
          bedrooms: isPlot || isCommercial ? null : (form.bedrooms ? parseInt(form.bedrooms, 10) : null),
          bathrooms: isPlot ? null : (form.bathrooms ? parseInt(form.bathrooms, 10) : null),
          furnishing: isPlot ? "unfurnished" : (form.furnishing || "unfurnished"),
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Listing Purpose</label>
              <select
                value={form.listingType || "sale"}
                onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="sale" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Sell (For Sale)</option>
                <option value="rent" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Rent (For Lease)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Property Category</label>
              <select
                value={form.propertyType || "apartment"}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{pt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {form.listingType === "rent" ? "Monthly Rent (₹)" : "Price (₹)"}
              </label>
              <input
                type="number"
                required
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isPlot ? "Plot / Land Area (sq.ft)" : isCommercial ? "Commercial Space Area (sq.ft)" : "Area (sq.ft)"}
              </label>
              <input
                type="number"
                required
                value={form.areaSqFt || ""}
                onChange={(e) => setForm({ ...form, areaSqFt: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
            </div>
          </div>

          {/* Dynamic Category Configurations */}
          {isPlot ? (
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                Plot & Land Specifications
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Plot Facing & Layout
                  </label>
                  <select
                    value={form.plotFacing || "East Facing"}
                    onChange={(e) => setForm({ ...form, plotFacing: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    <option value="East Facing">East Facing (Vaastu Compliant)</option>
                    <option value="North Facing">North Facing</option>
                    <option value="Corner Plot (2 Sides Open)">Corner Plot (2 Sides Open)</option>
                    <option value="Main Road Facing (3+ Sides Open)">Main Road Facing (3+ Sides Open)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Boundary Wall Status
                  </label>
                  <select
                    value={form.boundaryStatus || "Gated Community"}
                    onChange={(e) => setForm({ ...form, boundaryStatus: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    <option value="Gated Community">Gated Community / Township</option>
                    <option value="Boundary Wall Constructed">Boundary Wall Constructed</option>
                    <option value="No Boundary Wall">Open / No Boundary Wall</option>
                  </select>
                </div>
              </div>
            </div>
          ) : isCommercial ? (
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
                Commercial Office & Retail Specs
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Commercial Fit-out & Furnishing
                  </label>
                  <select
                    value={form.furnishing || "unfurnished"}
                    onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                  >
                    <option value="unfurnished">Bare Shell (Raw Space)</option>
                    <option value="semi_furnished">Semi-Fitted (Flooring + AC Ready)</option>
                    <option value="fully_furnished">Plug & Play Fully Furnished Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Washrooms / Restrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.bathrooms || ""}
                    onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                    placeholder="e.g. 2 Washrooms"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bedrooms (BHK)</label>
                <select
                  value={form.bedrooms || ""}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                >
                  {BHK_OPTIONS.map((bhk) => (
                    <option key={bhk.value} value={bhk.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{bhk.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  value={form.bathrooms || ""}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Furnishing</label>
                <select
                  value={form.furnishing || "unfurnished"}
                  onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
                >
                  <option value="unfurnished" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Unfurnished</option>
                  <option value="semi_furnished" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Semi-Furnished</option>
                  <option value="fully_furnished" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Fully Furnished</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
              <select
                value={form.city || ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-medium"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Locality</label>
              <input
                type="text"
                required
                value={form.locality || ""}
                onChange={(e) => setForm({ ...form, locality: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Property Description
              </label>
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-xl transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span>Writing Copy with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Regenerate with AI</span>
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
                {aiError}
              </div>
            )}

            <textarea
              rows={6}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe amenities, highlights, neighborhood, transport connectivity, or click 'Regenerate with AI'..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
            />
          </div>

          <button
            type="submit"
            disabled={status.saving}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition cursor-pointer"
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
