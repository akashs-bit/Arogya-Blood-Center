import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";

import AdminSideBar from "../../AdminSideBar";
import AdminTopbar from "../../AdminTopbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  // GET USER

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // BLOCK NON-ADMIN USERS

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      {/* Desktop Layout */}

      <div className="lg:grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}

        <AdminSideBar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />

        {/* Main Content */}

        <div className="min-w-0">
          {/* Topbar */}

          <AdminTopbar
            onMenuClick={() =>
              setIsSidebarOpen(true)
            }
          />

          {/* Page Content */}

          <main className="w-full p-3 sm:p-5 lg:p-7">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;