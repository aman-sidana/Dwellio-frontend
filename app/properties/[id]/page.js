"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize2, Calendar, Building, CheckCircle, Phone, Mail,
  User, Heart, Share2, ShieldCheck, ChevronRight, ArrowLeft
} from "lucide-react";

export default function PropertyDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I am interested in this property. Please share further details.",
  });
  const [enquiryStatus, setEnquiryStatus] = useState({ submitting: false, success: false, message: "" });

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (res.ok) {
          const json = await res.json();
          setProperty(json.data);
        }
      } catch (err) {
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus({ submitting: true, success: false, message: "" });
    try {
      const res = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: id,
          ...enquiryForm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnquiryStatus({
          submitting: false,
          success: true,
          message: "Enquiry submitted! The seller will get in touch with you shortly.",
        });
        setEnquiryForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setEnquiryStatus({ submitting: false, success: false, message: data.message || "Failed to submit enquiry." });
      }
    } catch (err) {
      setEnquiryStatus({ submitting: false, success: false, message: err.message || "Connection error." });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Property Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The property listing you requested is not available or has expired.</p>
        <Link href="/properties" className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
          Back to Search
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" }];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/properties" className="hover:text-indigo-600">Properties</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-medium truncate max-w-xs">{property.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Images, Specs, Amenities, Description) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Photo Gallery */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative h-72 sm:h-96 w-full bg-slate-900">
              <Image
                src={images[activeImg]?.imageUrl || images[0].imageUrl}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider bg-slate-900/80 backdrop-blur-xs text-white">
                  {property.listingType === "sale" ? "For Sale" : "For Rent"}
                </span>
                {property.featured && (
                  <span className="px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider bg-amber-500 text-white">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${activeImg === idx ? "border-indigo-600 shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                  >
                    <Image src={img.imageUrl} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading & Key Specs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{property.title}</h1>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  {property.address ? `${property.address}, ` : ""}{property.locality}, {property.city}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-3xl font-black text-indigo-700">
                  {property.priceDisplay || `₹${Number(property.price).toLocaleString("en-IN")}`}
                </div>
                <span className="text-xs text-slate-400 capitalize">
                  {property.listingType === "rent" ? "Monthly Rent" : "Asking Price"}
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Configuration</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{property.bedrooms ? `${property.bedrooms} BHK` : "N/A"}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Super Area</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{Number(property.areaSqFt).toLocaleString()} sq.ft</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Furnishing</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5 capitalize">{property.furnishing?.replace("_", " ") || "Semi-furnished"}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Possession</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5 capitalize">{property.possessionStatus?.replace("_", " ") || "Ready to Move"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About this property</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description || "No description provided for this listing."}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity.amenityId} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Contact Owner / Enquiry Card) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24">
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{property.owner?.name || "Property Owner"}</h3>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  Verified {property.owner?.role || "Seller"}
                </span>
              </div>
            </div>

            {/* Direct Contact info */}
            {property.owner?.phone && (
              <div className="my-4 p-3 bg-slate-50 rounded-xl flex items-center gap-3 text-xs text-slate-700">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span className="font-mono font-semibold">{property.owner.phone}</span>
              </div>
            )}

            {/* Enquiry Form */}
            <form onSubmit={handleEnquirySubmit} className="space-y-3 mt-4">
              <h4 className="text-sm font-bold text-slate-800">Send Direct Enquiry</h4>

              {enquiryStatus.message && (
                <div className={`p-3 rounded-xl text-xs ${enquiryStatus.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}>
                  {enquiryStatus.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Message</label>
                <textarea
                  rows={3}
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={enquiryStatus.submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                {enquiryStatus.submitting ? "Submitting..." : "Contact Owner Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
