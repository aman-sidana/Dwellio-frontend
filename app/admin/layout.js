"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";

function AdminLayoutInner({ user, children }) {
  return (
    <div className="w-full min-h-screen bg-slate-100/70 text-slate-900 flex flex-col lg:flex-row relative">
      <AdminSidebar user={user} />
      <div className="flex-1 w-full lg:pl-72 flex flex-col min-w-0">
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      {({ user }) => <AdminLayoutInner user={user}>{children}</AdminLayoutInner>}
    </ProtectedRoute>
  );
}
