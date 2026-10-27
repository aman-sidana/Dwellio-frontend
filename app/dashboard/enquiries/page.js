"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Phone, Mail, Calendar, Building2, MapPin, ExternalLink } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAuthHeaders } from "@/lib/auth";

function EnquiriesContent({ user }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEnquiries() {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/enquiries/user/${user.userId}`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          setEnquiries(json.data || []);
        }
      } catch (e) {
        console.error("Error loading enquiries:", e);
      } finally {
        setLoading(false);
      }
    }
    loadEnquiries();
  }, [user]);

  return (
    <div className="w-full space-y-6 transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Buyer & Renter Enquiries</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Direct customer leads received for your property listings
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No enquiries received yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            When buyers or renters click &quot;Contact Owner Now&quot; on your property listings, their inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.enquiryId}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left: Customer Info & Message */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">
                      {enq.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {enq.status || "new"}
                    </span>
                    {enq.createdAt && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Customer Contact details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <a
                      href={`mailto:${enq.email}`}
                      className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{enq.email}</span>
                    </a>
                    <a
                      href={`tel:${enq.phone}`}
                      className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{enq.phone}</span>
                    </a>
                  </div>

                  {/* Message body */}
                  {enq.message && (
                    <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 rounded-xl mt-2 italic leading-relaxed">
                      &quot;{enq.message}&quot;
                    </div>
                  )}
                </div>

                {/* Right: Associated Property */}
                {enq.property && (
                  <div className="md:w-72 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="uppercase font-semibold tracking-wider flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Inquired Property
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {enq.property.priceDisplay}
                      </span>
                    </div>

                    <Link
                      href={`/properties/${enq.property.propertyId}`}
                      className="font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2 block transition group"
                    >
                      {enq.property.title}
                      <ExternalLink className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {enq.property.locality && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{enq.property.locality}, {enq.property.city}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EnquiriesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "broker", "super_admin"]}>
      <EnquiriesContent />
    </ProtectedRoute>
  );
}
