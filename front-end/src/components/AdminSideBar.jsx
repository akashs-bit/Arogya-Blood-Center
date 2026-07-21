import {
  BarChart3,
  Bell,
  CalendarDays,
  Droplet,
  LayoutDashboard,
  LogOut,
  Plus,
  UsersRound,
  X,
  ChevronRight,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Donors", icon: UsersRound, to: "/admin/donors" },
  { label: "Alerts", icon: Bell, to: "/admin/alerts" },
  { label: "Camps", icon: CalendarDays, to: "/admin/camps" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports" },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // REMOVE TOKEN

    localStorage.removeItem("token");

    // REMOVE USER

    localStorage.removeItem("user");

    // SUCCESS MESSAGE

    toast.success("Logged out successfully ");

    // REDIRECT

    navigate("/");
  };

  const handleNavigate = (path) => {
    onClose?.();
    navigate(path);
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[285px]  flex-col overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-br from-red-700 via-red-800 to-red-950 p-6 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-red-700 shadow-lg">
                <Droplet size={30} fill="currentColor" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">Arogya</h1>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-100">
                  Component Blood Centre
                </p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-5">
          <div className="mb-3 px-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
              Main Menu
            </p>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/admin"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-red-700 text-white shadow-lg shadow-red-700/20"
                        : "text-slate-700 hover:bg-red-50 hover:text-red-700"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span
                          className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                            isActive
                              ? "bg-white/10"
                              : "bg-slate-100 group-hover:bg-red-100"
                          }`}
                        >
                          <Icon size={19} />
                        </span>

                        <span>{item.label}</span>
                      </div>

                      <ChevronRight
                        size={16}
                        className={`transition ${
                          isActive
                            ? "translate-x-1"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* QUICK ACTIONS */}

        <div className="border-t border-slate-200 p-4">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-900">
                Quick Actions
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Fast access admin controls
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 p-4">
              {/* ADD DONOR */}
              <button
                type="button"
                onClick={() => handleNavigate("/admin/donors")}
                className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50 hover:text-red-700 hover:shadow-lg hover:shadow-red-100"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-700 transition group-hover:scale-110">
                    <Plus size={18} />
                  </span>

                  <div className="text-left">
                    <p className="font-black">Add Donor</p>

                    <p className="text-xs font-medium text-slate-400">
                      Register new donor
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              {/* ALERT */}
              <button
                type="button"
                onClick={() => handleNavigate("/admin/alerts")}
                className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-lg hover:shadow-orange-100"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600 transition group-hover:scale-110">
                    <Bell size={18} />
                  </span>

                  <div className="text-left">
                    <p className="font-black">Emergency Alert</p>

                    <p className="text-xs font-medium text-slate-400">
                      Send urgent alerts
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              {/* CAMP */}
              <button
                type="button"
                onClick={() => handleNavigate("/admin/camps")}
                className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg hover:shadow-blue-100"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:scale-110">
                    <CalendarDays size={18} />
                  </span>

                  <div className="text-left">
                    <p className="font-black">Create Camp</p>

                    <p className="text-xs font-medium text-slate-400">
                      Organize donation camp
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 text-sm font-black text-red-700 transition-all duration-300 hover:bg-red-700 hover:text-white hover:shadow-lg hover:shadow-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
