"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Edit,
  Eye,
  Building,
  MapPin,
  Tag,
  X,
  ExternalLink,
  Bed,
  Bath,
  Maximize2,
  Armchair,
  Layers,
  Calendar,
  Car,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function PropertyPreviewModal({ property, onClose }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!property) return null;

  const images =
    property.images && property.images.length > 0
      ? property.images.map((img) => img.imageUrl || img)
      : [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        ];

  const currentImage = images[activeImageIdx] || images[0];

  const formatPrice = (val) => {
    if (!val) return "Price on Request";
    const num = Number(val);
    if (isNaN(num)) return val;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto relative text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40 sticky top-0 z-10">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  property.status === "available"
                    ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : property.status === "sold"
                    ? "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                }`}
              >
                {property.status || "available"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {property.listingType === "rent" ? "For Rent" : "For Sale"} •{" "}
                {property.propertyType?.replace("_", " ") || "Property"}
              </span>
              {property.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
              {property.title}
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {property.locality ? `${property.locality}, ` : ""}
                {property.city}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Gallery Display */}
          <div className="space-y-3">
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              <Image
                src={currentImage}
                alt={property.title || "Property"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                Photo {activeImageIdx + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Carousel (if multiple photos) */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIdx === idx
                        ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105"
                        : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={imgUrl} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                Listing Price
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                {property.priceDisplay || formatPrice(property.price)}
              </div>
            </div>
            {property.areaSqFt && (
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Rate</span>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  ≈ ₹{Math.round(Number(property.price) / Number(property.areaSqFt)).toLocaleString("en-IN")}/sq.ft
                </div>
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Property Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Bed className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Bedrooms</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {property.bedrooms ? `${property.bedrooms} BHK` : "N/A"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Bath className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Bathrooms</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {property.bathrooms ? `${property.bathrooms} Baths` : "N/A"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Maximize2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Carpet Area</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {property.areaSqFt ? `${property.areaSqFt} sq.ft` : "N/A"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Armchair className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Furnishing</div>
                  <div className="font-bold text-slate-900 dark:text-white capitalize">
                    {property.furnishing ? property.furnishing.replace("_", " ") : "N/A"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Floor</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {property.floorNo !== undefined && property.floorNo !== null
                      ? `${property.floorNo} of ${property.totalFloors || "—"}`
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Possession</div>
                  <div className="font-bold text-slate-900 dark:text-white capitalize">
                    {property.possessionStatus
                      ? property.possessionStatus.replace("_", " ")
                      : "Ready to Move"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Car className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Parking</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {property.parking ? "Available" : "Not Included"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
                <Building className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px]">Balconies</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {property.balconies !== undefined && property.balconies !== null
                      ? `${property.balconies}`
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Address Info */}
          {(property.address || property.pincode) && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Exact Address: </span>
              <span className="text-slate-600 dark:text-slate-400">
                {property.address ? `${property.address}, ` : ""}
                {property.locality}, {property.city}
                {property.pincode ? ` - ${property.pincode}` : ""}
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Property Description
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line max-h-56 overflow-y-auto">
              {property.description || "No detailed description provided for this listing."}
            </div>
          </div>

          {/* Amenities & Highlights */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Amenities & Facilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a, i) => (
                  <span
                    key={a.amenityId || i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {a.name || a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/properties/${property.propertyId}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Edit className="w-4 h-4" />
              Edit Property
            </Link>
            <a
              href={`/properties/${property.propertyId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition"
            >
              Public Page
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function MyPropertiesContent({ user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

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
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {user?.role === "super_admin" ? "All Marketplace Properties" : "My Property Listings"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, edit price, update photos, and track availability
          </p>
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
        <div className="text-center py-16 text-slate-400 text-sm">Loading your properties...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto shadow-xs">
          <Building className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No properties posted yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5 leading-relaxed">
            Post your first property advertisement with high-resolution photos to start receiving direct buyer enquiries.
          </p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            Post First Property
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {properties.map((p) => {
                  const img =
                    p.images?.[0]?.imageUrl ||
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80";
                  return (
                    <tr key={p.propertyId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image src={img} alt="" fill className="object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block max-w-xs truncate">
                              {p.title}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-[11px] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {p.locality}, {p.city}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {p.priceDisplay || `₹${Number(p.price).toLocaleString("en-IN")}`}
                      </td>
                      <td className="px-6 py-4 uppercase font-semibold text-[11px] text-slate-500 dark:text-slate-400">
                        {p.listingType} • {p.propertyType?.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === "available"
                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}>
                          {p.status || "available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedProperty(p)}
                            className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                            title="Quick Preview Property"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/dashboard/properties/${p.propertyId}/edit`}
                            className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
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

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyPreviewModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
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
