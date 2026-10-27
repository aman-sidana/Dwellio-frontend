"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";

function DashboardLayoutInner({ user, children }) {
  return (
    <div className="w-full min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative transition-colors duration-200">
      <DashboardSidebar user={user} />
      <div className="flex-1 w-full lg:pl-72 flex flex-col min-w-0">
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["owner", "broker", "super_admin"]}>
      {({ user }) => <DashboardLayoutInner user={user}>{children}</DashboardLayoutInner>}
    </ProtectedRoute>
  );
}
