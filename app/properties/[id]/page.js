"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize2, Calendar, Building, CheckCircle, Phone, Mail,
  User, Heart, Share2, ShieldCheck, ChevronRight, ArrowLeft, MessageSquare,
  Lock, X, CheckCircle2, Send
} from "lucide-react";

import { getAuthHeaders, getToken } from "@/lib/auth";

export default function PropertyDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  // User auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I am interested in this property. Please share further details.",
  });
  const [enquiryStatus, setEnquiryStatus] = useState({ submitting: false, success: false, message: "" });

  // Pre-fill buyer details if logged in
  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setCurrentUser(json.data);
            setEnquiryForm((prev) => ({
              ...prev,
              name: json.data.name || prev.name || "",
              email: json.data.email || prev.email || "",
              phone: json.data.phone || prev.phone || "",
            }));
          }
        }
      } catch (err) {}
    }
    loadUser();
  }, []);

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

  const handleOpenEnquiry = () => {
    const token = getToken();
    if (!token) {
      setShowAuthModal(true);
    } else {
      setShowEnquiryModal(true);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus({ submitting: true, success: false, message: "" });
    try {
      const res = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
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
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/properties" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Properties</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{property.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Images, Specs, Amenities, Description) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Photo Gallery */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
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
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                      activeImg === idx ? "border-indigo-600 shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.imageUrl} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading & Key Specs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{property.title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  {property.address ? `${property.address}, ` : ""}{property.locality}, {property.city}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-3xl font-black text-indigo-700 dark:text-indigo-400">
                  {property.priceDisplay || `₹${Number(property.price).toLocaleString("en-IN")}`}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                  {property.listingType === "rent" ? "Monthly Rent" : "Asking Price"}
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Configuration</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">{property.bedrooms ? `${property.bedrooms} BHK` : "N/A"}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Super Area</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">{Number(property.areaSqFt).toLocaleString()} sq.ft</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Furnishing</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 capitalize">{property.furnishing?.replace("_", " ") || "Semi-furnished"}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase">Possession</span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5 capitalize">{property.possessionStatus?.replace("_", " ") || "Ready to Move"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About this property</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description || "No description provided for this listing."}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity.amenityId} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Contact Owner / Enquiry Card) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs sticky top-24">
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{property.owner?.name || "Property Owner"}</h3>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/80 border border-transparent dark:border-emerald-800/60 px-2 py-0.5 rounded-full inline-block">
                  Verified {property.owner?.role || "Seller"}
                </span>
              </div>
            </div>

            {/* Direct Contact info */}
            {property.owner?.phone && (
              <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/80 border border-transparent dark:border-slate-700/60 rounded-xl flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200">
                <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono font-semibold">{property.owner.phone}</span>
              </div>
            )}

            {/* Raise Enquiry Action CTA */}
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Interested in this property? Raise a direct enquiry to connect with {property.owner?.name || "the seller"}.
              </div>
              
              <button
                type="button"
                onClick={handleOpenEnquiry}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Raise Direct Enquiry
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Listing • Secure Direct Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Login Required Modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-slate-900 dark:text-slate-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/60 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-center text-slate-900 dark:text-white">
              Sign In to Raise Enquiry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 leading-relaxed">
              To connect directly with the seller and keep track of your active inquiries, please log in or create a free buyer account.
            </p>

            <div className="space-y-2.5 mt-6">
              <Link
                href={`/login?redirect=${encodeURIComponent(`/properties/${id}`)}`}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                Log In to Continue
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(`/properties/${id}`)}`}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Raise Enquiry Popup Modal */}
      {showEnquiryModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowEnquiryModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-900 dark:text-slate-100 transition-colors my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                  <Image
                    src={images[0]?.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {property.title}
                  </h3>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5">
                    {property.priceDisplay || `₹${Number(property.price).toLocaleString("en-IN")}`}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEnquiryModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6">
              {enquiryStatus.success ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Enquiry Submitted!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {property.owner?.name || "The property seller"} has received your enquiry and will connect with you via phone or email shortly.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEnquiryModal(false);
                        setEnquiryStatus({ submitting: false, success: false, message: "" });
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      Send Enquiry to {property.owner?.name || "Seller"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Verify your contact details so the owner can reach you.
                    </p>
                  </div>

                  {enquiryStatus.message && !enquiryStatus.success && (
                    <div className="p-3 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                      {enquiryStatus.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Your Message
                    </label>
                    <textarea
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Ask about floor plan, inspection timing, or price negotiation..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowEnquiryModal(false)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={enquiryStatus.submitting}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {enquiryStatus.submitting ? "Sending..." : "Submit Enquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
