"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Phone, Mail, Calendar, User, CheckCircle } from "lucide-react";
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
        } else {
          // Fallback to property enquiries
          const fallbackRes = await fetch("http://localhost:5000/api/enquiries/property/1", {
            headers: getAuthHeaders(),
          });
          if (fallbackRes.ok) {
            const fallbackJson = await fallbackRes.json();
            setEnquiries(fallbackJson.data || []);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadEnquiries();
  }, [user]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Buyer & Renter Enquiries</h1>
        <p className="text-sm text-slate-500 mt-1">Direct contact requests submitted by interested customers</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No enquiries received yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When buyers click &quot;Contact Owner&quot; on your listings, their inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div key={enq.enquiryId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">{enq.name}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {enq.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-500" /> {enq.email}</span>
                  <span className="flex items-center gap-1 font-mono"><Phone className="w-3.5 h-3.5 text-indigo-500" /> {enq.phone}</span>
                </div>
                {enq.message && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl mt-2 italic">
                    &quot;{enq.message}&quot;
                  </p>
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
